import {ProductList} from "@/service/product/ProductListInterface.tsx";

export interface BrandInterface {
    status: boolean;
    data: Data[];
    meta: Meta;
}

export interface Data {
    id: number;
    name: string;
    stocks: ProductList[];
}

export interface Paginated_buttons {
    label: string;
    active: boolean;
    parameters: any;
}

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    paginated_buttons: Paginated_buttons[];
}
