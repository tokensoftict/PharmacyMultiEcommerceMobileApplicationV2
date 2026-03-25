import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Typography from '../typography';
import { _styles } from './styles';
import { CategoryDTO } from '../../DTO';
import useDarkMode from '../../hooks/useDarkMode.tsx';

interface CategoriesProps {
    categories: CategoryDTO[];
}

 function Categories({ categories }: CategoriesProps) {
    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);

    const renderItem = ({ item }: { item: CategoryDTO }) => (
        <TouchableOpacity style={styles.parentContainer}>
            <View style={[styles.container, item.active && styles.containerActive]}>
                <Typography style={[styles.categoryName, item.active && styles.categoryNameActive]}>
                    {item.name}
                </Typography>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.listCategories}>
            <FlatList
                data={categories}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}


export default React.memo(Categories);
