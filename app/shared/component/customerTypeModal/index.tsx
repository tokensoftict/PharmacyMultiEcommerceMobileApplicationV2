import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { close as closeIcon } from '@/assets/icons';
import Request from "@/network/internet/request.tsx";
import { FONT } from '@/shared/constants/fonts';
import { normalize } from '@/shared/helpers';
import useDarkMode from '@/shared/hooks/useDarkMode';
import EnvironmentRequest from '@/network/internet/EnvironmentRequest';
import AuthSessionService from '@/service/auth/AuthSessionService';
import Toasts from '@/shared/utils/Toast';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CustomerTypeOption {
  id: number;
  name: string;
}

interface CustomerTypeModalProps {
  visible: boolean;
  onSuccess: () => void;
  onClose?: () => void;
  dismissable?: boolean;
}

const STORE_TYPE_ICONS: Record<string, string> = {
  provision: '🛍️',
  pharmacy: '💊',
  chemist: '🧪',
  supermarket: '🛒',
  hospital: '🏥',
  clinic: '🩺',
  wholesaler: '📦',
  distributor: '🚚',
  retailer: '🏪',
  patent: '💊',
  grocery: '🍏',
};

const getStoreEmoji = (name: string) => {
  const lower = name.toLowerCase();
  for (const key of Object.keys(STORE_TYPE_ICONS)) {
    if (lower.includes(key)) return STORE_TYPE_ICONS[key];
  }
  return '🏬';
};

