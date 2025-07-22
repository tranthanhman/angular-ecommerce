import {Product} from "./product.model";

export interface CartInfo {
  id: string;
  items: CartItem[];
  cartTotal: number;
  discountedTotal: number;
}

export interface CartItem {
  id: number;
  coupon: null | any;
  product: Product;
  quantity: number;
}
