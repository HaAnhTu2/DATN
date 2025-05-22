import { ProductDetail } from "./product";

export interface CartItem {
    id: string;
    product_id: string;
    productname: string;
    cartquantity: number;
    price: number;
    subtotal: number;
}

// export interface Cart {
//     id: string;
//     cart_id: string;
//     line_items: CartItem[];
// }

export interface Cart {
    id_product_detail: string;
    id_user: string;
    quantity: number;
}

 export interface CartProduct {
  detail: ProductDetail;
  cartQuantity: number;
}