export default function CustomerTypeModal({
  visible,
  onSuccess,
  onClose,
  dismissable = false,
}: CustomerTypeModalProps) {
  const { isDarkMode } = useDarkMode();
  const styles = _styles(isDarkMode);

  const [rendered, setRendered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customerTypes, setCustomerTypes] = useState<CustomerTypeOption[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mount modal when visible
  useEffect(() => {
    if (visible) {
      setRendered(true);
      fetchCustomerTypes();
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

  const slideDownAndClose = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 320,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setRendered(false);
        if (callback) callback();
      }
    });
  };

  const fetchCustomerTypes = async () => {
    try {
      setLoading(true);
      const request = new EnvironmentRequest().getRequest();
      const res = await request.get('general/customer_types');
      setLoading(false);

      if (res?.data?.status === true && Array.isArray(res?.data?.data)) {
        setCustomerTypes(res.data.data);
      } else if (Array.isArray(res?.data)) {
        setCustomerTypes(res.data);
      }
    } catch (e) {
      setLoading(false);
      Toasts('Failed to load store business types');
    }
  };

  const handleSave = async () => {
    if (!selectedId || submitting) return;
    try {
      setSubmitting(true);
      const request =  new Request();
      const res = await request.post('update-customer-type', {
        customer_type_id: selectedId,
      });
      setSubmitting(false);

      if (res?.data?.status === true || res?.status === 200) {
        if (res?.data?.data) {
          await new AuthSessionService().setAuthSession(res.data);
        }
        Toasts('Operation was successful!');
        slideDownAndClose(onSuccess);
      } else {
        Toasts(res?.data?.message || 'Failed to update store type');
      }
    } catch (e) {
      setSubmitting(false);
      Toasts('An error occurred while updating store type');
    }
  };

  const handleClose = () => {
    if (dismissable && onClose) {
      slideDownAndClose(onClose);
    }
  };

  if (!rendered) return null;

  return (
    <Modal visible={rendered} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
        />
        <Animated.View style={[styles.cardContainer, { transform: [{ translateY: slideAnim }] }]}>
          {/* Header Banner */}
          <View style={styles.bannerHeader}>
            <View style={styles.iconCircle}>
              <Typography style={{ fontSize: normalize(32) }}>🏪</Typography>
            </View>

            {dismissable && onClose && (
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <Icon icon={closeIcon} height={normalize(20)} tintColor="#94A3B8" />
              </TouchableOpacity>
            )}

            <Typography style={styles.bannerTitle}>What type of business or facility do you operate?</Typography>
            <Typography style={styles.bannerSubtitle}>
              Help us personalize your wholesale catalog and verify eligibility for pharmacy & healthcare products.
            </Typography>
          </View>

          {/* Body Options */}
          <View style={styles.bodyContent}>
            {loading ? (
              <View style={styles.loaderWrap}>
                <ActivityIndicator size="large" color="#D50000" />
                <Typography style={styles.loaderText}>Loading business type options...</Typography>
              </View>
            ) : customerTypes.length === 0 ? (
              <View style={styles.loaderWrap}>
                <Typography style={styles.loaderText}>No options available</Typography>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: normalize(260) }}
                contentContainerStyle={styles.scrollList}
              >
                {customerTypes.map((type) => {
                  const isSelected = selectedId === type.id;
                  const emoji = getStoreEmoji(type.name);

                  return (
                    <TouchableOpacity
                      key={type.id}
                      activeOpacity={0.8}
                      onPress={() => setSelectedId(type.id)}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                    >
                      <View style={styles.optionLeft}>
                        <View style={[styles.emojiWrap, isSelected && styles.emojiWrapSelected]}>
                          <Typography style={{ fontSize: normalize(18) }}>{emoji}</Typography>
                        </View>
                        <Typography
                          style={[
                            styles.optionName,
                            isSelected && styles.optionNameSelected,
                          ]}
                        >
                          {type.name}
                        </Typography>
                      </View>

                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Submit Action */}
          <View style={styles.footerWrap}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!selectedId || submitting}
              onPress={handleSave}
              style={[
                styles.saveBtn,
                (!selectedId || submitting) && styles.saveBtnDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Typography style={styles.saveBtnText}>
                  {selectedId ? 'Confirm & Save Business Type' : 'Select a Business Type'}
                </Typography>
              )}
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
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
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
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      borderWidth: 1,
      borderColor: isDarkMode ? '#1E293B' : '#E2E8F0',
    },
    bannerHeader: {
      backgroundColor: isDarkMode ? '#1E293B' : '#FFF5F5',
      paddingHorizontal: normalize(24),
      paddingTop: normalize(24),
      paddingBottom: normalize(16),
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#334155' : '#FEE2E2',
    },
    iconCircle: {
      width: normalize(64),
      height: normalize(64),
      borderRadius: normalize(32),
      backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: normalize(12),
      elevation: 4,
      shadowColor: '#D50000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      borderWidth: 2,
      borderColor: '#D50000',
    },
    closeBtn: {
      position: 'absolute',
      top: normalize(16),
      right: normalize(16),
      padding: normalize(6),
    },
    bannerTitle: {
      fontSize: normalize(18),
      fontFamily: FONT.EXTRA_BOLD,
      color: isDarkMode ? '#F8FAFC' : '#0F172A',
      textAlign: 'center',
      marginBottom: normalize(6),
    },
    bannerSubtitle: {
      fontSize: normalize(12),
      fontFamily: FONT.NORMAL,
      color: isDarkMode ? '#94A3B8' : '#64748B',
      textAlign: 'center',
      lineHeight: normalize(16),
    },
    bodyContent: {
      paddingHorizontal: normalize(16),
      paddingTop: normalize(16),
    },
    loaderWrap: {
      paddingVertical: normalize(40),
      alignItems: 'center',
      justifyContent: 'center',
    },
    loaderText: {
      marginTop: normalize(12),
      fontSize: normalize(13),
      fontFamily: FONT.MEDIUM,
      color: isDarkMode ? '#94A3B8' : '#64748B',
    },
    scrollList: {
      paddingVertical: normalize(4),
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
      paddingHorizontal: normalize(14),
      paddingVertical: normalize(12),
      borderRadius: normalize(14),
      marginBottom: normalize(10),
      borderWidth: 1.5,
      borderColor: isDarkMode ? '#334155' : '#E2E8F0',
    },
    optionCardSelected: {
      backgroundColor: isDarkMode ? 'rgba(213, 0, 0, 0.12)' : '#FFF5F5',
      borderColor: '#D50000',
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    emojiWrap: {
      width: normalize(36),
      height: normalize(36),
      borderRadius: normalize(10),
      backgroundColor: isDarkMode ? '#0F172A' : '#E2E8F0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: normalize(12),
    },
    emojiWrapSelected: {
      backgroundColor: isDarkMode ? '#D50000' : '#FEE2E2',
    },
    optionName: {
      fontSize: normalize(14),
      fontFamily: FONT.BOLD,
      color: isDarkMode ? '#E2E8F0' : '#1E293B',
      flex: 1,
    },
    optionNameSelected: {
      color: '#D50000',
    },
    radioOuter: {
      width: normalize(20),
      height: normalize(20),
      borderRadius: normalize(10),
      borderWidth: 2,
      borderColor: isDarkMode ? '#64748B' : '#CBD5E1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioOuterSelected: {
      borderColor: '#D50000',
    },
    radioInner: {
      width: normalize(10),
      height: normalize(10),
      borderRadius: normalize(5),
      backgroundColor: '#D50000',
    },
    footerWrap: {
      padding: normalize(16),
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#1E293B' : '#F1F5F9',
    },
    saveBtn: {
      backgroundColor: '#D50000',
      paddingVertical: normalize(14),
      borderRadius: normalize(14),
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: '#D50000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    saveBtnDisabled: {
      backgroundColor: isDarkMode ? '#334155' : '#CBD5E1',
      elevation: 0,
      shadowOpacity: 0,
    },
    saveBtnText: {
      color: '#FFFFFF',
      fontSize: normalize(14),
      fontFamily: FONT.BOLD,
    },
  });
