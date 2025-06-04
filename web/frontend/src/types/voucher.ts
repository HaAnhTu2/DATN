export interface Voucher {
    voucher_id: string
    code: string
    value: number
    min_order_value: number
    exprired_time: string
    description: string
    status: string
}
export interface ApplyVoucherRequest {
  user_id: string;
  code: string;
}

export interface ApplyVoucherResponse {
  voucher: Voucher;
}