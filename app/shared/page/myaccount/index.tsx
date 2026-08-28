import {
    add_circle,
    brand,
    categories,
    edit,
    homeLike,
    homeNotification,
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
    contact_support,
    share_product,
} from '@/assets/icons';
import { CommonActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
    Switch,
    Clipboard,
} from "react-native";
import { useGlobal } from "@/shared/helpers/GlobalContext.tsx";
import { styles } from './styles';
import Icon from "@/shared/component/icon";
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";
import AuthSessionService from "@/service/auth/AuthSessionService";
import Section from "@/shared/component/section";
import Environment from "@/shared/utils/Environment.tsx";
import LoginService from "@/service/auth/LoginService.tsx";
import { useLoading } from "@/shared/utils/LoadingProvider.tsx";
import { semantic, palette } from "@/shared/constants/colors.ts";
import StoreDialog from "@/shared/page/myaccount/contactus";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";
import { cancelAllScheduledNotifications } from "@/shared/utils/ScheduleNotification.tsx";
import { currencyType } from '@/shared/constants/global';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { FONT } from '@/shared/constants/fonts';
import { theme } from '@/shared/theme';
import ReferralApiService from '@/service/referral/ReferralApiService';


// ─── Quick Action Pill (horizontal scroll row) ───────────────────────────────

const QuickAction = ({ icon, label, subLabel, onPress, accent }: any) => (
    <TouchableOpacity style={styles.quickPill} activeOpacity={0.75} onPress={onPress}>
        <View style={[styles.quickIconWrap, { backgroundColor: (accent ?? palette.main.p500) + '22' }]}>
            <Icon icon={icon} customStyles={{ width: 22, height: 22 }} />
        </View>
        <Typography style={styles.quickLabel}>{label}</Typography>
        {subLabel ? <Typography style={styles.quickSub}>{subLabel}</Typography> : null}
    </TouchableOpacity>
);


// ─── Referral Banner Card ────────────────────────────────────────────────────

