import React, { memo } from 'react';
import { Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import normalize from 'react-native-normalize';
import Svg, { Circle, G, Path, Polygon, Rect } from 'react-native-svg';
import * as NavigationService from '@/shared/utils/NavigationService';
import { useSeasonalTheme } from '../SeasonalThemeProvider';

/**
 * Backend-controlled seasonal promotional banner (Christmas / New Year / custom).
 * Never replaces existing banners: it renders alongside the home promotional area
 * only when `show_seasonal_banner` is enabled and configured by the backend.
 */
export const SeasonalBanner: React.FC = memo(() => {
    const { active, config } = useSeasonalTheme();

    const hasContent = Boolean(config.banner_image || config.banner_title || config.banner_subtitle);
    if (!active || !config.show_seasonal_banner || !hasContent) {
        return null;
    }

    const isNewYear = config.theme === 'new_year';
    const primary = config.primary_festive_color || (isNewYear ? '#1B1A2E' : '#B71C1C');
    const secondary = config.secondary_festive_color || (isNewYear ? '#3A2E0D' : '#1B5E20');
    const goldAccent = isNewYear || config.show_gold_accents;

    const handlePress = () => {
        const link = config.banner_link;
        if (!link) return;
        if (/^https?:\/\//i.test(link)) {
            Linking.openURL(link).catch(() => {});
            return;
        }
        // In-app route path e.g. "/specialOffers" or "/productList"
        const routeName = link.replace(/^\/+/, '').split('?')[0];
        if (routeName) {
            try {
                NavigationService.navigate(routeName as any);
            } catch {
                // Ignore unknown routes gracefully
            }
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={config.banner_link ? 0.88 : 1}
            disabled={!config.banner_link}
            onPress={handlePress}
            style={[styles.container, goldAccent && styles.goldBorder]}
        >
            <LinearGradient
                colors={[primary, secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Decorative vector illustrations (snowflakes, Christmas trees & gift box) */}
                <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                    <Svg width="100%" height="100%" viewBox="0 0 340 110" preserveAspectRatio="xMaxYMax slice">
                        {/* Subtle background snowflakes / stars */}
                        <Circle cx="36" cy="22" r="2" fill="rgba(255,255,255,0.28)" />
                        <Circle cx="120" cy="16" r="1.6" fill="rgba(255,255,255,0.25)" />
                        <Circle cx="210" cy="28" r="2.2" fill="rgba(255,255,255,0.22)" />
                        {!isNewYear ? (
                            <G opacity={0.9}>
                                {/* Christmas tree */}
                                <Polygon points="292,26 274,58 310,58" fill="#2E7D32" />
                                <Polygon points="292,42 270,80 314,80" fill="#1B5E20" />
                                <Rect x="288" y="80" width="8" height="10" fill="#5D4037" />
                                <Polygon
                                    points="292,18 294,23 299,23.5 295,26.8 296.3,32 292,29 287.7,32 289,26.8 285,23.5 290,23"
                                    fill="#FFD54F"
                                />
                                {/* Gift box with ribbon */}
                                <Rect x="312" y="70" width="20" height="20" rx="2" fill="#E53935" />
                                <Rect x="320" y="70" width="4" height="20" fill="#FFD54F" />
                                <Rect x="312" y="78" width="20" height="4" fill="#FFD54F" />
                                <Path d="M318 70 C315 65, 322 65, 322 70 C322 65, 329 65, 326 70" stroke="#FFD54F" strokeWidth="2" fill="none" />
                            </G>
                        ) : (
                            <G opacity={0.85}>
                                {/* Golden New Year stars */}
                                <Polygon
                                    points="300,24 303,32 312,33 305,38 307,47 300,42 293,47 295,38 288,33 297,32"
                                    fill="#FFD54F"
                                />
                                <Polygon
                                    points="324,56 326,61 331,61.5 327,65 328,70 324,67 320,70 321,65 317,61.5 322,61"
                                    fill="#F5D76E"
                                />
                            </G>
                        )}
                    </Svg>
                </View>

                <View style={styles.row}>
                    <View style={styles.textCol}>
                        {config.campaign_name ? (
                            <Text numberOfLines={1} style={styles.badge}>
                                {config.campaign_name.toUpperCase()}
                            </Text>
                        ) : null}
                        {config.banner_title ? (
                            <Text numberOfLines={2} style={styles.title}>
                                {config.banner_title}
                            </Text>
                        ) : null}
                        {config.banner_subtitle ? (
                            <Text numberOfLines={2} style={styles.subtitle}>
                                {config.banner_subtitle}
                            </Text>
                        ) : null}
                    </View>
                    {config.banner_image ? (
                        <Image
                            source={{ uri: config.banner_image }}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    ) : null}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        marginHorizontal: normalize(15),
        marginVertical: normalize(6),
        borderRadius: normalize(14),
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    goldBorder: {
        borderWidth: 1.2,
        borderColor: '#D4AF37',
    },
    gradient: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(16),
        minHeight: normalize(86),
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textCol: {
        flex: 1,
        paddingRight: normalize(10),
    },
    badge: {
        color: '#FFD54F',
        fontSize: normalize(10),
        fontWeight: '700',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    title: {
        color: '#FFFFFF',
        fontSize: normalize(17),
        fontWeight: '800',
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    },
    subtitle: {
        color: 'rgba(255,255,255,0.92)',
        fontSize: normalize(12.5),
        marginTop: normalize(3),
    },
    bannerImage: {
        width: normalize(68),
        height: normalize(68),
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
});

export default SeasonalBanner;

