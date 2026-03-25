import {Float} from "react-native/Libraries/Types/CodegenTypes";
import {custom_price} from "@/service/product/ProductListInterface.tsx";

export interface ProductInformationInterface {
    status: boolean;
    data: Data;
}

export interface Store {
    id: number;
    stock_id: number;
    app_id: number;
    status: boolean;
    quantity: number;
    featured: boolean;
    special_offer: boolean;
    price: number;
    expiry_date: any;
    created_at: string;
    updated_at: string;
}

export interface Data {
    id: number;
    name: string;
    description: any;
    price: string;
    price_not_formatted: number;
    special : string|undefined,
    special_not_formatted: number|undefined
    productcategory: string;
    manufacturer: string;
    classification: string;
    productgroup: any;
    image: string;
    reviews: number;
    totalSold : number;
    rating : string;
    max: number;
    box: number;
    sachet: boolean;
    carton: number;
    doorstep: Float,
    quantity: number,
    expiry_date: any;
    store: Store;
    custom_price : custom_price[];
    dependent_products: any[];
    stock_option_values: any[];
    is_wishlisted: boolean;
}
