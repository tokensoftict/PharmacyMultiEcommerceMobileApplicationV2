import React from 'react';
import Wrapper from "@/shared/component/wrapper";
import HeaderWithIcon from "@/shared/component/headerBack";
import FilterStarReview from "../../components/filterStarReview";
import { ScrollView, View } from "react-native";
import Review from "../../components/review";
import { normalize } from "@/shared/helpers";

export default function Reviews() {

  return (
    <Wrapper>
      <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal: normalize(24)}}>
        <HeaderWithIcon title="4.8 (5342 Review )" />
        <FilterStarReview />
        <Review />
        <Review />
        <Review />
        <Review />
        <Review />
      </ScrollView>
    </Wrapper>
  )
}
