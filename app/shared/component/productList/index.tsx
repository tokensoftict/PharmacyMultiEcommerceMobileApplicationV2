import { normalize } from "@/shared/helpers";
import React from 'react';
import List from "../list";
import { View } from "react-native";
import CardProductHorizontal from "../cardProductHorizontal";

export default function ProductList() {

  function renderItem(item: any, key: number) {
    return <View style={{marginBottom: normalize(20), flex: 1}} key={key}>
      <CardProductHorizontal  product={item} />
    </View>
  }
  return (
    <List
      between
      data={[]}
      rows={1}
      renderItem={renderItem}
    />
  )
}
