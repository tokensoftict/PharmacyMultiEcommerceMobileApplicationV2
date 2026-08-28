import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import WishlistItemHorizontalList from "@/shared/component/wishlistItemHorizontalList";
import { WishlistInterface } from "@/service/wishlist/interface/WishlistInterface.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import WishlistService from "@/service/wishlist/WishlistService.tsx";
import HeaderWithIcon from "@/shared/component/headerBack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import List from "@/shared/component/list";
import { semantic } from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import { Button } from "@/shared/component/buttons";
import { FONT } from "@/shared/constants/fonts";
import { theme } from "@/shared/theme";

export default function Wishlist() {
    const { isDarkMode } = useDarkMode()
    const [cartErrorList] = useState("Your wishlist is empty for now 💫 Start adding items you love!")
    const [isLoading, setIsLoading] = useState(false);
    const [wishlistItemList, setWishlistItemList] = useState<WishlistInterface>();
    const navigation = useNavigation<NavigationProps>();

    useFocusEffect(
        useCallback(() => {
            loadWishItems();
        }, [])
    );

    function removeFromWishlist(product: any) {
        Alert.alert('PS GDC', 'Are you sure you want to remove ' + product.name + " from your wishlist?", [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Yes', onPress: () => {
                    setIsLoading(true);
                    (new WishlistService()).remove(product.id).then((response) => {
                        setIsLoading(false);
                        loadWishItems();
                    })
                }
            },
        ]);
    }

    function loadWishItems() {
        setIsLoading(true);
        (new WishlistService()).get().then((response) => {
            setIsLoading(false);
            if (response.data.status === true) {
                setWishlistItemList(response.data)
            } else {
                setIsLoading(response.data.message);
            }
        }, (error) => {
            setIsLoading(false);
            Toasts('There was an error while loading cart');
        })
    }

    function renderItem(item: any, key: number) {
        return <View style={{ marginBottom: 0, flex: 1 }} key={key}>
            <WishlistItemHorizontalList product={item} onRemoveItem={removeFromWishlist} />
        </View>
    }

    return (
        <View style={{ flex: 1 }}>
            <WrapperNoScroll loading={isLoading}>
                <HeaderWithIcon
                    onPress={loadWishItems}
                    title="MY WISHLIST"
                />
                {
                    isLoading ? <></> :
                        <>
                            {
                                (wishlistItemList?.data ?? []).length > 0 ?
                                    <>
                                        <View style={{ flex: 1, paddingHorizontal: theme.spacing.xs, backgroundColor: semantic.background.white.w111 }}>
                                            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                                                <View style={{ height: theme.spacing.xs }} />
                                                <List
                                                    between
                                                    data={wishlistItemList?.data ?? []}
                                                    rows={1}
                                                    renderItem={renderItem}
                                                />
                                            </ScrollView>
                                        </View>
                                    </>
                                    :
                                    <View style={{
                                        flex: 1,
                                        paddingHorizontal: theme.spacing.lg,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: isDarkMode ? semantic.fill.f01 : '#FFFFFF',
                                    }}>
                                        <View style={{
                                            width: 120,
                                            height: 120,
                                            backgroundColor: isDarkMode ? semantic.fill.f02 : '#F5F5F5',
                                            borderRadius: theme.borderRadius.full,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: theme.spacing.md,
                                        }}>
                                            <Typography style={{ fontSize: 48 }}>💝</Typography>
                                        </View>
                                        <Typography style={{
                                            textAlign: 'center',
                                            fontSize: theme.typography.xxl,
                                            fontFamily: FONT.BOLD,
                                            color: isDarkMode ? semantic.text.white : '#1A1D1E',
                                            marginBottom: theme.spacing.xs
                                        }}>
                                            Your wishlist is empty
                                        </Typography>
                                        <Typography style={{
                                            textAlign: 'center',
                                            fontSize: theme.typography.sm,
                                            color: '#9E9E9E',
                                            fontFamily: FONT.MEDIUM,
                                            lineHeight: theme.typography.sm * 1.5,
                                            marginBottom: theme.spacing.xl,
                                            paddingHorizontal: theme.spacing.md
                                        }}>
                                            {cartErrorList}
                                        </Typography>
                                        <View style={{ width: '100%', paddingHorizontal: theme.spacing.xxl }}>
                                            <Button title="Start Exploring" onPress={() => navigation.goBack()} />
                                        </View>
                                    </View>
                            }
                        </>
                }
            </WrapperNoScroll>
        </View>
    );
}
