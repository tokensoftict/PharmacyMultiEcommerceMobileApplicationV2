import {Float} from "react-native/Libraries/Types/CodegenTypes";

export interface custom_price {
    price : string;
    min_qty : number;
    max_qty : number;
    price_formatted : string;
}

export interface dependent_products {
    id: number;
    stock_id: number;
    name: string;
    price: number;
    price_formatted: string;
    image: string;
    parent: number;
    child: number;
}

export interface stock_option {
    id: number;
    name: string;
    price: number;
    price_prefix: string;
}

export interface stock_option_values {
    option_name: string;
    option_type: string;
    options: stock_option[];
}

export interface ProductListInterface {
    id: number | undefined;
    name: string | undefined;
    price: string | undefined;
    price_not_formatted: number | undefined;
    special: string|undefined|boolean;
    special_not_formatted: string|boolean;
    image: string | undefined;
    max: number | undefined;
    box: number | undefined;
    quantity: number | undefined;
    sachet: boolean | undefined;
    carton: number | undefined;
    doorstep: Float | undefined,
    expiry_date: string | undefined;
    custom_price: custom_price[];
    dependent_products: dependent_products[];
    stock_option_values?: stock_option_values[];
    is_wishlisted?: boolean;
}

export type ProductList = {
    id: number;
    name: string;
    price: string;
    price_not_formatted: number;
    special: string|undefined|boolean;
    special_not_formatted: string|undefined|boolean;
    image: string;
    max: number;
    box: number;
    quantity: number;
    sachet: boolean;
    carton: number;
    doorstep: Float,
    expiry_date: string;
    custom_price: custom_price[];
    dependent_products: dependent_products[];
    stock_option_values?: stock_option_values[];
    is_wishlisted: boolean;
}
