import React from 'react';
import { StyleSheet } from "react-native";
import { semantic } from "@/shared/constants/colors";
import { normalize } from "@/shared/helpers";

export const _styles = (isDarkMode: boolean) => StyleSheet.create({
  containerDate: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerOrder: {
    flexDirection: 'row',
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    padding: normalize(8),
    marginTop: normalize(10),

  },
  containerImage: {
    width: normalize(80),
    height: normalize(90),
    backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f04,
    borderRadius: normalize(16)
  },
  containerInfo: {
    flex: 1,
    marginLeft: normalize(18),
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: normalize(90)
  },
  name: {
    fontSize: normalize(12),

    color: isDarkMode ? semantic.text.white : semantic.text.black,
    maxHeight: normalize(50),
  },
  statusLabel: {
    fontSize: normalize(12),

    color: semantic.alert.danger.d500,
    maxHeight: normalize(50),
  },
  category: {
    fontSize: normalize(11),
    color: semantic.text.grey,
    marginVertical: normalize(8),
  },
  price: {
    fontSize: normalize(12),
    color: isDarkMode ? semantic.text.white : semantic.text.black,

  },
})
