import React, { useState } from "react";
import  {Text, Image, TouchableOpacity, View} from "react-native";
import Typography from "../typography";
import { currencyType } from "../../constants/global";
import {_styles} from './styles'
import useDarkMode from "../../hooks/useDarkMode.tsx";
import { useNavigation } from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack";
import {normalize} from "@/shared/helpers";
import {Product} from "@/service/order/interface/OrderListInterface.tsx";
import CartService from "@/service/cart/CartService.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";
import Environment from "@/shared/utils/Environment.tsx";

interface ProductList {
    product: Product | undefined,
}
 function OrderItemHorizontalList({product}: ProductList) {
    const {isDarkMode} = useDarkMode()
    const styles = _styles(isDarkMode)
    const [cant, setCant] = useState(1)
    const navigation = useNavigation<NavigationProps>();
    const { showLoading, hideLoading } = useLoading();

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', {productId : product.id})

    }

    function navigateToCheckout() {
        // @ts-ignore
        navigation.navigate('checkout')

    }

    function buyNow(product: Product | undefined)
    {
        if(!product) return;
        showLoading("Please wait..")

        new CartService().add(product.stock_id, product.quantity).then((response) => {
            if(response.data.status === true){
                navigateToCheckout();
            }
            hideLoading();
        })
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={navigateTo} style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.containerImage}>
                        <Image style={styles.image} resizeMode="contain" source={{uri: product?.image}} />
                    </View>

                    <View style={styles.containerInfo}>
                        <View style={styles.actions}>
                            <Typography numberOfLines={2} ellipsizeMode={'tail'} style={styles.name}>{product?.name}</Typography>
                            <Typography style={styles.price}>Total: {currencyType} {product?.total}</Typography>
                            <Typography style={{marginTop: normalize(10),fontSize : normalize(9)}}>Quantity: {product?.quantity}</Typography>
                        </View>
                        {
                            (Environment.isSalesRepresentativeEnvironment()) ? <></> :
                                <TouchableOpacity onPress={() => buyNow(product)} style={styles.viewOrderButton}>
                                    <Typography style={styles.buttonText}>Buy Again</Typography>
                                </TouchableOpacity>
                        }

                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default React.memo(OrderItemHorizontalList);
