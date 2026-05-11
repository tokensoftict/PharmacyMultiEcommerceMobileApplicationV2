import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useGlobal } from '@/shared/helpers/GlobalContext';
import Typography from '@/shared/component/typography';
import { palette, semantic } from '@/shared/constants/colors';
import { normalize } from '@/shared/helpers';
import { FONT } from '@/shared/constants/fonts';
import Icon from '@/shared/component/icon';
import { white_shopping_cart, close } from '@/assets/icons';
import { NavigationProps } from '@/shared/routes/stack';
import { currencyType } from '@/shared/constants/global';
import { navigationRef } from '@/shared/utils/NavigationService';
import Environment from '@/shared/utils/Environment';

const { width, height } = Dimensions.get('window');
const COLLAPSED_SIZE = normalize(56);
const EXPANDED_WIDTH = width - normalize(32);
const PADDING = normalize(16);

const FloatingCartBar = () => {
    const { 
        cartCount, cartTotal, 
        isWholesalesFloatingCartEnabled, 
        isSupermarketFloatingCartEnabled 
    } = useGlobal();
    const navigation = useNavigation<NavigationProps>();
    const [activeRoute, setActiveRoute] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const isEnabled = Environment.isWholeSalesEnvironment() 
        ? isWholesalesFloatingCartEnabled 
        : isSupermarketFloatingCartEnabled;
    
    // Position and Expansion state
    const expandAnim = useRef(new Animated.Value(0)).current; 
    const translateX = useRef(new Animated.Value(width - COLLAPSED_SIZE - PADDING)).current;
    const translateY = useRef(new Animated.Value(height - normalize(200))).current;
    
    // Remember the position where it was collapsed
    const savedX = useRef(width - COLLAPSED_SIZE - PADDING);
    const savedY = useRef(height - normalize(200));

    useEffect(() => {
        const updateRoute = () => {
            const route = navigationRef.getCurrentRoute();
            if (route) setActiveRoute(route.name);
        };
        if (navigationRef.isReady()) updateRoute();
        const unsubscribe = navigationRef.addListener('state', updateRoute);
        return unsubscribe;
    }, []);

    const toggleExpand = () => {
        if (isExpanded) {
            // Collapse back to saved position
            Animated.parallel([
                Animated.spring(expandAnim, {
                    toValue: 0,
                    useNativeDriver: false,
                    friction: 8,
                }),
                Animated.spring(translateX, {
                    toValue: savedX.current,
                    useNativeDriver: false,
                    friction: 8,
                })
            ]).start();
            setIsExpanded(false);
        } else {
            // Save current position as the collapse target
            // (Wait, it's already saved during drag end)
            
            // Expand into a centered bar
            Animated.parallel([
                Animated.spring(expandAnim, {
                    toValue: 1,
                    useNativeDriver: false,
                    friction: 8,
                }),
                Animated.spring(translateX, {
                    toValue: PADDING,
                    useNativeDriver: false,
                    friction: 8,
                })
            ]).start();
            setIsExpanded(true);
        }
    };

    const onGestureEvent = (event: any) => {
        const { translationX, translationY } = event.nativeEvent;
        
        let newX = savedX.current + translationX;
        let newY = savedY.current + translationY;

        // Boundaries
        newX = Math.max(0, Math.min(newX, width - COLLAPSED_SIZE));
        newY = Math.max(normalize(50), Math.min(newY, height - COLLAPSED_SIZE - normalize(100)));

        translateX.setValue(newX);
        translateY.setValue(newY);
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX, translationY } = event.nativeEvent;
            
            // Finalize the saved position
            savedX.current += translationX;
            savedY.current += translationY;

            // Constrain within screen
            savedX.current = Math.max(0, Math.min(savedX.current, width - COLLAPSED_SIZE));
            savedY.current = Math.max(normalize(50), Math.min(savedY.current, height - COLLAPSED_SIZE - normalize(100)));
            
            translateX.setValue(savedX.current);
            translateY.setValue(savedY.current);
        }
    };

    const hiddenRoutes = [
        'splashScreen', 'mainMenu', 'medReminderForm', 'listMedReminder', 
        'historyLogs', 'refillTracker', 'viewReminder', 'viewLogs', 'checkout'
    ];

    if (!isEnabled || cartCount <= 0 || hiddenRoutes.includes(activeRoute || '')) {
        return null;
    }

    const containerWidth = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLLAPSED_SIZE, EXPANDED_WIDTH]
    });

    const borderRadius = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLLAPSED_SIZE / 2, normalize(16)]
    });

    const contentOpacity = expandAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1]
    });

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            enabled={!isExpanded}
        >
            <Animated.View 
                style={[
                    styles.container, 
                    { 
                        width: containerWidth, 
                        borderRadius: borderRadius,
                        left: translateX,
                        top: translateY,
                    }
                ]}
            >
                {!isExpanded ? (
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        style={styles.collapsedTouch}
                        onPress={toggleExpand}
                    >
                        <View style={styles.cartIconContainerCollapsed}>
                            <Icon icon={white_shopping_cart} customStyles={styles.cartIcon} />
                            <View style={styles.badge}>
                                <Typography style={styles.badgeText}>{cartCount}</Typography>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.expandedContent}>
                        <Animated.View style={[styles.leftContent, { opacity: contentOpacity }]}>
                            <TouchableOpacity onPress={toggleExpand} style={styles.closeButton}>
                                <Icon icon={close} customStyles={styles.closeIcon} />
                            </TouchableOpacity>
                            <View style={styles.textContainer}>
                                <Typography style={styles.title}>Cart Total ({cartCount})</Typography>
                                <Typography style={styles.total}>{currencyType}{cartTotal}</Typography>
                            </View>
                        </Animated.View>
                        
                        <Animated.View style={{ opacity: contentOpacity }}>
                            <TouchableOpacity 
                                style={styles.checkoutButton}
                                onPress={() => {
                                    // Just navigate, don't collapse manually here as it will unmount/hide anyway
                                    navigation.navigate('checkout');
                                }}
                            >
                                <Typography style={styles.buttonText}>Checkout</Typography>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: '#1E293B',
        height: COLLAPSED_SIZE,
        overflow: 'hidden',
        zIndex: 10000,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 12,
            }
        }),
    },
    collapsedTouch: {
        width: COLLAPSED_SIZE,
        height: COLLAPSED_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(12),
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeButton: {
        width: normalize(32),
        height: normalize(32),
        borderRadius: normalize(16),
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(10),
    },
    closeIcon: {
        width: normalize(12),
        height: normalize(12),
        tintColor: '#FFFFFF',
    },
    cartIconContainerCollapsed: {
        width: COLLAPSED_SIZE,
        height: COLLAPSED_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartIcon: {
        width: normalize(24),
        height: normalize(24),
        tintColor: '#FFFFFF',
    },
    badge: {
        position: 'absolute',
        top: normalize(8),
        right: normalize(8),
        backgroundColor: semantic.alert.danger.d500,
        minWidth: normalize(18),
        height: normalize(18),
        borderRadius: normalize(9),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(2),
        borderWidth: 2,
        borderColor: '#1E293B',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: normalize(8),
        fontFamily: FONT.BOLD,
    },
    textContainer: {
        justifyContent: 'center',
    },
    title: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: normalize(10),
        fontFamily: FONT.REGULAR,
    },
    total: {
        color: '#FFFFFF',
        fontSize: normalize(15),
        fontFamily: FONT.BOLD,
    },
    checkoutButton: {
        backgroundColor: palette.main.p500,
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(16),
        borderRadius: normalize(10),
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: normalize(13),
        fontFamily: FONT.BOLD,
    }
});

export default FloatingCartBar;
