import React, { useState } from "react";
import { ActivityIndicator, Animated, Platform, View } from "react-native";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { _styles } from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import Header from "@/shared/page/product/components/header";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import { normalize } from "@/shared/helpers";
import { ButtonOutline } from "@/shared/component/buttons";
import FlatList = Animated.FlatList;
import ProductListService from "@/shared/page/productList/service/ProductListService.tsx";
import { ProductListInterface } from "@/service/product/ProductListInterface.tsx";
import ProductCard from "@/shared/component/productCard";
import Toasts from "@/shared/utils/Toast.tsx";
import HeaderWithIcon from "@/shared/component/headerBack";
import { palette } from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import Environment from "@/shared/utils/Environment.tsx";


export default function ProductList() {
    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);
    const route = useRoute();
    const navigation = useNavigation<NavigationProps>();
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [lastPage, setLastPage] = useState(3);
    const [title, setTitle] = useState("");
    const [listId, setListId] = useState();
    const [endpoint, setEndPoint] = useState("");
    const [productList, setProductList] = useState<ProductListInterface[]>([])

    useEffectOnce(function () {
        const notificationData = Environment.getNotificationData();
        if (notificationData && Object.keys(notificationData).length !== 0) {
            // @ts-ignore
            setTitle(notificationData['title']);
            // @ts-ignore
            setListId(notificationData['id'])
            // @ts-ignore
            setEndPoint(notificationData['endpoint']);
            // @ts-ignore
            loadProduct(notificationData['endpoint']);
        } else {
            // @ts-ignore
            setTitle(route.params?.title)
            // @ts-ignore
            setListId(route.params?.id)
            // @ts-ignore
            setEndPoint(route.params?.endpoint);

            // @ts-ignore
            loadProduct(route.params?.endpoint);
        }
    }, [])


    function loadProduct(link: string) {
        if (pageNumber >= lastPage) return;
        setIsProductLoading(true);
        (new ProductListService().getProduct(link, pageNumber).then((response) => {
            setIsProductLoading(false);
            if (response.data.status === true) {
                setLastPage(response.data.meta.last_page);
                setPageNumber((existingPageNumber) => {
                    if (existingPageNumber == 1) return 2;
                    return (existingPageNumber + 1)
                });

                setProductList((existingProduct) => {
                    return [...existingProduct, ...response.data.data];
                });
            }
        }, (error) => {
            setIsProductLoading(false);
            Toasts('Unknown error occurred!')
            navigation.goBack();
        }))
    }

    return (
        <WrapperNoScroll>
            <HeaderWithIcon title={title} />
            <FlatList
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                numColumns={2}
                data={productList}
                // @ts-ignore
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={(item) => {
                    return (
                        <ProductCard 
                            key={item.item.id} 
                            product={item.item} 
                            style={{ flex: 1, width: 'auto' }}
                        />
                    )
                }}
                onEndReached={() => {
                    if (!isProductLoading && productList.length > 0) {
                        // @ts-ignore
                        loadProduct(route.params?.endpoint);
                    }
                }}
                onEndReachedThreshold={0.5}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: normalize(8) }}
                contentContainerStyle={{ paddingBottom: normalize(100) }}
                ListFooterComponent={
                    (isProductLoading && productList.length > 0) ? (
                        <View style={{ paddingVertical: Platform.OS == 'ios' ? normalize(20) : normalize(60) }}>
                            <ActivityIndicator size="large" color={palette.main.p500} />
                        </View>
                    ) : null
                }
                ListHeaderComponent={
                    (isProductLoading && productList.length == 0) ? (
                        <View style={{ paddingVertical: normalize(20) }}>
                            <ActivityIndicator size="large" color={palette.main.p500} />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    (
                        !isProductLoading ? (
                            <View style={{ padding: normalize(20), alignItems: 'center' }}>
                                <Typography>No Product found!</Typography>
                            </View>
                        ) : null
                    )
                }
            >
            </FlatList>

        </WrapperNoScroll>
    );
}
