export interface Product {
    product_id: string
    id_producer: string
    id_category: string
    name: string
    description: string
    information: string
    price: number
    status: string
    image: File
}

export interface ProductDetail {
    product_detail_id: string
    id_product: string
    color: string
    size: string
    quantity: number
    image: File
    price: number
    status: string
}