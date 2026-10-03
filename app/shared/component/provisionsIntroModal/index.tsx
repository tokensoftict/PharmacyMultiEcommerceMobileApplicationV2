import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { close as closeIcon, check as checkIcon } from '@/assets/icons';
import { theme } from '@/shared/theme';
import { FONT } from '@/shared/constants/fonts';
import { normalize } from '@/shared/helpers';
import useDarkMode from '@/shared/hooks/useDarkMode';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const PROVISIONS_INTRO_STORAGE_KEY = '@hide_provisions_intro_modal';

interface ProvisionsIntroModalProps {
  visible: boolean;
  onClose: (dontShowAgain: boolean) => void;
  onExplore: (dontShowAgain: boolean) => void;
}

export default function ProvisionsIntroModal({
  visible,
  onClose,
  onExplore,
}: ProvisionsIntroModalProps) {
  const { isDarkMode } = useDarkMode();
  const styles = _styles(isDarkMode);

  const [rendered, setRendered] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mount modal when visible
  useEffect(() => {
    if (visible) {
      setRendered(true);
    }
  }, [visible]);

  // Handle slide up & slide down animations
  useEffect(() => {
    if (!rendered) return;

    if (visible) {
      slideAnim.setValue(SCREEN_HEIGHT);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [rendered, visible]);

  const slideDownAndClose = (callback: () => void) => {
    callback();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRendered(false);
    });
  };

  const handleClose = async () => {
    if (dontShowAgain) {
      try {
        await AsyncStorage.setItem(PROVISIONS_INTRO_STORAGE_KEY, 'true');
      } catch (e) {}
    }
    slideDownAndClose(() => onClose(dontShowAgain));
  };

  const handleExplore = async () => {
    if (dontShowAgain) {
      try {
        await AsyncStorage.setItem(PROVISIONS_INTRO_STORAGE_KEY, 'true');
      } catch (e) {}
    }
    slideDownAndClose(() => onExplore(dontShowAgain));
  };

  if (!rendered) return null;

  return (
    <Modal visible={rendered} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <Animated.View style={[styles.cardContainer, { transform: [{ translateY: slideAnim }] }]}>
          {/* Top Banner Header */}
          <View style={styles.bannerHeader}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Icon icon={closeIcon} height={normalize(18)} tintColor="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.lottieWrap}>
              <LottieView
                source={require('@/assets/stores.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>

            <View style={styles.promoTag}>
              <Typography style={styles.promoTagText}>NEW FEATURE 🔥</Typography>
            </View>

            <Typography style={styles.bannerTitle}>Wholesale Provisions Store 🛍️</Typography>
            <Typography style={styles.bannerSubtitle}>
              Stock up on top food, beverage, and everyday essential brands at unbeatable carton wholesale prices!
            </Typography>
          </View>

          {/* Highlights List */}
          <View style={styles.bodyContent}>
            <View style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Typography style={{ fontSize: normalize(18) }}>📦</Typography>
              </View>
              <View style={styles.featureTextWrap}>
                <Typography style={styles.featureTitle}>Carton Wholesale Discounts</Typography>
                <Typography style={styles.featureDesc}>
                  Enjoy direct manufacturer rates when buying in bulk.
                </Typography>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Typography style={{ fontSize: normalize(18) }}>🚚</Typography>
              </View>
              <View style={styles.featureTextWrap}>
                <Typography style={styles.featureTitle}>Fast Store Dispatch</Typography>
                <Typography style={styles.featureDesc}>
                  Priority dispatch and direct delivery right to your shop.
                </Typography>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Typography style={{ fontSize: normalize(18) }}>⚡</Typography>
              </View>
              <View style={styles.featureTextWrap}>
                <Typography style={styles.featureTitle}>Instant Stock Updates</Typography>
                <Typography style={styles.featureDesc}>
                  Real-time stock indicators & seamless checkout experience.
                </Typography>
              </View>
            </View>
          </View>

          {/* Footer Action & Don't Show Again Checkbox */}
          <View style={styles.footerWrap}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setDontShowAgain(!dontShowAgain)}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkboxOuter, dontShowAgain && styles.checkboxChecked]}>
                {dontShowAgain && (
                  <Icon icon={checkIcon} width={normalize(12)} height={normalize(12)} tintColor="#FFFFFF" />
                )}
              </View>
              <Typography style={styles.checkboxLabel}>Don't show this again</Typography>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleExplore}
              style={styles.ctaBtn}
            >
              <Typography style={styles.ctaBtnText}>Explore Provisions Store 🚀</Typography>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const _styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.78)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: normalize(20),
    },
    cardContainer: {
      width: '100%',
      maxWidth: normalize(380),
      backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
      borderRadius: normalize(24),
      overflow: 'hidden',
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      borderWidth: 1,
      borderColor: isDarkMode ? '#1E293B' : '#E2E8F0',
    },
    bannerHeader: {
      backgroundColor: isDarkMode ? '#1E293B' : '#FFF5F5',
      paddingHorizontal: normalize(20),
      paddingTop: normalize(20),
      paddingBottom: normalize(16),
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#334155' : '#FEE2E2',
    },
    closeBtn: {
      position: 'absolute',
      top: normalize(14),
      right: normalize(14),
      padding: normalize(6),
      zIndex: 10,
    },
    lottieWrap: {
      width: normalize(130),
      height: normalize(110),
      justifyContent: 'center',
      alignItems: 'center',
    },
    lottie: {
      width: '100%',
      height: '100%',
    },
    promoTag: {
      backgroundColor: '#D50000',
      paddingHorizontal: normalize(10),
      paddingVertical: normalize(3),
      borderRadius: normalize(12),
      marginBottom: normalize(8),
    },
    promoTagText: {
      color: '#FFFFFF',
      fontSize: normalize(10),
      fontFamily: FONT.EXTRA_BOLD,
      letterSpacing: 0.5,
    },
    bannerTitle: {
      fontSize: normalize(18),
      fontFamily: FONT.EXTRA_BOLD,
      color: isDarkMode ? '#F8FAFC' : '#0F172A',
      textAlign: 'center',
      marginBottom: normalize(4),
    },
    bannerSubtitle: {
      fontSize: normalize(12),
      fontFamily: FONT.NORMAL,
      color: isDarkMode ? '#94A3B8' : '#64748B',
      textAlign: 'center',
      lineHeight: normalize(16),
    },
    bodyContent: {
      paddingHorizontal: normalize(20),
      paddingTop: normalize(16),
      paddingBottom: normalize(8),
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: normalize(12),
    },
    featureIconWrap: {
      width: normalize(40),
      height: normalize(40),
      borderRadius: normalize(12),
      backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: normalize(12),
      borderWidth: 1,
      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
    },
    featureTextWrap: {
      flex: 1,
    },
    featureTitle: {
      fontSize: normalize(13),
      fontFamily: FONT.BOLD,
      color: isDarkMode ? '#E2E8F0' : '#1E293B',
      marginBottom: normalize(2),
    },
    featureDesc: {
      fontSize: normalize(11),
      fontFamily: FONT.NORMAL,
      color: isDarkMode ? '#94A3B8' : '#64748B',
    },
    footerWrap: {
      paddingHorizontal: normalize(20),
      paddingBottom: normalize(20),
      paddingTop: normalize(12),
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#1E293B' : '#F1F5F9',
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: normalize(14),
    },
    checkboxOuter: {
      width: normalize(20),
      height: normalize(20),
      borderRadius: normalize(6),
      borderWidth: 2,
      borderColor: isDarkMode ? '#64748B' : '#CBD5E1',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: normalize(10),
      backgroundColor: 'transparent',
    },
    checkboxChecked: {
      backgroundColor: '#D50000',
      borderColor: '#D50000',
    },
    checkboxLabel: {
      fontSize: normalize(12),
      fontFamily: FONT.MEDIUM,
      color: isDarkMode ? '#CBD5E1' : '#475569',
    },
    ctaBtn: {
      backgroundColor: '#D50000',
      paddingVertical: normalize(14),
      borderRadius: normalize(14),
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#D50000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
    ctaBtnText: {
      color: '#FFFFFF',
      fontSize: normalize(14),
      fontFamily: FONT.BOLD,
    },
  });
