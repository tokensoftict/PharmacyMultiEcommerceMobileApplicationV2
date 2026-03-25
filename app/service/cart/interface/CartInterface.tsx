import {custom_price} from "@/service/product/ProductListInterface.tsx";

export interface CartInterface {
    status: boolean;
    data: Data;
}

export interface Items {
    id: number;
    name: string;
    description: any;
    price: string;
    price_not_formatted: number;
    total: string;
    total_not_formatted: number;
    cart_quantity: string;
    quantity: string;
    added_date: string;
    productcategory: string;
    manufacturer: string;
    classification: string;
    productgroup_id: any;
    image: string;
    max: number;
    box: number;
    sachet: boolean;
    carton: number;
    special: string|boolean;
    special_not_formatted: number;
    doorstep: string;
    expiry_date: any;
    is_dependent?: boolean;
    parent_stock_id?: number;
    custom_price: custom_price[];
    selected_options?: {
        id: number;
        name: string;
        price: number;
        price_prefix: string;
        group_name?: string;
    }[];
}

export interface Meta {
    noItems: number;
    totalItemsInCarts_formatted : string
    totalItemsInCarts: string;
    doorStepDelivery : doorStepDelivery
}

export interface doorStepDelivery {
    status : boolean,
    name : string,
    amount : string,
    deliveryDate : string,
    amount_formatted : string
}

export interface Data {
    items: Items[];
    meta: Meta;
}
