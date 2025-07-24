import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CartInfo, CartItem } from '@models/cart.model';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@utils/api';
import { AuthService } from './auth.service';
import { Product } from '@models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  private readonly localKey = 'cart';
  private readonly url = `${environment.apiUrl}/ecommerce/cart`;

  // 🌐 Check if running in browser
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // 🎯 Reactive State với Signals
  private _cartState = signal<CartInfo>({
    id: '',
    items: [],
    cartTotal: 0,
    discountedTotal: 0,
  });

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // 📖 Public readonly signals
  cart = this._cartState.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // 🧮 Computed signals
  itemCount = computed(() =>
    this.cart().items.reduce((total, item) => total + item.quantity, 0)
  );

  isEmpty = computed(() => this.cart().items.length === 0);

  totalAmount = computed(() => this.cart().cartTotal);

  // 🚀 Initialize cart on service creation
  initializeCart(): void {
    if (this.auth.isAuthenticated()) {
      this.loadServerCart();
    } else {
      this.loadLocalCart();
    }
  }

  // 📥 Load cart từ server
  private loadServerCart(): void {
    this._loading.set(true);
    this._error.set(null);

    this.getCart().subscribe({
      next: (response) => {
        if (response?.statusCode === 200 && response.success) {
          this._cartState.set(response.data);
        }
        this._loading.set(false);
      },
      error: (error) => {
        this._error.set('Failed to load cart from server');
        this._loading.set(false);
        console.error('Error loading server cart:', error);
      }
    });
  }

  // 📥 Load cart từ localStorage (chỉ trong browser)
  private loadLocalCart(): void {
    if (!this.isBrowser) {
      // ⚠️ Server-side: trả về empty cart
      this._cartState.set({
        id: 'local-cart',
        items: [],
        cartTotal: 0,
        discountedTotal: 0,
      });
      return;
    }

    try {
      const localCart = this.getLocalCart();
      this._cartState.set(localCart);
    } catch (error) {
      this._error.set('Failed to load local cart');
      console.error('Error loading local cart:', error);
    }
  }

  // 🔄 Refresh cart manually
  refreshCart(): void {
    if (this.isBrowser) {
      this.initializeCart();
    }
  }

  // 🛒 Add product to cart
  addToCart(product: Product, quantity: number = 1): Observable<ApiResponse<CartInfo> | null> {
    this._loading.set(true);
    this._error.set(null);

    if (this.auth.isAuthenticated()) {
      return this.addToServerCart(product._id, quantity).pipe(
        tap((response) => {
          if (response.success) {
            this._cartState.set(response.data);
          }
          this._loading.set(false);
        }),
        catchError((error) => {
          this._error.set('Failed to add item to cart');
          this._loading.set(false);
          throw error;
        })
      );
    } else {
      // ⚠️ Chỉ thực hiện localStorage operations trong browser
      if (!this.isBrowser) {
        this._loading.set(false);
        return of({
          success: false,
          statusCode: 400,
          message: 'Cannot add to cart on server side',
          data: this._cartState()
        } as ApiResponse<CartInfo>);
      }

      try {
        this.addToLocalCart(product, quantity);
        const updatedCart = this.getLocalCart();
        this._cartState.set(updatedCart);
        this._loading.set(false);

        return of({
          success: true,
          statusCode: 200,
          message: 'Item added to local cart',
          data: updatedCart
        } as ApiResponse<CartInfo>);
      } catch (error) {
        this._error.set('Failed to add item to local cart');
        this._loading.set(false);
        throw error;
      }
    }
  }

  // 🗑️ Remove item from cart
  removeCartItem(productId: string): Observable<ApiResponse<CartInfo>> {
    this._loading.set(true);
    this._error.set(null);

    if (this.auth.isAuthenticated()) {
      return this.http.delete<ApiResponse<CartInfo>>(`${this.url}/item/${productId}`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }).pipe(
        tap((response) => {
          if (response.success) {
            this._cartState.set(response.data);
          }
          this._loading.set(false);
        }),
        catchError((error) => {
          this._error.set('Failed to remove item from cart');
          this._loading.set(false);
          throw error;
        })
      );
    } else {
      // ⚠️ Chỉ thực hiện localStorage operations trong browser
      if (!this.isBrowser) {
        this._loading.set(false);
        return of({
          success: false,
          statusCode: 400,
          message: 'Cannot remove from cart on server side',
          data: this._cartState()
        } as ApiResponse<CartInfo>);
      }

      try {
        this.removeFromLocalCart(productId);
        const updatedCart = this.getLocalCart();
        this._cartState.set(updatedCart);
        this._loading.set(false);

        return of({
          success: true,
          statusCode: 200,
          message: 'Item removed from local cart',
          data: updatedCart
        } as ApiResponse<CartInfo>);
      } catch (error) {
        this._error.set('Failed to remove item from local cart');
        this._loading.set(false);
        throw error;
      }
    }
  }

  // 📊 Update item quantity
  updateQuantity(productId: string, quantity: number): void {
    if (!this.isBrowser) return; // ⚠️ Skip trên server

    const currentCart = this._cartState();
    const updatedItems = currentCart.items.map(item => {
      if (item.product._id === productId) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });

    const cartTotal = updatedItems.reduce((total, item) =>
      total + (item.product.price * item.quantity), 0);

    const updatedCart: CartInfo = {
      ...currentCart,
      items: updatedItems,
      cartTotal,
      discountedTotal: cartTotal,
    };

    this._cartState.set(updatedCart);

    // Sync với localStorage hoặc server
    if (this.auth.isAuthenticated()) {
      this.addToServerCart(productId, quantity);
    } else {
      this.saveToLocalStorage(updatedItems);
    }
  }

  // 🧹 Clear cart
  clearCart(): void {
    const emptyCart: CartInfo = {
      id: this.auth.isAuthenticated() ? this._cartState().id : 'local-cart',
      items: [],
      cartTotal: 0,
      discountedTotal: 0,
    };

    this._cartState.set(emptyCart);

    if (!this.auth.isAuthenticated() && this.isBrowser) {
      localStorage.removeItem(this.localKey);
    }
  }

  // 🔍 Check if product is in cart
  isInCart(productId: string): boolean {
    return this.cart().items.some(item => item.product._id === productId);
  }

  // 📈 Get product quantity in cart
  getProductQuantity(productId: string): number {
    const item = this.cart().items.find(item => item.product._id === productId);
    return item?.quantity || 0;
  }

  // 🔑 Safe token getter
  private getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  // 💾 Safe localStorage operations
  private saveToLocalStorage(items: CartItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.localKey, JSON.stringify(items));
    }
  }

  private getFromLocalStorage(): CartItem[] {
    if (!this.isBrowser) return [];

    try {
      const data = localStorage.getItem(this.localKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
      return [];
    }
  }

  // Private helper methods
  private getCart(): Observable<ApiResponse<CartInfo>> {
    return this.http.get<ApiResponse<CartInfo>>(this.url, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  private getLocalCart(): CartInfo {
    const items = this.getFromLocalStorage();
    const cartTotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    return {
      id: 'local-cart',
      items,
      cartTotal,
      discountedTotal: cartTotal,
    };
  }

  private addToLocalCart(product: Product, quantity: number): void {
    if (!this.isBrowser) return;

    const cartInfo = this.getLocalCart();
    const existing = cartInfo.items.find((x) => x.product._id === product._id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cartInfo.items.push({
        product,
        quantity,
        id: cartInfo.items.length > 0 ? Math.max(...cartInfo.items.map(item => item.id)) + 1 : 1,
        coupon: null,
      });
    }

    this.saveToLocalStorage(cartInfo.items);
  }

  private removeFromLocalCart(productId: string): void {
    if (!this.isBrowser) return;

    const cartInfo = this.getLocalCart();
    const filteredItems = cartInfo.items.filter(item => item.product._id !== productId);
    this.saveToLocalStorage(filteredItems);
  }

  private addToServerCart(productId: string, quantity: number): Observable<ApiResponse<CartInfo>> {
    const token = this.getToken();
    return this.http.post<ApiResponse<CartInfo>>(
      `${this.url}/item/${productId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
