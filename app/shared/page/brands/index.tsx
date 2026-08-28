import React, { useCallback, useState } from "react";
import { ActivityIndicator, Animated, Platform, View } from "react-native";
import Typography from "@/shared/component/typography";
import { _styles } from './styles';
import useDarkMode from "@/shared/hooks/useDarkMode";
import { Data } from "@/service/category/CategoryInterface";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import { ProductList as ProductType } from "@/service/product/ProductListInterface";
import SmallCardProduct from "@/shared/component/smallCardProduct";
import HeaderWithIcon from "@/shared/component/headerBack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import FlatList = Animated.FlatList;
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import BrandService from "@/service/brands/BrandService";
import _ from "lodash";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { search } from "@/assets/icons";
import { palette, semantic } from "@/shared/constants/colors.ts";
import { theme } from "@/shared/theme";
import { isTablet } from '@/shared/helpers';

function Brands() {
    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);
    const tablet = isTablet();
    
    const [lastPage, setLastPage] = useState(3);
    const navigation = useNavigation<NavigationProps>();
    const [isBrandLoading, setIsBrandLoading] = useState(false);
    const [brandResponseList, setBrandResponseList] = useState<Data[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    function navigateTo(endpoint: string, title: string, id: number) {
        navigation.navigate('productList', {
            endpoint: endpoint,
            title: title,
            id: id
        });
    }

    const loadBrand = useCallback((query = '', page = pageNumber) => {
        if (page >= lastPage) return;
        setIsBrandLoading(true);

        new BrandService().getBrands(page, query)
            .then((response) => {
                setIsBrandLoading(false);

                if (response.data.status === true) {
                    const fetchedData = response.data.data;
                    setLastPage(response.data.meta.last_page);
                    setPageNumber((prev) => (page === 1 ? 2 : prev + 1));
                    setBrandResponseList((prev) =>
                        page === 1 ? fetchedData : [...prev, ...fetchedData]
                    );
                }
            })
            .catch(() => {
                setIsBrandLoading(false);
            });
    }, [pageNumber, lastPage]);

    const debouncedSearch = useCallback(
        _.debounce((query: string) => {
            setPageNumber(1);
            setBrandResponseList([]);
            loadBrand(query, 1);
        }, 500),
        []
    );

    useEffectOnce(() => {
        loadBrand();
    }, []);

    const categoryItem = (id: number, title: string, stocks: ProductType[]) => {
        return (
            <View key={id + "-" + title} style={styles.categoryHolder}>
                <View style={styles.categoryHeader}>
                    <Typography style={styles.categoryName}>{title.toUpperCase()}</Typography>
                    <Typography onPress={() => {
                        navigateTo("stock/" + id + "/by_manufacturer", title.toUpperCase(), id);
                    }} style={styles.seeAll}>SEE ALL</Typography>
                </View>
                <View style={styles.categoryBody}>
                    {stocks.map((stock) => (
                        <View key={stock.id} style={styles.cardWrapper}>
                            <SmallCardProduct product={stock as any} containerStyle={{ width: '100%' }} />
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <WrapperNoScroll>
            <HeaderWithIcon title="BRANDS" />

            <View style={[styles.searchWrapper, tablet && { maxWidth: 480, alignSelf: 'center', width: '100%' }]}>
                <Input
                    placeholder="Search Brands..."
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        debouncedSearch(text);
                    }}
                    rightIcon={
                        <Icon
                            onPress={() => loadBrand(searchQuery, 1)}
                            icon={search}
                            tintColor={semantic.text.grey}
                        />
                    }
                />
            </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    numColumns={1}
                    onEndReached={() => {
                        if (!isBrandLoading) {
                            loadBrand(searchQuery);
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    data={brandResponseList}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={tablet && { maxWidth: 800, alignSelf: 'center', width: '100%' }}
                    renderItem={({ item }) => (
                        <View key={item.id + item.name} style={styles.holder}>
                            {categoryItem(item.id, item.name, item.stocks)}
                        </View>
                    )}
                    ListHeaderComponent={
                        (isBrandLoading && brandResponseList.length === 0) ? (
                            <View style={{ paddingVertical: theme.spacing.md }}>
                                <ActivityIndicator size="large" color={palette.main.p500} />
                            </View>
                        ) : null
                    }
                    ListFooterComponent={
                        (isBrandLoading && brandResponseList.length > 0) ? (
                            <View style={{ paddingVertical: Platform.OS == 'ios' ? theme.spacing.md : theme.spacing.xl }}>
                                <ActivityIndicator size="large" color={palette.main.p500} />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        !isBrandLoading ? (
                            <View style={{ padding: theme.spacing.md, alignItems: 'center' }}>
                                <Typography>No brand found</Typography>
                            </View>
                        ) : null
                    }
                />
            </View>
        </WrapperNoScroll>
    );
}

export default React.memo(Brands);
