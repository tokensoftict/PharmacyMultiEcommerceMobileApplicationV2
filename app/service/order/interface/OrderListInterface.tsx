export interface OrderListInterface {
    id : number
    orderDate:  string,
    orderId: string,
    total: string,
    payment_method: string,
    status: string,
    image: string
}

export interface Order {
    orderDate: string
    orderId: string
    invoiceNo: string
    totalAmount: string
    status: string
    products: Product[]
    orderTotals : OrderTotal[]
    address: string
    paymentMethod: string,
    itemsCount: number
}

export interface Product {
    id: number
    name: string
    price: string
    stock_id : number,
    price_not_formatted: number
    total: string
    total_not_formatted: number
    quantity: number
    image: string
}

export interface OrderTotal {
    id: number
    name: string
    value: number
    value_formatted: string
}
