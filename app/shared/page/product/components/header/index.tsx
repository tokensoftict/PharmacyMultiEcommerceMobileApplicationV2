import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "../../../../../shared/component/icon";
import { arrowBack, like } from "../../../../../assets/icons";
import Typography from "../../../../../shared/component/typography";
import {styles} from './styles'
import { useNavigation } from "@react-navigation/native";
import useDarkMode from "../../../../../shared/hooks/useDarkMode";
import { semantic } from "../../../../../shared/constants/colors";
import {ProductListInterface} from "@/service/product/ProductListInterface.tsx";
import WishlistService from "@/service/wishlist/WishlistService.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";
import Environment from "@/shared/utils/Environment.tsx";
import {normalize} from "@/shared/helpers";

interface header {
    title: string|undefined,
    product: any | undefined,
}
export default function Header({title, product} : header) {
    const {isDarkMode} = useDarkMode()
    const {goBack} = useNavigation()
    const { showLoading, hideLoading } = useLoading();

    function addProductWishList(product: ProductListInterface) {
        showLoading("Adding product...")
        new WishlistService().add(product.id).then((response) => {
           hideLoading();
        })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={goBack}>
                <Icon customStyles={{tintColor: isDarkMode ? semantic.background.white.w500 : semantic.background.red.d500}} icon={arrowBack} />
            </TouchableOpacity>
            <Typography  numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
                {title}
            </Typography>

            {
                Environment.isLogin() ? <TouchableOpacity>

                </TouchableOpacity> : <View style={{height : normalize(20)}}></View>
            }
        </View>
    )
}
