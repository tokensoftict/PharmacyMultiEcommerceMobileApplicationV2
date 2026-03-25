import {custom_price} from "@/service/product/ProductListInterface.tsx";

export interface WishlistInterface {
    status: boolean;
    data: Items[];
}

export interface Items {
    id: number;
    name: string;
    description: any;
    price: string;
    price_not_formatted: number;
    quantity: string;
    added_date: string;
    productcategory: string;
    manufacturer: any;
    classification: any;
    productgroup_id: any;
    image: string;
    max: number;
    box: number;
    sachet: boolean;
    carton: number;
    special: string;
    special_not_formatted: number;
    doorstep: string;
    expiry_date: any;
    custom_price: custom_price[];
}

