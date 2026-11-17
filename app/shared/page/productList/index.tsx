import React, { useRef, useState } from "react";
import { ActivityIndicator, Animated, Modal, Platform, Pressable, TextInput, TouchableOpacity, View } from "react-native";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { _styles } from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import Header from "@/shared/page/product/components/header";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import { normalize } from "@/shared/helpers";
import { Button, ButtonOutline } from "@/shared/component/buttons";
import FlatList = Animated.FlatList;
import ProductListService from "@/shared/page/productList/service/ProductListService.tsx";
import { ProductListInterface } from "@/service/product/ProductListInterface.tsx";
import ProductCard from "@/shared/component/productCard";
import Toasts from "@/shared/utils/Toast.tsx";
import HeaderWithIcon from "@/shared/component/headerBack";
import { palette } from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import Environment from "@/shared/utils/Environment.tsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SORT_OPTIONS = [
    { key: "", label: "Default" },
    { key: "price_asc", label: "Price: Low to High" },
    { key: "price_desc", label: "Price: High to Low" },
    { key: "name_asc", label: "Name: A to Z" },
    { key: "newest", label: "Newest First" },
];


export default function ProductList() {
    const insets = useSafeAreaInsets();
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
    const [searchText, setSearchText] = useState("");
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestId = useRef(0);
    const activeSearch = useRef("");
    const activeSort = useRef("");
    const [sort, setSort] = useState("");
    const [draftSort, setDraftSort] = useState("");
    const [filterVisible, setFilterVisible] = useState(false);

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


    function loadProduct(link: string, page: number = pageNumber, search: string = activeSearch.current, sortBy: string = activeSort.current) {
        if (page > 1 && page > lastPage) return;
        const currentRequest = ++requestId.current;
        setIsProductLoading(true);
        (new ProductListService().getProduct(link, page, search, sortBy).then((response) => {
            if (currentRequest !== requestId.current) return; // stale response
            setIsProductLoading(false);
            if (response.data.status === true) {
                setLastPage(response.data.meta.last_page);
                setPageNumber(page + 1);

                setProductList((existingProduct) => {
                    return page === 1
                        ? [...response.data.data]
                        : [...existingProduct, ...response.data.data];
                });
            }
        }, (error) => {
            if (currentRequest !== requestId.current) return;
            setIsProductLoading(false);
            Toasts('Unknown error occurred!')
            if (page === 1 && !search && !sortBy) navigation.goBack();
        }))
    }

    function runSearch(text: string, sortBy: string = activeSort.current) {
        activeSearch.current = text.trim();
        activeSort.current = sortBy;
        setProductList([]);
        setPageNumber(1);
        setLastPage(1);
        // @ts-ignore
        loadProduct(endpoint || route.params?.endpoint, 1, activeSearch.current, sortBy);
    }

    function openFilter() {
        setDraftSort(sort);
        setFilterVisible(true);
    }

    function applyFilter() {
        setSort(draftSort);
        setFilterVisible(false);
        runSearch(searchText, draftSort);
    }

    function resetFilter() {
        setDraftSort("");
        setSort("");
        setFilterVisible(false);
        runSearch(searchText, "");
    }

    function onSearchChange(text: string) {
        setSearchText(text);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => runSearch(text), 500);
    }

    function clearSearch() {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        setSearchText("");
        runSearch("");
    }

    return (
        <WrapperNoScroll>
            <HeaderWithIcon title={title} />
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: normalize(12),
                marginVertical: normalize(8),
                paddingHorizontal: normalize(12),
                borderRadius: normalize(10),
                borderWidth: 1,
                borderColor: isDarkMode ? '#444' : '#ddd',
                backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
            }}>
                <TextInput
                    style={{ flex: 1, height: normalize(42), color: isDarkMode ? '#fff' : '#000' }}
                    placeholder="Search products..."
                    placeholderTextColor={isDarkMode ? '#888' : '#999'}
                    value={searchText}
                    onChangeText={onSearchChange}
                    returnKeyType="search"
                    autoCorrect={false}
                    onSubmitEditing={() => {
                        if (searchTimer.current) clearTimeout(searchTimer.current);
                        runSearch(searchText);
                    }}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Typography>✕</Typography>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={openFilter}
                    style={{
                        marginLeft: normalize(10),
                        paddingLeft: normalize(10),
                        borderLeftWidth: 1,
                        borderLeftColor: isDarkMode ? '#444' : '#ddd',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Typography>Filter</Typography>
                    {sort !== "" && (
                        <View style={{
                            width: 8, height: 8, borderRadius: 4,
                            marginLeft: 4, backgroundColor: palette.main.p500,
                        }} />
                    )}
                </TouchableOpacity>
            </View>
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
                keyboardShouldPersistTaps="handled"
                onEndReached={() => {
                    if (!isProductLoading && productList.length > 0) {
                        // @ts-ignore
                        loadProduct(endpoint || route.params?.endpoint);
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

            <Modal
                visible={filterVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setFilterVisible(false)}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
                    onPress={() => setFilterVisible(false)}
                >
                    <Pressable style={{
                        backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
                        borderTopLeftRadius: normalize(20),
                        borderTopRightRadius: normalize(20),
                        padding: normalize(20),
                        paddingBottom: Math.max(insets.bottom, normalize(12)) + normalize(20),
                    }}>
                        <Typography style={{ fontWeight: '700', fontSize: normalize(16), marginBottom: normalize(12) }}>
                            Sort by
                        </Typography>
                        {SORT_OPTIONS.map((option) => {
                            const selected = draftSort === option.key;
                            return (
                                <TouchableOpacity
                                    key={option.key || "default"}
                                    onPress={() => setDraftSort(option.key)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: normalize(12),
                                    }}
                                >
                                    <View style={{
                                        width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                                        borderColor: selected ? palette.main.p500 : (isDarkMode ? '#666' : '#bbb'),
                                        alignItems: 'center', justifyContent: 'center',
                                        marginRight: normalize(12),
                                    }}>
                                        {selected && (
                                            <View style={{
                                                width: 10, height: 10, borderRadius: 5,
                                                backgroundColor: palette.main.p500,
                                            }} />
                                        )}
                                    </View>
                                    <Typography>{option.label}</Typography>
                                </TouchableOpacity>
                            );
                        })}
                        <View style={{ flexDirection: 'row', marginTop: normalize(16) }}>
                            <View style={{ flex: 1, marginRight: normalize(8) }}>
                                <ButtonOutline title="Reset" onPress={resetFilter} />
                            </View>
                            <View style={{ flex: 1, marginLeft: normalize(8) }}>
                                <Button title="Apply" onPress={applyFilter} />
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

        </WrapperNoScroll>
    );
}
