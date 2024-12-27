export interface CartItem {
    id: string;
    userid: string;
    productname: string;
    brand: string;
    producttype: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    ordercart: CartItem[];
    totalPrice: number;
    discount: number;
    paymentMethod: string;
    barcode: string;
}
