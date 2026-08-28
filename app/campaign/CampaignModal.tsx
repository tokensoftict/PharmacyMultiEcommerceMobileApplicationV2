// app/campaign/CampaignModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Typography from '@/shared/component/typography';
import { normalize } from '@/shared/helpers';
import { CampaignPayload } from './CampaignTypes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CampaignModalProps {
  campaign: CampaignPayload | null;
  visible: boolean;
  onPressCta: () => void;
  onDismiss: () => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
  campaign,
  visible,
  onPressCta,
  onDismiss,
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT * 0.4)).current;

  useEffect(() => {
    if (visible) {
      setImageLoading(true);
      if (campaign?.display_type === 'bottom_sheet') {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 320,
            easing: Easing.out(Easing.back(1)),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
      slideAnim.setValue(SCREEN_HEIGHT * 0.4);
    }
  }, [visible, campaign]);

  if (!visible || !campaign) return null;

  const isBottomSheet = campaign.display_type === 'bottom_sheet';
  const isFullscreen = campaign.display_type === 'fullscreen';

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT * 0.4, duration: 200, useNativeDriver: true }),
    ]).start(() => onDismiss());
  };

  const handleCta = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 200, useNativeDriver: true }),
    ]).start(() => onPressCta());
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleClose}
          />
        </Animated.View>

        {isBottomSheet ? (
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              { transform: [{ translateY: slideAnim }], opacity: opacityAnim },
            ]}
          >
            <View style={styles.dragHandle} />
            {renderContent(campaign, imageLoading, setImageLoading, handleCta, handleClose)}
          </Animated.View>
        ) : isFullscreen ? (
          <SafeAreaView style={styles.fullscreenContainer}>
            <Animated.View style={[styles.fullscreenContent, { opacity: opacityAnim }]}>
              {renderContent(campaign, imageLoading, setImageLoading, handleCta, handleClose, true)}
            </Animated.View>
          </SafeAreaView>
        ) : (
          <Animated.View
            style={[
              styles.modalCard,
              { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
            ]}
          >
            {renderContent(campaign, imageLoading, setImageLoading, handleCta, handleClose)}
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const renderContent = (
  campaign: CampaignPayload,
  imageLoading: boolean,
  setImageLoading: (val: boolean) => void,
  onPressCta: () => void,
  onClose: () => void,
  isFullscreen: boolean = false
) => {
  return (
    <View style={styles.contentInner}>
      {/* Close button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={onClose}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Typography style={{ fontSize: normalize(16), color: '#666666', fontWeight: 'bold' }}>
          ✕
        </Typography>
      </TouchableOpacity>

      {/* Campaign Image */}
      {campaign.image ? (
        <View style={styles.imageWrapper}>
          {imageLoading && (
            <View style={styles.imageLoader}>
              <ActivityIndicator size="small" color="#004481" />
            </View>
          )}
          <Image
            source={{ uri: campaign.image }}
            style={[styles.image, isFullscreen && styles.fullscreenImage]}
            resizeMode="cover"
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
      ) : null}

      {/* Body text container */}
      <View style={styles.textContainer}>
        {campaign.title ? (
          <Typography
            style={[
              styles.titleText,
              { fontSize: normalize(18), fontWeight: 'bold', color: '#111827', textAlign: 'center' },
            ]}
          >
            {campaign.title}
          </Typography>
        ) : null}

        {campaign.message ? (
          <Typography
            style={[
              styles.messageText,
              { fontSize: normalize(14), color: '#4B5563', textAlign: 'center' },
            ]}
          >
            {campaign.message}
          </Typography>
        ) : null}
      </View>

      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        {campaign.cta_text ? (
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={onPressCta}
          >
            <Typography
              style={{ fontSize: normalize(15), fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' }}
            >
              {campaign.cta_text}
            </Typography>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.dismissButton} onPress={onClose}>
          <Typography
            style={{ fontSize: normalize(13), color: '#9CA3AF', textAlign: 'center' }}
          >
            Maybe later
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalCard: {
    width: SCREEN_WIDTH * 0.88,
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  fullscreenContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: '#FFFFFF',
  },
  fullscreenContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentInner: {
    padding: 20,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  imageLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fullscreenImage: {
    height: SCREEN_HEIGHT * 0.4,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    marginBottom: 8,
    lineHeight: 24,
  },
  messageText: {
    lineHeight: 20,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#004481',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#004481',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dismissButton: {
    paddingVertical: 6,
  },
});
