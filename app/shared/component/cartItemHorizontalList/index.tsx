import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { currencyType } from "@/shared/constants/global";
import { _styles } from './styles'
import useDarkMode from "@/shared/hooks/useDarkMode";
import { useNavigation } from "@react-navigation/native";
import { normalize } from "@/shared/helpers";
import { NavigationProps } from "@/shared/routes/stack";
import { Items } from "@/service/cart/interface/CartInterface";
import Environment from "@/shared/utils/Environment";
import { FONT } from "@/shared/constants/fonts";
import { semantic } from "@/shared/constants/colors";

interface ProductList {
    product: Items | undefined,
    onPress: (product: Items | undefined) => void,
}
function CartItemHorizontalList({ product, onPress }: ProductList) {
    const { isDarkMode } = useDarkMode()
    const styles = _styles(isDarkMode)
    const [cant, setCant] = useState(1)
    const navigation = useNavigation<NavigationProps>();

    function navigateTo() {
        // @ts-ignore
        navigation.navigate('detailProduct', { productId: product.id })

    }

    return (
        <TouchableOpacity
            onPress={() => !product?.is_dependent && onPress(product)}
            style={styles.container}
            activeOpacity={product?.is_dependent ? 1 : 0.7}
        >
            <View style={[styles.innerContainer, product?.is_dependent && styles.linkedContainer]}>
                <View style={styles.containerImage}>
                    <Image style={styles.image} resizeMode="contain" source={{ uri: product?.image }} />
                </View>

                <View style={styles.containerInfo}>
                    <View style={styles.actions}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography numberOfLines={1} ellipsizeMode={'tail'} style={[styles.name, { flex: 1 }]}>{product?.name}</Typography>
                            {product?.is_dependent && (
                                <View style={styles.dependentBadge}>
                                    <Typography style={styles.dependentBadgeText}>LINKED</Typography>
                                </View>
                            )}
                        </View>

                        {product?.selected_options && product.selected_options.length > 0 && (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: normalize(6), marginBottom: normalize(8) }}>
                                {product.selected_options.map((option, idx) => (
                                    <View key={idx} style={{ backgroundColor: semantic.alert.danger.d100, paddingHorizontal: normalize(8), paddingVertical: normalize(2), borderRadius: normalize(4) }}>
                                        <Typography style={{ fontSize: normalize(10), fontFamily: FONT.BOLD, color: semantic.alert.danger.d500 }}>
                                            {option.group_name && `${option.group_name}: `}{option.name} {option.price > 0 ? `(${option.price_prefix}${currencyType}${option.price})` : ''}
                                        </Typography>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.priceTotalContainer}>
                            <Typography style={styles.price}>{currencyType} {product?.special === false ? product?.price : product?.special} X {product?.cart_quantity}</Typography>
                            <Typography style={styles.totalPrice}>Total : {currencyType} {product?.total}</Typography>
                        </View>
                        {
                            (Environment.isWholeSalesEnvironment() && product?.doorstep) ?
                                <Typography style={styles.doorStep}>+ Door Delivery : {currencyType} {product?.doorstep}</Typography>
                                : <></>
                        }

                        {
                            ((Environment.isSuperMarketEnvironment() || Environment.isWholeSalesEnvironment()) && product?.custom_price !== undefined && product?.custom_price.length > 0) ?
                                <Typography style={styles.doorStep}>Buy {product?.custom_price[0].min_qty} {Environment.isWholeSalesEnvironment() ? "cartons" : ""} for {currencyType} {product?.custom_price[0].price_formatted} each</Typography>
                                :
                                <></>
                        }
                        <View style={styles.otherInfo}>
                            <Typography style={styles.category}>{product?.quantity} Available</Typography>
                            <Typography style={styles.expiry}>Exp : {product?.expiry_date ?? "N/A"}</Typography>
                        </View>

                        {product?.is_dependent && (
                            <Typography style={styles.dependentNote}>* Mandatory item linked to parent</Typography>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}


export default React.memo(CartItemHorizontalList)
