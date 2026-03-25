import React from 'react';
import {
    View,
    TouchableOpacity,
    ImageBackground,
    FlatList
} from 'react-native';
import { normalize } from '@/shared/helpers';
import { styles } from './styles';
import Typography from '@/shared/component/typography';
import SectionHeader from '@/shared/component/sectionHeader';
import ProductCard from '@/shared/component/productCard';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack.tsx';

interface HorizontalProductListProps {
    title: string;
    productList: any[];
    id: number;
    moreRoute: string;
}

 function HorizontalProductList({
                                                  productList,
                                                  title,
                                                  id,
                                                  moreRoute
                                              }: HorizontalProductListProps) {
    const navigation = useNavigation<NavigationProps>();

    function navigateTo(endpoint: string, title: string, id: number) {
        // @ts-ignore
        navigation.navigate('productList', {
            endpoint,
            title,
            id
        });
    }

    const renderItem = ({ item }: { item: any }) => (
        <ProductCard product={item} />
    );

    return (
        <View style={styles.container}>
            <SectionHeader
                title={title}
                onSeeAll={() => navigateTo(moreRoute, title, id)}
            />

            <FlatList
                data={productList}
                horizontal
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: normalize(8) }}
            />
        </View>
    );
}


export default React.memo(HorizontalProductList);
