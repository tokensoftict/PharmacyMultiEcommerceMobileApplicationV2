import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    View,
    FlatList,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
    Image,
    Platform,
    Keyboard,
    ScrollView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@/shared/component/icon";
import { arrowBack, search, history, close } from "@/assets/icons";
import Input from "@/shared/component/input";
import { normalize, storage } from "@/shared/helpers";
import { palette } from "@/shared/constants/colors.ts";
import { activeOpacity, currencyType } from "@/shared/constants/global.ts";
import SearchProductService from "@/service/product/SearchProductService.tsx";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import Typography from "@/shared/component/typography";
import Environment from "@/shared/utils/Environment.tsx";
import { MILISEARCH_MASTER_INDEX, MILISEARCH_MASTER_KEY, MILISEARCH_URL } from "@env";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import _ from "lodash";
import { styles } from "./styles";

interface SearchDialogProps {
    visible?: boolean;
    onClose?: () => void;
    onItemSelected?: (item: any) => void;
}

const RECENT_SEARCHES_KEY = 'recent_searches_ps_gdc';

export default function Search({ visible = true, onClose, onItemSelected }: SearchDialogProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [submittedResults, setSubmittedResults] = useState<any[]>([]);
    const [popularProducts, setPopularProducts] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(-10)).current;

    const [loading, setLoading] = useState(false);
    const [footerLoading, setFooterLoading] = useState(false);
    const navigation = useNavigation<NavigationProps>();
    const insets = useSafeAreaInsets();

    const [popularProductPageNumber, setPopularProductPageNumber] = useState(1);
    const [popularProductLastPage, setPopularProductLastPage] = useState(3);
    const [searchResultPageNumber, setSearchResultPageNumber] = useState(1);
    const [searchResultLastPage, setSearchResultLastPage] = useState(3);
    const [querySubmitPageNumber, setQuerySubmitPageNumber] = useState(1);
    const [querySubmitLastPage, setQuerySubmitLastPage] = useState(3);

    const meilisearch = useRef(new SearchProductService({
        host: MILISEARCH_URL,
        apiKey: MILISEARCH_MASTER_KEY,
        index: MILISEARCH_MASTER_INDEX
    })).current;

    function formatDate(dateString: string): string {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
    }

    useEffectOnce(() => {
        meilisearch.initialize();
        loadRecentSearches();
        loadPopularProducts(1);
    }, []);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    const loadRecentSearches = async () => {
        const saved = await storage.get(RECENT_SEARCHES_KEY);
        if (saved) setRecentSearches(saved);
    };

    const saveRecentSearch = async (term: string) => {
        if (!term.trim()) return;
        const filtered = recentSearches.filter(s => s !== term);
        const updated = [term, ...filtered].slice(0, 5);
        setRecentSearches(updated);
        await storage.create(RECENT_SEARCHES_KEY, updated);
    };

    const removeRecentSearch = async (term: string) => {
        const updated = recentSearches.filter(s => s !== term);
        setRecentSearches(updated);
        await storage.create(RECENT_SEARCHES_KEY, updated);
    };

    const loadPopularProducts = useCallback(async (page: number) => {
        if (page > popularProductLastPage) return;

        if (page === 1) setLoading(true);
        else setFooterLoading(true);

        try {
            const data = await meilisearch.query("Peace", page, 20);

            // Frontend sorting as a reliable secondary layer
            const env = Environment.isWholeSalesEnvironment() ? "wholesales" : "retail";
            const sortedHits = [...data.hits].sort((a, b) => {
                const aQty = a?.[env]?.quantity || 0;
                const bQty = b?.[env]?.quantity || 0;
                if (aQty > 0 && bQty <= 0) return -1;
                if (aQty <= 0 && bQty > 0) return 1;
                return 0;
            });

            setPopularProductLastPage(data.totalPages);
            setPopularProductPageNumber(page + 1);
            setPopularProducts(prev => page === 1 ? sortedHits : [...prev, ...sortedHits]);
        } catch (error) {
            console.error("Error loading popular products:", error);
        } finally {
            setLoading(false);
            setFooterLoading(false);
        }
    }, [popularProductLastPage]);

    const handleSearch = useCallback(async (searchQuery: string, page: number = 1) => {
        if (!searchQuery || searchQuery.length < 3) {
            setResults([]);
            return;
        }

        setIsSubmitted(false);
        if (page > 1 && page > searchResultLastPage) return;

        if (page === 1) setResults([]); // Clear previous instant results

        try {
            const data = await meilisearch.query(searchQuery, page, 20);
            
            // Frontend sorting as a reliable secondary layer
            const env = Environment.isWholeSalesEnvironment() ? "wholesales" : "retail";
            const sortedHits = [...data.hits].sort((a, b) => {
                const aQty = a?.[env]?.quantity || 0;
                const bQty = b?.[env]?.quantity || 0;
                if (aQty > 0 && bQty <= 0) return -1;
                if (aQty <= 0 && bQty > 0) return 1;
                return 0;
            });

            setSearchResultLastPage(data.totalPages);
            setSearchResultPageNumber(page + 1);
            setResults(prev => page === 1 ? sortedHits : [...prev, ...sortedHits]);
        } catch (error) {
            console.error("Instant search error:", error);
        }
    }, [searchResultLastPage]);

    const debouncedSearch = useCallback(_.debounce((val: string) => handleSearch(val, 1), 300), [handleSearch]);

    const handleQuerySubmit = useCallback(async (submitQuery: string, page: number = 1) => {
        if (!submitQuery.trim()) return;

        Keyboard.dismiss();
        setIsSubmitted(true);
        saveRecentSearch(submitQuery);

        if (page === 1) {
            setSubmittedResults([]);
            setLoading(true);
        } else {
            if (page > querySubmitLastPage) return;
            setFooterLoading(true);
        }

        try {
            const data = await meilisearch.query(submitQuery, page, 20);
            
            // Frontend sorting as a reliable secondary layer
            const env = Environment.isWholeSalesEnvironment() ? "wholesales" : "retail";
            const sortedHits = [...data.hits].sort((a, b) => {
                const aQty = a?.[env]?.quantity || 0;
                const bQty = b?.[env]?.quantity || 0;
                if (aQty > 0 && bQty <= 0) return -1;
                if (aQty <= 0 && bQty > 0) return 1;
                return 0;
            });

            setQuerySubmitLastPage(data.totalPages);
            setQuerySubmitPageNumber(page + 1);
            setSubmittedResults(prev => page === 1 ? sortedHits : [...prev, ...sortedHits]);
        } catch (error) {
            console.error("Submit search error:", error);
        } finally {
            setLoading(false);
            setFooterLoading(false);
        }
    }, [querySubmitLastPage, recentSearches]);

    const navigateTo = (productId: string) => {
        // @ts-ignore
        navigation.navigate("detailProduct", { productId });
        if (onClose) {
            setResults([]);
            setSubmittedResults([]);
            setIsSubmitted(false);
            onClose();
        }
    };

    const renderProductItem = ({ item }: any) => {
        const info = item?.[Environment.isWholeSalesEnvironment() ? "wholesales" : "retail"] || {};
        const isOutOfStock = (info.quantity || 0) <= 0;

        return (
            <TouchableOpacity
                style={styles.productCard}
                activeOpacity={activeOpacity}
                onPress={() => onItemSelected ? onItemSelected(item) : navigateTo(item.id)}
            >
                {isOutOfStock && (
                    <View style={styles.outOfStockOverlay}>
                        <View style={styles.outOfStockLabel}>
                            <Typography style={styles.outOfStockLabelText}>Out of Stock</Typography>
                        </View>
                    </View>
                )}
                <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
                <Typography numberOfLines={1} style={styles.productName}>{item.name}</Typography>
                <View style={styles.priceWrapper}>
                    <Typography style={styles.currency}>{currencyType}</Typography>
                    <Typography style={styles.price}>{info.price || '0'}</Typography>
                </View>
                <View style={styles.cardFooter}>
                    <View style={[styles.badge, styles.expiryBadge]}>
                        <Typography style={[styles.badgeText, styles.expiryText]}>
                            Exp: {info.expiry_date ? formatDate(info.expiry_date) : "N/A"}
                        </Typography>
                    </View>
                    <View style={[styles.badge, isOutOfStock ? styles.outOfStockBadge : styles.stockBadge]}>
                        <Typography style={[styles.badgeText, isOutOfStock ? styles.outOfStockText : styles.stockText]}>
                            {isOutOfStock ? '0' : info.quantity} left
                        </Typography>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.header,
                {
                    paddingTop: insets.top ? (insets.top + normalize(5)) : normalize(12),
                    opacity: fadeAnim,
                    transform: [{ translateY: translateYAnim }]
                }
            ]}>
                <View style={styles.searchBarWrapper}>
                    <Input
                        leftIcon={<Icon icon={arrowBack} tintColor="#1A1D1E" onPress={() => {
                            if (isSubmitted) setIsSubmitted(false);
                            else navigation.goBack();
                        }} />}
                        value={query}
                        autoFocus={true}
                        onChangeText={(text) => {
                            setQuery(text);
                            debouncedSearch(text);
                        }}
                        onSubmitEditing={() => handleQuerySubmit(query, 1)}
                        placeholder={'Search products...'}
                    />
                </View>
            </Animated.View>

            <View style={styles.content}>
                {loading && (
                    <View style={styles.emptyState}>
                        <ActivityIndicator size="large" color={palette.main.p500} />
                    </View>
                )}

                {!loading && query.length === 0 && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {recentSearches.length > 0 && (
                            <View style={{ marginBottom: normalize(24) }}>
                                <Typography style={styles.sectionTitle}>RECENT SEARCHES</Typography>
                                {recentSearches.map((s, i) => (
                                    <View key={i} style={styles.recentSearchItem}>
                                        <TouchableOpacity
                                            style={styles.recentSearchRow}
                                            onPress={() => { setQuery(s); handleQuerySubmit(s, 1); }}
                                        >
                                            <Icon icon={history} width={18} height={18} tintColor="#94A3B8" />
                                            <Typography style={styles.recentSearchText}>{s}</Typography>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => removeRecentSearch(s)}>
                                            <Icon icon={close} width={16} height={16} tintColor="#CBD5E1" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}

                        <Typography style={styles.sectionTitle}>POPULAR PRODUCTS</Typography>
                        <FlatList
                            data={popularProducts}
                            numColumns={2}
                            scrollEnabled={false}
                            renderItem={renderProductItem}
                            keyExtractor={(item, idx) => `pop-${item.id}-${idx}`}
                            columnWrapperStyle={styles.popularGrid}
                        />
                        {footerLoading && <ActivityIndicator size="small" color={palette.main.p500} style={{ margin: 20 }} />}
                    </ScrollView>
                )}

                {!loading && !isSubmitted && results.length > 0 && query.length >= 3 && (
                    <View style={styles.suggestionsList}>
                        <Typography style={styles.sectionTitle}>SUGGESTIONS</Typography>
                        <FlatList
                            data={results}
                            keyExtractor={(item, idx) => `sug-${item.id}-${idx}`}
                            renderItem={({ item }) => {
                                const info = item?.[Environment.isWholeSalesEnvironment() ? "wholesales" : "retail"] || {};
                                const isOutOfStock = (info.quantity || 0) <= 0;
                                return (
                                    <TouchableOpacity
                                        style={styles.suggestionItem}
                                        onPress={() => { setQuery(item.name); handleQuerySubmit(item.name, 1); }}
                                    >
                                        <Icon icon={search} width={18} height={18} tintColor="#94A3B8" />
                                        <Typography style={[styles.suggestionText, isOutOfStock && { color: '#94A3B8' }]}>
                                            {item.name} {isOutOfStock && <Typography style={{ color: '#D50000', fontSize: normalize(10), fontWeight: '700' }}> (OUT OF STOCK)</Typography>}
                                        </Typography>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                )}

                {!loading && isSubmitted && (
                    <View style={{ flex: 1 }}>
                        <Typography style={styles.sectionTitle}>
                            {submittedResults.length} RESULTS FOR "{query.toUpperCase()}"
                        </Typography>
                        {submittedResults.length > 0 ? (
                            <FlatList
                                data={submittedResults}
                                numColumns={2}
                                showsVerticalScrollIndicator={false}
                                renderItem={renderProductItem}
                                keyExtractor={(item, idx) => `res-${item.id}-${idx}`}
                                columnWrapperStyle={styles.popularGrid}
                                onEndReached={() => handleQuerySubmit(query, querySubmitPageNumber)}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={footerLoading ? <ActivityIndicator size="small" color={palette.main.p500} style={{ margin: 20 }} /> : null}
                            />
                        ) : (
                            <View style={styles.emptyState}>
                                <Typography style={{ fontSize: normalize(48) }}>🔎</Typography>
                                <Typography style={styles.emptyTitle}>No Results Found</Typography>
                                <Typography style={styles.emptySub}>
                                    We couldn't find anything matching "{query}". Try checking your spelling or using different keywords.
                                </Typography>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}
