import React, {useCallback, useState} from "react";
import {Alert, Image, ScrollView, View, TouchableOpacity} from "react-native";
import HeaderWithIcon from "@/shared/component/headerBack";
import {emptyCart, shoppingBag} from "@/assets/icons";
import List from "@/shared/component/list";
import { Button, ButtonOutline } from "@/shared/component/buttons";
import { normalize } from "@/shared/helpers";
import Typography from "@/shared/component/typography";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import useDarkMode from "@/shared/hooks/useDarkMode";
import CartService from "@/service/cart/CartService.tsx";
import {CartInterface} from "@/service/cart/interface/CartInterface";
import Toasts from "@/shared/utils/Toast.tsx";
import CartItemHorizontalList from "@/shared/component/cartItemHorizontalList";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {currencyType} from "@/shared/constants/global";
import {semantic} from "@/shared/constants/colors";
import Environment from "@/shared/utils/Environment.tsx";
import UpdateCartDialog from "@/shared/component/updateCartDialog";



import { _styles } from './styles'

function Cart() {
    const { navigate } = useNavigation<NavigationProps>()
    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);
    const [cartErrorList, setCartErrorList] = useState("Your Shopping Cart is empty!")
    const [isLoading, setIsLoading] = useState(false);
    const [cartItemList, setCartItemList] = useState<CartInterface>();
    const [openCartModal, setOpenCartModal] = useState(false);
    const [cartItemSelected, setCartItemSelected] = useState();

    useFocusEffect(
        useCallback(() => {
            loadCartItems();
        }, [])
    );

    function loadCartItems() {
        setIsLoading(true);
        (new CartService()).get().then((response) => {
            setIsLoading(false);
            if (response.data.status === true) {
                setCartItemList(response.data)
            } else {
                setCartErrorList(response.data.message);
            }
        }, (error) => {
            setIsLoading(false);
            Toasts('There was an error while loading cart');
        })
    }

    const cartDialogOpen = (status: boolean) => {
        setOpenCartModal(status);
    }

    const onItemClick = (item: any) => {
        cartDialogOpen(true);
        setCartItemSelected(item);
    }

    function renderItem(item: any, key: number) {
        return <CartItemHorizontalList key={key} product={item} onPress={onItemClick} />
    }

    function clearCartItems() {
        Alert.alert('Shopping Cart', 'Are you sure you want to clear all the item(s)?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Yes', 
                onPress: () => {
                    setIsLoading(true);
                    (new CartService()).clear().then(() => {
                        setIsLoading(false);
                        loadCartItems();
                    })
                }
            },
        ]);
    }

    return (
        <View style={styles.container}>
            <WrapperNoScroll loading={isLoading}>
                <HeaderWithIcon icon={shoppingBag} onPress={loadCartItems} title="MY CART" />
                
                {!isLoading && (
                    <>
                        {(cartItemList?.data.items ?? []).length > 0 ? (
                            <View style={{ flex: 1 }}>
                                <ScrollView 
                                    showsVerticalScrollIndicator={false} 
                                    contentContainerStyle={styles.listContainer}
                                >
                                    <View style={{ height: normalize(16) }} />
                                    {cartItemList?.data.items.map((item, index) => renderItem(item, index))}
                                </ScrollView>

                                <View style={styles.summaryCard}>
                                    <View style={styles.summaryIndicator} />
                                    
                                    <View style={styles.summaryRow}>
                                        <Typography style={styles.summaryLabel}>Subtotal</Typography>
                                        <Typography style={styles.summaryValue}>
                                            {currencyType} {cartItemList?.data.meta.totalItemsInCarts_formatted}
                                        </Typography>
                                    </View>

                                    {cartItemList?.data.meta?.doorStepDelivery && (
                                        <>
                                            <View style={styles.summaryRow}>
                                                <Typography style={styles.summaryLabel}>
                                                    {cartItemList?.data.meta?.doorStepDelivery.name}
                                                </Typography>
                                                <Typography style={styles.summaryValue}>
                                                    {currencyType} {cartItemList?.data.meta?.doorStepDelivery.amount_formatted}
                                                </Typography>
                                            </View>
                                            <View style={styles.summaryRow}>
                                                <Typography style={styles.summaryLabel}>Delivery Date</Typography>
                                                <Typography style={styles.summaryValue}>
                                                    {cartItemList?.data.meta?.doorStepDelivery.deliveryDate}
                                                </Typography>
                                            </View>
                                        </>
                                    )}

                                    <View style={styles.totalRow}>
                                        <View style={styles.totalLabelContainer}>
                                            <Typography style={styles.totalTitle}>Order Total</Typography>
                                            <Typography style={styles.totalSubtitle}>
                                                {cartItemList?.data.meta.noItems} Items
                                            </Typography>
                                        </View>
                                        <Typography style={styles.totalAmount}>
                                            {currencyType} {cartItemList?.data.meta.totalItemsInCarts_formatted}
                                        </Typography>
                                    </View>

                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity style={styles.btnClear} onPress={clearCartItems}>
                                            <Typography style={styles.btnClearText}>Clear All</Typography>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.btnCheckout} onPress={() => navigate('checkout')}>
                                            <Typography style={styles.btnCheckoutText}>Checkout Now</Typography>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyImageWrapper}>
                                    <Image resizeMode={'contain'} style={styles.emptyImage} source={emptyCart} />
                                </View>
                                <Typography style={styles.emptyTitle}>Your cart is empty</Typography>
                                <Typography style={styles.emptySubtitle}>
                                    Looks like you haven't added anything to your cart yet.
                                </Typography>
                                <View style={{ marginTop: normalize(32), width: '100%' }}>
                                    <Button title="START SHOPPING" onPress={() => navigate('homeTab' as any)} />
                                </View>
                            </View>
                        )}
                    </>
                )}
            </WrapperNoScroll>
            <UpdateCartDialog 
                onCartUpdated={loadCartItems} 
                product={cartItemSelected} 
                visible={openCartModal} 
                onClose={cartDialogOpen} 
            />
        </View>
    )
}

export default React.memo(Cart);
