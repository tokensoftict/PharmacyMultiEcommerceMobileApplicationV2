export interface Dashboard {
    totalNumberOfCustomers: number
    totalNumberOfDispatchedOrders: number
    sumOfDispatchedOrders: number
    customerList: CustomerList[]
    orderList: OrderList[]
    profile?: Profile
    month: string
}

export interface CustomerList {
    id: number
    user_id: number
    address_id: number
    delivery_method_id: any
    payment_method_id: any
    status: boolean
    customer_group_id: number
    business_name: string
    customer_type_id: number
    device_key: string
    cac_document: string
    premises_licence: string
    customer_local_id: any
    phone: string
    sales_representative_id: number
    cart: any
    wishlist: any
    checkout: any
    ordertotals: any
    coupon_data: any
    remove_order_total: any[]
    last_activity_date: any
    created_at: string
    updated_at: string
    customer_group: CustomerGroup
    customer_type: CustomerType
    user: User
}

export interface CustomerGroup {
    id: number
    name: string
    status: boolean
    description: any
    created_at: any
    updated_at: any
}

export interface CustomerType {
    id: number
    name: string
    status: number
    created_at: any
    updated_at: any
}

export interface User {
    id: number
    firstname: string
    lastname: string
    email: string
    email_verified_at: string
    phone_verified_at: string
    phone: string
    verification_pin: any
    image: string
    theme: string
    navigation_type: string
    last_seen: string
    created_at: string
    updated_at: string
    cus_exist: string
}

export interface OrderList {
    id: number
    orderDate: string
    orderId: string
    invoiceNo: string
    totalAmount: string
    status: string
    product_count: number
    customer: Customer
    paymentMethod: string
    itemsCount: number
}

export interface Customer {
    id: number
    user_id: number
    address_id: number
    delivery_method_id: any
    payment_method_id: any
    status: boolean
    customer_group_id: number
    business_name: string
    customer_type_id: number
    device_key: string
    cac_document: string
    premises_licence: string
    customer_local_id: any
    phone: string
    sales_representative_id: number
    cart: any
    wishlist: any
    checkout: any
    ordertotals: any
    coupon_data: any
    remove_order_total: any[]
    last_activity_date: any
    created_at: string
    updated_at: string
    customer_group: CustomerGroup2
    customer_type: CustomerType2
}

export interface CustomerGroup2 {
    id: number
    name: string
    status: boolean
    description: any
    created_at: any
    updated_at: any
}

export interface CustomerType2 {
    id: number
    name: string
    status: number
    created_at: any
    updated_at: any
}

export interface Profile {
    name: string
    email: string
    phone: string
}
