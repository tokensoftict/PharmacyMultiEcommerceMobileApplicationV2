import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import {normalize} from "@/shared/helpers";
import Typography from "@/shared/component/typography";

interface Props {
    title: string;
}

interface Product {
    name: string;
    price: string;
}

const products: Product[] = [
    { name: 'Laptop', price: '$899' },
    { name: 'Sneakers', price: '$59' },
    { name: 'Fan', price: '$45' },
    { name: 'Microwave', price: '$120' },
];

export default function ProductGridSection({title}:Props) {
    return (
        <View style={{  marginBottom : normalize(20)}}>
            <Typography style={styles.sectionTitle}>{title}</Typography>
            <View style={styles.productGrid}>
                {products.map((item, index) => (
                    <View key={index} style={styles.productCard}>
                        <Typography>{item.name}</Typography>
                        <Typography style={styles.price}>{item.price}</Typography>
                    </View>
                ))}
            </View>
        </View>
    )
}
