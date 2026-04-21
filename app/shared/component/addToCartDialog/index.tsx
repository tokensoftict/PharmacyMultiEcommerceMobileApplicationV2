import React from "react";
import {ProductListInterface} from "@/service/product/ProductListInterface";
import {Data} from "@/service/product/show/interface/ProductInformationInterface";
import ProductDialog from "@/shared/component/cartDialog";
import {KeyboardAvoidingView} from "react-native";

interface ProductList {
    product: ProductListInterface|Data|undefined;
    onClose: (visible: boolean) => void;
}
export default function AddToCartDialog({product = undefined, onClose}: ProductList) {

    return (
        <ProductDialog visible={product !== undefined} product={product} onClose={onClose} />
    );
}
