import React, { useState, useCallback } from "react";
import {ActivityIndicator, Animated, Platform, ScrollView, View} from "react-native";
import Typography from "@/shared/component/typography";
import { _styles } from './styles';
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { Data } from "@/service/category/CategoryInterface.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import CategoryService from "@/service/category/CategoryService";
import { ProductList } from "@/service/product/ProductListInterface.tsx";
import SmallCardProduct from "@/shared/component/smallCardProduct";
import HeaderWithIcon from "@/shared/component/headerBack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { search } from "@/assets/icons";
import { palette, semantic } from "@/shared/constants/colors.ts";
import _ from "lodash";
import {normalize} from "@/shared/helpers";

const FlatList = Animated.FlatList;

 function Categories() {
    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);
    const navigation = useNavigation<NavigationProps>();

    const [lastPage, setLastPage] = useState(3);
    const [pageNumber, setPageNumber] = useState(1);
    const [categoryResponseList, setCategoryResponseList] = useState<Data[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const navigateTo = (endpoint: string, title: string, id: number) => {
        // @ts-ignore
        navigation.navigate('productList', {
            endpoint: endpoint,
            title: title,
            id: id,
        });
    };

    const loadCategory = useCallback((query = '', page = pageNumber) => {
        if (page >= lastPage) return;
        setIsCategoryLoading(true);

        (new CategoryService()).getCategories(page, query)
            .then((response) => {
                setIsCategoryLoading(false);

                if (response.data.status === true) {
                    const fetchedData = response.data.data;
                    setLastPage(response.data.meta.last_page);
                    setPageNumber((prev) => (page === 1 ? 2 : prev + 1));
                    setCategoryResponseList((prev) =>
                        page === 1 ? fetchedData : [...prev, ...fetchedData]
                    );
                }
            })
            .catch(() => {
                setIsCategoryLoading(false);
                setLastPage(1);
                setPageNumber(1);
            });
    }, [pageNumber, lastPage]);

    const debouncedSearch = useCallback(
        _.debounce((query: string) => {
            setPageNumber(1);
            setCategoryResponseList([]);
            loadCategory(query, 1);
        }, 500),
        []
    );

    useEffectOnce(() => {
        loadCategory();
    }, []);

    const categoryItem = (id: number, title: string, stocks: ProductList[]) => {
        return (
            <View key={id + "-" + title} style={styles.categoryHolder}>
                <View style={styles.categoryHeader}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerAccent} />
                        <Typography style={styles.categoryName}>{title.toUpperCase()}</Typography>
                    </View>
                    <Typography
                        onPress={() => navigateTo("stock/" + id + "/by_productcategory", title.toUpperCase(), id)}
                        style={styles.seeAll}
                    >
                        SEE ALL
                    </Typography>
                </View>
                <View style={styles.categoryBody}>
                    {stocks.map((stock) => (
                        // @ts-ignore
                        <SmallCardProduct key={stock.id} product={stock} />
                    ))}
                </View>
            </View>
        );
    };

    return (
        <WrapperNoScroll>
            <View style={{ flex: 1 }}>
                <HeaderWithIcon onPress={() => loadCategory(searchQuery)} title="CATEGORIES" />

                <View style={styles.searchWrapper}>
                    <Input
                        placeholder="Search Categories..."
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            debouncedSearch(text);
                        }}
                        rightIcon={
                            <Icon
                                onPress={() => loadCategory(searchQuery, 1)}
                                icon={search}
                                tintColor={semantic.text.grey}
                            />
                        }
                    />
                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    numColumns={1}
                    onEndReached={() => {
                        if (!isCategoryLoading) {
                            loadCategory(searchQuery);
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    data={categoryResponseList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View key={item.id + item.name} style={styles.holder}>
                            {categoryItem(item.id, item.name, item.stocks)}
                        </View>
                    )}
                    ListHeaderComponent={
                        (isCategoryLoading && categoryResponseList.length == 0) ? (
                            <View style={{ paddingVertical: normalize(20) }}>
                                <ActivityIndicator size="large" color={palette.main.p500} />
                            </View>
                        ) : null
                    }
                    ListFooterComponent={
                        (isCategoryLoading && categoryResponseList.length > 0) ? (
                            <View style={{ paddingVertical: Platform.OS == 'ios' ? normalize(20) :  normalize(60) }}>
                                <ActivityIndicator size="large" color={palette.main.p500} />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        !isCategoryLoading ? (
                            <View style={{ padding: normalize(20), alignItems: 'center' }}>
                                <Typography>No category found</Typography>
                            </View>
                        ) : null
                    }
                />
            </View>
        </WrapperNoScroll>
    );
}


export default React.memo(Categories);
