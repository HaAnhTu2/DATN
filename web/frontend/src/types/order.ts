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
    order_id: string
    id_user: string
    fullname: string
    phone: string
    order_date: string
    shipping_address: string
    shipping_method: string
    payment_method: string
    total_amount: number
    note: string
}

export interface OrderDetail {
    id_order: string
    id_product_detail: string
    quantity: number
    price: number
}