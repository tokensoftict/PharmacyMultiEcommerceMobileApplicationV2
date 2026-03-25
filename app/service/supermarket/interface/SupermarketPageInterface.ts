import {BrandInterface} from "@/service/product/BrandInterface.tsx";
import {ProductListInterface} from "@/service/product/ProductListInterface.tsx";
export interface SupermarketPageInterface {
    status: boolean;
    data: Data;
}

export interface Banners {
    ref: string;
    id: number;
    link: string;
    label: string;
}
export interface ProductLists {
    type: string;
    id: number;
    limit: number;
    label: string;
    products: ProductListInterface[];
}

export interface Data {
    topBrands: BrandInterface[];
    banners: Banners[];
    productLists: ProductLists[];
}
