import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import Typography from "@/shared/component/typography";
import { activeOpacity } from "@/shared/constants/global";
import useDarkMode from "@/shared/hooks/useDarkMode";
import { normalize } from "@/shared/helpers";
import { palette } from "@/shared/constants/colors.ts";

export interface TopNavigationProps {
  id: number,
  name: string,
  active: boolean,
}

export default function TopNavigation({ onChange }: any) {
  const [tabs, setTabs] = useState<TopNavigationProps[]>([
    { id: 1, name: 'In Progress', active: true },
    { id: 2, name: 'Completed', active: false },
    { id: 3, name: 'Cancelled', active: false },
  ]);

  const { isDarkMode } = useDarkMode();

  function handleChange(tabSelected: TopNavigationProps) {
    setTabs(tabs.map(option => ({
      ...option,
      active: option.id === tabSelected.id
    })));
    onChange(tabSelected);
  }

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        return (
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={() => handleChange(tab)}
            style={[
              styles.tab,
              tab.active && styles.tabActive
            ]}
            key={tab.id}
          >
            <Typography style={[
              styles.text,
              tab.active && styles.textActive
            ]}>
              {tab.name}
            </Typography>
            {tab.active && (
              <Animated.View 
                entering={undefined} // Reanimated entrance could be added if needed
                style={styles.activeIndicator} 
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: normalize(15),
    padding: normalize(4),
    marginVertical: normalize(10),
  },
  tab: {
    flex: 1,
    paddingVertical: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(12),
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: normalize(13),
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: '#64748B',
  },
  textActive: {
    color: palette.main.p500,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  activeIndicator: {
    // Optional: a small dot or line could go here
  }
});