function ReferralBannerCard({ onViewDetails }: { onViewDetails: () => void }) {
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [referralUrl, setReferralUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const isRetail = Environment.isSuperMarketEnvironment();

    useEffect(() => {
        const svc = new ReferralApiService();
        svc.getReferralCode()
            .then(d => {
                setReferralCode(d.referral_code);
                setReferralUrl(d.referral_url);
            })
            .catch(() => {/* silently ignore */});
    }, []);

    const handleCopy = () => {
        if (!referralCode) return;
        Clipboard.setString(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleShare = () => {
        if (!referralCode) return;
        ReferralApiService.shareReferralLink(referralCode);
    };

    return (
        <Animated.View entering={FadeInDown.delay(120).duration(600)} style={styles.referralCard}>
            <LinearGradient
                colors={['#1E3A5F', '#0F2744']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.referralGradient}
            >
                {/* Decorative circle */}
                <View style={styles.referralDecorCircle} />

                <View style={styles.referralTop}>
                    <View style={styles.referralIconBg}>
                        <Icon icon={share_product} width={20} height={20} tintColor="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Typography style={styles.referralTitle}>Refer & Earn</Typography>
                        <Typography style={styles.referralSub}>
                            {isRetail
                                ? 'Earn Retail points when friends sign up'
                                : 'Earn Wholesale points after their store is approved'}
                        </Typography>
                    </View>
                    <TouchableOpacity onPress={onViewDetails} style={styles.referralDetailBtn} activeOpacity={0.8}>
                        <Typography style={styles.referralDetailBtnText}>Details</Typography>
                    </TouchableOpacity>
                </View>

                {/* Code row */}
                <View style={styles.referralCodeRow}>
                    <View style={styles.referralCodeBox}>
                        <Typography style={styles.referralCodeText}>
                            {referralCode ?? '— — —'}
                        </Typography>
                    </View>

                    <TouchableOpacity
                        style={[styles.referralActionBtn, copied && styles.referralActionBtnCopied]}
                        onPress={handleCopy}
                        activeOpacity={0.8}
                    >
                        <Icon
                            icon={qrcode}
                            width={14}
                            height={14}
                            tintColor={copied ? '#fff' : '#93C5FD'}
                        />
                        <Typography style={[styles.referralActionText, copied && { color: '#fff' }]}>
                            {copied ? 'Copied!' : 'Copy'}
                        </Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.referralActionBtn, styles.referralShareBtn]}
                        onPress={handleShare}
                        activeOpacity={0.8}
                    >
                        <Icon icon={share_product} width={14} height={14} tintColor="#fff" />
                        <Typography style={[styles.referralActionText, { color: '#fff' }]}>
                            Share
                        </Typography>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}


// ─── Main Screen ─────────────────────────────────────────────────────────────

function MyAccount() {
    const { navigate } = useNavigation<NavigationProps>();
    const authService = new AuthSessionService();
    const [userProfile, setUserProfile] = useState(authService.getAuthSession);
    const { showLoading, hideLoading } = useLoading();
    const [showContactUs, setShowContactUs] = useState<boolean>(false);

    const isRetail = Environment.isSuperMarketEnvironment();
    const memberGroup = isRetail ? userProfile?.data?.retailMemberGroup : userProfile?.data?.memberGroup;
    const loyaltyPoints = (isRetail ? userProfile?.data?.retailLoyaltyPoints : userProfile?.data?.loyaltyPoints) ?? 0;
    const nextTierPointsFormatted = isRetail ? userProfile?.data?.retailNextTierPoints_formatted : userProfile?.data?.nextTierPoints_formatted;
    const progress = (isRetail ? userProfile?.data?.retailProgress : userProfile?.data?.progress) ?? 0;
    const nextMemberGroup = (isRetail ? userProfile?.data?.nextRetailMemberGroup : userProfile?.data?.nextMemberGroup) ?? "N/A";

    const hasGradient = !!(memberGroup?.card_gradient_start && memberGroup?.card_gradient_end);
    const cardColors = hasGradient
        ? [memberGroup!.card_gradient_start!, memberGroup!.card_gradient_end!]
        : ['#FFFFFF', '#FFFFFF'];

    const textMainColor = hasGradient ? '#FFFFFF' : '#1A1D1E';
    const textSubColor = hasGradient ? 'rgba(255, 255, 255, 0.9)' : '#6A6A6A';
    const progressBg = hasGradient ? 'rgba(255, 255, 255, 0.35)' : '#F5F5F5';
    const progressFill = hasGradient ? '#FFFFFF' : '#D50000';
    const footerColor = hasGradient ? 'rgba(255, 255, 255, 0.85)' : '#9A9A9A';

    useFocusEffect(() => {
        setUserProfile(authService.getAuthSession);
    });

    const openContactUsModal = (status: boolean) => setShowContactUs(status);

    const {
        isWholesalesFloatingCartEnabled, setWholesalesFloatingCartEnabled,
        isSupermarketFloatingCartEnabled, setSupermarketFloatingCartEnabled
    } = useGlobal();

    function getAccountMenu(section: string) {
        const isFloatingCartEnabled = Environment.isWholeSalesEnvironment()
            ? isWholesalesFloatingCartEnabled
            : isSupermarketFloatingCartEnabled;

        const toggleFloatingCart = (value: boolean) => {
            if (Environment.isWholeSalesEnvironment()) {
                setWholesalesFloatingCartEnabled(value);
            } else {
                setSupermarketFloatingCartEnabled(value);
            }
        };

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
                {
                    name: 'Refer & Earn',
                    leftIcon: <Icon icon={share_product} />,
                    onPress: () => navigate('referAndEarn'),
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
                    onPress: () => navigate('storePendingApproval'),
                },
            ],
            applicationSettings: [
                {
                    name: 'Express Cart',
                    leftIcon: <Icon icon={switch_icon} />,
                    rightElement: (
                        <Switch
                            value={isFloatingCartEnabled}
                            onValueChange={toggleFloatingCart}
                            trackColor={{ false: "#E2E8F0", true: palette.main.p500 }}
                            thumbColor={"#FFFFFF"}
                            ios_backgroundColor="#E2E8F0"
                            style={{
                                transform: [{ scaleX: 0.65 }, { scaleY: 0.65 }],
                                marginRight: normalize(-8)
                            }}
                        />
                    ),
                    onPress: () => toggleFloatingCart(!isFloatingCartEnabled),
                },
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
                        new AuthSessionService().removeImpersonateCustomerData();
                        new AuthSessionService().setEnvironment("")
                        navigate('storeSelector')
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

                {/* ── Profile Card ─────────────────────────────────────── */}
                <Animated.View entering={FadeInUp.duration(500)} style={styles.profileCardContainer}>
                    <LinearGradient
                        colors={cardColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.profileCardGradient}
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
                                {memberGroup && (
                                    <View style={[styles.groupBadge, { backgroundColor: hasGradient ? 'rgba(255, 255, 255, 0.2)' : memberGroup.bg_color }]}>
                                        <Typography style={[styles.groupText, { color: textMainColor }]}>
                                            {memberGroup.label}
                                        </Typography>
                                    </View>
                                )}
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
                </Animated.View>

                {/* ── Quick Actions ─────────────────────────────────────── */}
                <Animated.View entering={FadeInDown.delay(80).duration(500)}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickScrollContent}
                        style={styles.quickScroll}
                    >
                        <QuickAction
                            icon={order}
                            label="Orders"
                            subLabel="Active & Past"
                            onPress={() => navigate('orders')}
                            accent="#3B82F6"
                        />
                        <QuickAction
                            icon={homeLike}
                            label="Wishlist"
                            subLabel="Saved items"
                            onPress={() => navigate('wishlist')}
                            accent="#EC4899"
                        />
                        <QuickAction
                            icon={qrcode}
                            label="QR Code"
                            subLabel="Scan & ID"
                            onPress={() => navigate('qrcode')}
                            accent="#8B5CF6"
                        />
                        <QuickAction
                            icon={user}
                            label="Edit Profile"
                            subLabel="Personal Info"
                            onPress={() => navigate('editProfile')}
                            accent="#F59E0B"
                        />
                        <QuickAction
                            icon={walletFilled}
                            label="Payments"
                            subLabel="Cards & Banks"
                            onPress={() => navigate('paymentMethodList')}
                            accent="#10B981"
                        />
                    </ScrollView>
                </Animated.View>

                {/* ── Referral Banner ───────────────────────────────────── */}
                {!Environment?.isSalesRepresentativeEnvironment() && (
                    <View style={styles.referralWrapper}>
                        <ReferralBannerCard onViewDetails={() => navigate('referAndEarn')} />
                    </View>
                )}

                {/* ── Settings Menu ─────────────────────────────────────── */}
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