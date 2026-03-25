import React, { useState } from "react";
import { Text, Image, TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { currencyType } from "../../constants/global";
import { _styles } from './styles'
import useDarkMode from "../../hooks/useDarkMode.tsx";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import { IconButton } from "react-native-paper";
import { trash } from "@/assets/icons";
import { normalize } from "@/shared/helpers";
import { Items } from "@/service/wishlist/interface/WishlistInterface";
import Environment from "@/shared/utils/Environment.tsx";

interface ProductList {
    product: Items | undefined,
    onRemoveItem: Function
}
function WishlistItemHorizontalList({ product, onRemoveItem }: ProductList) {
    const { isDarkMode } = useDarkMode()
    const styles = _styles(isDarkMode)
    const [cant, setCant] = useState(1)
    const navigation = useNavigation<NavigationProps>();

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', { productId: product.id })

    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={navigateTo} style={styles.innerContainer}>
                <View style={styles.containerImage}>
                    <Image style={styles.image} resizeMode="contain" source={{ uri: product?.image }} />
                </View>

                <View style={styles.containerInfo}>
                    <View style={styles.headerRow}>
                        <Typography numberOfLines={2} ellipsizeMode={'tail'} style={styles.name}>{product?.name}</Typography>
                        <TouchableOpacity onPress={() => onRemoveItem(product)} style={styles.removeButton}>
                            <Image source={trash} style={styles.trashIcon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.priceRow}>
                        <Typography style={styles.price}>{currencyType} {product?.price}</Typography>
                        {product?.quantity !== undefined && (
                            <View style={styles.quantityBadge}>
                                <Typography style={styles.quantityText}>{product.quantity} Available</Typography>
                            </View>
                        )}
                    </View>

                    {
                        (Environment.isWholeSalesEnvironment() && product?.doorstep) ?
                            <Typography style={styles.doorStep}>+ Door Delivery: {currencyType} {product?.doorstep}</Typography>
                            : <></>
                    }
                    {
                        ((Environment.isSuperMarketEnvironment() || Environment.isWholeSalesEnvironment()) && product?.custom_price !== undefined && product?.custom_price.length > 0) ?
                            <Typography style={styles.doorStep}>Buy {product?.custom_price[0].min_qty} {Environment.isWholeSalesEnvironment() ? "cartons" : ""} for {currencyType} {product?.custom_price[0].price_formatted} each.</Typography>
                            :
                            <></>
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default React.memo(WishlistItemHorizontalList);
