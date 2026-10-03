import React, { useRef } from "react";
import {ProductListInterface} from "@/service/product/ProductListInterface";
import {Data} from "@/service/product/show/interface/ProductInformationInterface";
import ProductDialog from "@/shared/component/cartDialog";

interface ProductList {
    product: ProductListInterface|Data|undefined;
    onClose: (visible: boolean) => void;
}
export default function AddToCartDialog({product = undefined, onClose}: ProductList) {
    // Keep the last product so the sheet content doesn't blank out while it
    // plays its exit animation (the store value is cleared the moment it closes).
    const lastProduct = useRef<ProductListInterface|Data|undefined>(undefined);
    if (product) {
        lastProduct.current = product;
    }

    return (
        <ProductDialog visible={product !== undefined} product={product ?? lastProduct.current} onClose={onClose} />
    );
}
