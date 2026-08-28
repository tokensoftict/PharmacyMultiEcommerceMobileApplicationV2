import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    FadeInDown,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Typography from "@/shared/component/typography";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Environment from "@/shared/utils/Environment.tsx";
import { palette, semantic } from "@/shared/constants/colors.ts";
import { theme } from "@/shared/theme";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import { FONT } from "@/shared/constants/fonts.ts";
import CampaignEventBus from "@/campaign/CampaignEventBus";

const appImages: Record<string, any> = {
    "wholesales": require("@/assets/images/wholesales.jpg"),
    "supermarket": require("@/assets/images/supermarket.jpg"),
    "sales representative": require("@/assets/images/sales_rep.jpg"),
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const StoreListItem = ({ store, index, onPress }: { store: any, index: number, onPress: () => void }) => {
    const { isDarkMode } = useDarkMode();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.98);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(100 + index * 100).springify()}
            style={styles.itemWrapper}
        >
            <AnimatedTouchableOpacity
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={0.9}
                style={[
                    styles.listItem,
                    isDarkMode && { backgroundColor: semantic.fill.f02, borderColor: semantic.fill.f04 },
                    animatedStyle
                ]}
            >
                <View style={styles.iconContainer}>
                    <Image source={appImages[store.name]} style={styles.itemImage} resizeMode="cover" />
                    <View style={styles.imageOverlay} />
                </View>
                <View style={styles.itemContent}>
                    <Typography style={[styles.storeName, isDarkMode && { color: '#FFF' }]}>
                        {store.name === "supermarket" ? "Supermarket & Pharmacy" : (store.name === "wholesales" ? "Wholesales & Bulk-sales" : "Sales Representative")}
                    </Typography>
                    <Typography numberOfLines={1} style={styles.storeDesc}>
                        {store.description}
                    </Typography>
                </View>
                <View style={styles.arrowContainer}>
                    <View style={styles.arrow} />
                </View>
            </AnimatedTouchableOpacity>
        </Animated.View>
    );
};

import WrapperNoScroll from "@/shared/component/wrapperNoScroll";

