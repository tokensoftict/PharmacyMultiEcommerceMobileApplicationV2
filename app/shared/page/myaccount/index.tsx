import {
    add_circle,
    brand,
    categories,
    edit,
    homeLike,
    homeNotification,
    homeNotifications,
    location,
    logout,
    notification,
    order,
    qrcode,
    security_new,
    store,
    storeprofile,
    switch_icon,
    truckInTracking,
    user,
    walletFilled,
    contact_support
} from '@/assets/icons';
import { CommonActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import React, { useState } from "react";
import { View, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import { styles } from './styles';
import Icon from "@/shared/component/icon";
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";
import AuthSessionService from "@/service/auth/AuthSessionService";
import Section from "@/shared/component/section";
import Environment from "@/shared/utils/Environment.tsx";
import LoginService from "@/service/auth/LoginService.tsx";
import { useLoading } from "@/shared/utils/LoadingProvider.tsx";
import { semantic } from "@/shared/constants/colors.ts";
import StoreDialog from "@/shared/page/myaccount/contactus";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";
import { cancelAllScheduledNotifications } from "@/shared/utils/ScheduleNotification.tsx";
import { currencyType } from '@/shared/constants/global';
import LinearGradient from 'react-native-linear-gradient';


const QuickAction = ({ icon, label, subLabel, onPress }: any) => (
    <TouchableOpacity style={styles.gridItem} activeOpacity={0.7} onPress={onPress}>
        <View style={styles.gridIconWrapper}>
            <Icon icon={icon} width={20} height={20} />
        </View>
        <Typography style={styles.gridLabel}>{label}</Typography>
        <Typography style={styles.gridSubLabel}>{subLabel}</Typography>
    </TouchableOpacity>
);

function MyAccount() {
    const { navigate } = useNavigation<NavigationProps>();
    const authService = new AuthSessionService();
    const [userProfile, setUserProfile] = useState(authService.getAuthSession);
    const { showLoading, hideLoading } = useLoading();
    const [showContactUs, setShowContactUs] = useState<boolean>(false);

    // Hardcoded analytics for redesign appeal
    const isRetail = Environment.isSuperMarketEnvironment();
    const memberGroup = isRetail ? userProfile?.data?.retailMemberGroup : userProfile?.data?.memberGroup;
    const loyaltyPoints = (isRetail ? userProfile?.data?.retailLoyaltyPoints : userProfile?.data?.loyaltyPoints) ?? 0;
    const nextTierPoints = (isRetail ? userProfile?.data?.retailNextTierPoints : userProfile?.data?.nextTierPoints) ?? 0;
    const nextTierPointsFormatted = isRetail ? userProfile?.data?.retailNextTierPoints_formatted : userProfile?.data?.nextTierPoints_formatted;
    const progress = (isRetail ? userProfile?.data?.retailProgress : userProfile?.data?.progress) ?? 0;
    const totalOrders = userProfile?.data?.totalOrders ?? 0;
    const memberSince = userProfile?.data?.memberSince ?? "N/A";
    const nextMemberGroup = (isRetail ? userProfile?.data?.nextRetailMemberGroup : userProfile?.data?.nextMemberGroup) ?? "N/A";

    const hasGradient = !!(memberGroup?.card_gradient_start && memberGroup?.card_gradient_end);
    const cardColors = hasGradient
        ? [memberGroup!.card_gradient_start!, memberGroup!.card_gradient_end!]
        : ['#FFFFFF', '#FFFFFF'];

    // Dynamic text colors for premium look
    const textMainColor = hasGradient ? '#FFFFFF' : '#1A1D1E';
    const textSubColor = hasGradient ? 'rgba(255, 255, 255, 0.9)' : '#6A6A6A';
    const progressBg = hasGradient ? 'rgba(255, 255, 255, 0.35)' : '#F5F5F5';
    const progressFill = hasGradient ? '#FFFFFF' : '#D50000';
    const footerColor = hasGradient ? 'rgba(255, 255, 255, 0.85)' : '#9A9A9A';



    useFocusEffect(() => {
        setUserProfile(authService.getAuthSession);
    });

    const openContactUsModal = (status: boolean) => {
        setShowContactUs(status)
    }

    function getAccountMenu(section: string) {
        const menuItems = {
            general: [
                {
                    name: 'My Orders',
                    leftIcon: <Icon icon={order} />,
                    onPress: () => navigate('orders'),
                },
                {
                    name: 'Wishlist',
                    leftIcon: <Icon icon={homeLike} />,
                    onPress: () => navigate('wishlist'),
                },
                {
                    name: 'My QR Code',
                    leftIcon: <Icon icon={qrcode} />,
                    onPress: () => navigate('qrcode'),
                },
            ],
            accountSettings: [
                {
                    name: 'Address',
                    leftIcon: <Icon icon={location} />,
                    onPress: () => navigate('addressList'),
                },
                {
                    name: 'Payment Methods',
                    leftIcon: <Icon icon={walletFilled} />,
                    onPress: () => navigate('paymentMethodList'),
                },
                {
                    name: 'Delivery Methods',
                    leftIcon: <Icon icon={truckInTracking} />,
                    onPress: () => navigate('deliveryMethodList'),
                },
                // {
                //     name: 'Food Delivery',
                //     leftIcon: <Icon icon={truckInTracking} />,
                //     onPress: () => navigate('food_delivery'),
                // },
            ],
            mystore: [
                {
                    name: 'Create Your Store',
                    leftIcon: <Icon icon={store} />,
                    onPress: () => navigate('createWholesalesStore'),
                },
                {
                    name: 'My Store Profile',
                    leftIcon: <Icon icon={storeprofile} />,
                    onPress: () => navigate('storeProfile'),
                },
            ],
            applicationSettings: [
                {
                    name: 'Notifications',
                    leftIcon: <Icon icon={notification} />,
                    onPress: () => navigate('notifications'),
                },
                {
                    name: 'Security',
                    leftIcon: <Icon icon={security_new} />,
                    onPress: () => navigate('security'),
                },
                {
                    name: 'Switch Store',
                    leftIcon: <Icon icon={switch_icon} />,
                    onPress: () => {
                        Alert.alert('PS GDC', 'Are you sure you want to Switch Store?', [
                            {
                                text: 'Cancel',
                                onPress: () => { },
                                style: 'cancel',
                            },
                            {
                                text: 'Yes', onPress: () => {
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'storeSelector' }],
                                    })
                                    new AuthSessionService().removeImpersonateCustomerData();
                                    new AuthSessionService().setEnvironment("")
                                    navigate('storeSelector')
                                }
                            }
                        ])
                    },
                },
                {
                    name: 'Log out',
                    leftIcon: <Icon icon={logout} />,
                    onPress: () => handleLogout(),
                },
            ],
            support: [
                {
                    name: 'Contact Us',
                    leftIcon: <Icon icon={contact_support} />,
                    onPress: () => openContactUsModal(true),
                },
            ]
        }

        if (Environment?.isWholeSalesEnvironment()) {
            menuItems.general.splice(2, 1)
            menuItems.general.push({
                name: 'Categories',
                leftIcon: <Icon icon={categories} tintColor={semantic.text.grey} />,
                onPress: () => navigate('categories'),
            })
        }

        if (userProfile?.data?.apps?.length === 1) {
            menuItems.applicationSettings = menuItems.applicationSettings.filter(i => i.name !== 'Switch Store');
        }

        if (userProfile?.data?.apps?.length > 1 && userProfile?.data?.apps[1].info.status === false) {
            menuItems.mystore.splice(0, 1)
            if (userProfile?.data?.apps[1].info.status === false) {
                menuItems.mystore[0] = {
                    name: 'My Store Profile',
                    leftIcon: <Icon icon={storeprofile} />,
                    onPress: () => navigate('storePendingApproval'),
                }
            }
        } else {
            menuItems.mystore.splice(1, 1)
        }

        if (Environment.isSuperMarketEnvironment() && userProfile?.data?.apps?.[1]?.info?.status === true) {
            menuItems.mystore.splice(0, 1)
        }

        if (Environment.isSuperMarketEnvironment()) {
            if (userProfile?.data?.apps?.length > 1 && userProfile?.data?.apps[1].info.status === false && userProfile?.data?.apps[1].info.unregistered === false) {
                menuItems.mystore.splice(0, 1);
            }
            menuItems.general.push({
                name: 'Brands',
                leftIcon: <Icon icon={brand} tintColor={semantic.text.grey} />,
                onPress: () => navigate('brands'),
            })
        }

        if (Environment.isWholeSalesEnvironment()) {
            menuItems.mystore.splice(0, 1);
            menuItems.mystore[0] = {
                name: 'My Store Profile',
                leftIcon: <Icon icon={storeprofile} />,
                onPress: () => navigate('storeProfile'),
            }
        }

        if (Environment?.isSalesRepresentativeEnvironment()) {
            menuItems.general = [];
            menuItems.accountSettings = [];
            menuItems.mystore = [];
        }

        // @ts-ignore
        return menuItems[section] || []
    }

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to exit?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes, Logout', onPress: () => {
                    showLoading("Signing out...");
                    new LoginService().logout().then((res) => {
                        hideLoading();
                        if (res) {
                            cancelAllScheduledNotifications();
                            CommonActions.reset({ index: 0, routes: [{ name: 'login' }] });
                            navigate('login');
                        }
                    });
                }
            }
        ]);
    };

    return (
        <WrapperNoScroll>
            <HeaderWithIcon
                title="MY ACCOUNT"
                rightComponent={
                    <TouchableOpacity onPress={() => navigate('notifications')} style={{ marginRight: normalize(10) }}>
                        <Icon icon={homeNotification} tintColor="#fff" height={normalize(24)} />
                    </TouchableOpacity>
                }
            />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* Overlapping Profile Card */}
                <LinearGradient
                    colors={cardColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.profileCard}
                >
                    <View style={styles.profileMain}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.avatar}
                                source={{ uri: userProfile?.data?.image }}
                            />
                            <TouchableOpacity style={styles.editBadge} onPress={() => navigate('editProfile')}>
                                <Icon icon={edit} width={14} height={14} tintColor="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <Typography style={[styles.userName, { color: textMainColor }]}>
                                {userProfile?.data?.firstname} {userProfile?.data?.lastname}
                            </Typography>
                            <Typography style={[styles.userPhone, { color: textSubColor }]}>{userProfile?.data?.phone}</Typography>

                            {
                                memberGroup && (
                                    <View style={[styles.groupBadge, { backgroundColor: hasGradient ? 'rgba(255, 255, 255, 0.2)' : memberGroup.bg_color }]}>
                                        <Typography style={[styles.groupText, { color: textMainColor }]}>
                                            {memberGroup.label}
                                        </Typography>
                                    </View>
                                )
                            }
                        </View>
                    </View>

                    {/* Loyalty Progress */}
                    <View style={[styles.loyaltyContainer, { borderTopColor: hasGradient ? 'rgba(255, 255, 255, 0.1)' : '#F0F0F0' }]}>
                        <View style={styles.loyaltyHeader}>
                            <Typography style={[styles.loyaltyTitle, { color: textMainColor }]}>PS Loyalty Rewards</Typography>
                            <Typography style={[styles.pointsText, { color: hasGradient ? '#FFFFFF' : '#D50000' }]}>{loyaltyPoints} PTS</Typography>
                        </View>
                        <View style={[styles.progressBarBg, { backgroundColor: progressBg }]}>
                            <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: progressFill }]} />
                        </View>
                        <Typography style={[styles.loyaltyFooter, { color: footerColor }]}>
                            Spend up to {currencyType}{nextTierPointsFormatted} and upgrade to {nextMemberGroup}
                        </Typography>
                    </View>
                </LinearGradient>

                {/* Quick Actions Grid */}
                <View style={styles.gridContainer}>
                    <QuickAction
                        icon={order}
                        label="My Orders"
                        subLabel="Active & Past"
                        onPress={() => navigate('orders')}
                    />
                    <QuickAction
                        icon={homeLike}
                        label="Wishlist"
                        subLabel="Saved items"
                        onPress={() => navigate('wishlist')}
                    />
                    <QuickAction
                        icon={qrcode}
                        label="QR Code"
                        subLabel="Scan & Identify"
                        onPress={() => navigate('qrcode')}
                    />
                    <QuickAction
                        icon={user}
                        label="Edit Profile"
                        subLabel="Personal Info"
                        onPress={() => navigate('editProfile')}
                    />
                </View>


                {/* Settings Menu */}
                <View style={styles.menuList}>
                    {getAccountMenu('general').length > 0 && (
                        <>
                            <Typography style={styles.sectionTitle}>General</Typography>
                            <Section title="" elements={getAccountMenu('general')} />
                        </>
                    )}

                    {getAccountMenu('accountSettings').length > 0 && (
                        <>
                            <Typography style={styles.sectionTitle}>Account Settings</Typography>
                            <Section title="" elements={getAccountMenu('accountSettings')} />
                        </>
                    )}

                    {getAccountMenu('mystore').length > 0 && (
                        <>
                            <Typography style={styles.sectionTitle}>My Store</Typography>
                            <Section title="" elements={getAccountMenu('mystore')} />
                        </>
                    )}

                    <Typography style={styles.sectionTitle}>Security & Support</Typography>
                    <Section title="" elements={[...getAccountMenu('applicationSettings'), ...getAccountMenu('support')]} />
                </View>

                <StoreDialog visible={showContactUs} onClose={() => openContactUsModal(false)} />
            </ScrollView>
        </WrapperNoScroll>
    );
}

export default React.memo(MyAccount);
