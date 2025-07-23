import { Component, inject } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '@services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.component.html',
  styles: ``,
})
export class ProductDetailComponent {
  cartService = inject(CartService);
  route = inject(ActivatedRoute)
  productService = inject(ProductService);
  router = inject(Router);

  productId: string = '';
  product: Product | any = null;
  isLoading: boolean = false;

  // Fetch Product
  fetchProduct() {
    this.isLoading = true;
    try {
      this.productService.getProductById(this.productId).subscribe({
        next: (res) => {
          this.product = res.data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Lỗi khi lấy sản phẩm', err);
          this.isLoading = false;
        },
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Add to cart - updated to work with new CartService
  addToCart(quantity: number = 1) {
    if (!this.product) {
      console.error('Không có sản phẩm để thêm vào giỏ hàng');
      return;
    }

    this.cartService.addToCart(this.product, quantity).subscribe({
      next: (res) => {
        if (res?.statusCode === 200 && res.success) {
          console.log('Đã thêm sản phẩm vào giỏ hàng');
          this.router.navigate(['/cart']);
        }
      },
      error: (err) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', err);
      }
    });
  }

  ngOnInit() {
    console.log('🟢 ngOnInit');
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id && id !== this.productId) {
        this.productId = id;
        this.fetchProduct();
      }
    });
  }

  ngOnDestroy(): void {
    console.log('🔴 ngOnDestroy');
  }
}