const StoreSelectionScreen = ({ navigation }: any) => {
    const { isDarkMode } = useDarkMode();
    const authService = new AuthSessionService();
    const [isLoading, setIsLoading] = useState(false);

    let userProfile: any;
    let authSession: any;
    if (Environment.isLogin()) {
        authSession = authService.getAuthSession();
        userProfile = authSession?.data;
    } else {
        authSession = authService.getTempSession();
        userProfile = authSession?.data;
    }

    const [profileData, setProfileData] = useState(userProfile);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = authSession?.data?.token?.access_token;
            if (!token) return;

            setIsLoading(true);
            try {
                const refreshData = await authService.fetchData(token);
                if (refreshData && refreshData.status === true) {
                    if (Environment.isLogin()) {
                        refreshData['loginStatus'] = true;
                        await authService.setAuthSession(refreshData);
                    } else {
                        authService.setTempSession(refreshData);
                    }
                    setProfileData(refreshData.data);
                }
            } catch (error) {
                console.error("Error refreshing store data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!profileData?.apps || profileData.apps.length === 0) {
            fetchUserData();
        }
    }, []);

    const userApps = profileData?.apps?.map((app: any) => ({
        id: app.name,
        name: app.name,
        image: app.name,
        description: app.description,
        status: app.info.status,
        last_seen: app.last_seen,
        unregistered: app.unregistered,
    })) || [];

    function selectStore(store: string, status: boolean, unregistered: boolean) {
        new AuthSessionService().setEnvironment(store);
        const targetStore = store === "sales representative" ? 'sales_representative' : store;

        // Trigger APP_OPEN now that store environment is active
        CampaignEventBus.emit('APP_OPEN');

        if (store === "wholesales" && unregistered && !Environment.isLogin()) {
            navigation.navigate("login");
        } else if (store === "wholesales" && unregistered) {
            navigation.navigate("createWholesalesStore");
        } else if (store === "wholesales" && !status) {
            navigation.navigate("storePendingApproval");
        } else {
            navigation.replace(targetStore);
        }
    }

    return (
        <WrapperNoScroll transparent={true} edges={['top', 'bottom']}>
            <View style={[styles.container, isDarkMode && { backgroundColor: semantic.fill.f01 }]}>
                <LinearGradient
                    colors={isDarkMode ? [semantic.fill.f01, '#1A1D1E'] : ['#FFFFFF', '#FDFDFD', '#F9FAFB']}
                    style={StyleSheet.absoluteFill}
                />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.innerContainer}>
                        <View style={styles.header}>
                            <Animated.View
                                entering={FadeInDown.duration(600)}
                                style={styles.logoWrapper}
                            >
                                <Image
                                    source={require("@/assets/images/logo.png")}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </Animated.View>

                            <Animated.View
                                entering={FadeInDown.delay(100).duration(600)}
                                style={styles.textWrapper}
                            >
                                <Typography style={[styles.welcomeText, isDarkMode && { color: '#FFF' }]}>
                                    Hi, <Typography style={styles.nameText}>{profileData?.firstname || 'Guest'}</Typography>
                                </Typography>
                                <Typography style={styles.subText}>
                                    Select a store to continue
                                </Typography>
                            </Animated.View>
                        </View>

                        <View style={styles.listContainer}>
                            {isLoading ? (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator size="large" color={palette.main.p500} />
                                    <Typography style={styles.loadingText}>Fetching stores...</Typography>
                                </View>
                            ) : (
                                userApps.map((store: any, index: number) => (
                                    <StoreListItem
                                        key={store.id}
                                        store={store}
                                        index={index}
                                        onPress={() => selectStore(store.name, store.status, store.unregistered)}
                                    />
                                ))
                            )}
                            {!isLoading && userApps.length === 0 && (
                                <View style={styles.emptyContainer}>
                                    <Typography style={styles.emptyText}>No stores available at the moment.</Typography>
                                </View>
                            )}
                        </View>

                        {!Environment.isLogin() && (
                            <Animated.View
                                entering={FadeInDown.delay(400)}
                                style={styles.footer}
                            >
                                <Typography style={styles.footerText}>Need another account?</Typography>
                                <TouchableOpacity onPress={() => navigation.navigate("login")}>
                                    <Typography style={styles.signInLink}>Sign In</Typography>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </WrapperNoScroll>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    logoWrapper: {
        width: 60,
        height: 60,
        marginBottom: theme.spacing.sm,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    textWrapper: {
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: theme.typography.lg,
        color: '#1E293B',
        fontFamily: FONT.BOLD,
    },
    nameText: {
        fontSize: theme.typography.xxl,
        color: palette.main.p500,
        fontFamily: FONT.BOLD,
    },
    subText: {
        fontSize: theme.typography.sm,
        color: '#64748B',
        marginTop: 4,
        fontFamily: FONT.SEMI_BOLD,
    },
    listContainer: {
        width: '100%',
    },
    itemWrapper: {
        marginBottom: theme.spacing.sm,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...theme.shadows.sm,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.sm,
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    itemContent: {
        flex: 1,
        marginLeft: theme.spacing.md,
        marginRight: theme.spacing.xs,
    },
    storeName: {
        fontSize: theme.typography.sm,
        fontFamily: FONT.BOLD,
        color: '#1E293B',
    },
    storeDesc: {
        fontSize: theme.typography.xs,
        color: '#94A3B8',
        marginTop: 2,
    },
    arrowContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrow: {
        width: 8,
        height: 8,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: '#CBD5E1',
        transform: [{ rotate: '45deg' }],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    footerText: {
        fontSize: theme.typography.sm,
        color: '#64748B',
    },
    signInLink: {
        fontSize: theme.typography.sm,
        color: palette.main.p500,
        fontFamily: FONT.BOLD,
        marginLeft: theme.spacing.xs,
    },
    loaderContainer: {
        paddingVertical: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: theme.spacing.sm,
        fontSize: theme.typography.sm,
        color: '#64748B',
    },
    emptyContainer: {
        paddingVertical: theme.spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: theme.typography.sm,
        color: '#64748B',
    },
});

export default StoreSelectionScreen;
