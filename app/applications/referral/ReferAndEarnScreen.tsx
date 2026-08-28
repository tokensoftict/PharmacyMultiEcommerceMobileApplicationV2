import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { Button } from '@/shared/component/buttons';
import WrapperNoScroll from '@/shared/component/wrapperNoScroll';
import { palette, semantic } from '@/shared/constants/colors';
import { theme } from '@/shared/theme';
import { FONT } from '@/shared/constants/fonts';
import { normalize, wp } from '@/shared/helpers';
import { arrowBack, share_product, walletFilled, sale, qrcode, homeLike } from '@/assets/icons';
import ReferralApiService from '@/service/referral/ReferralApiService';
import Environment from '@/shared/utils/Environment';

interface ReferralStats {
  referral_code: string;
  referral_url: string;
  supermarket: {
    successful_referrals: number;
    pending_referrals: number;
    bonus_earned: number;
  };
  wholesales: {
    successful_referrals: number;
    pending_referrals: number;
    bonus_earned: number;
  };
}

const apiService = new ReferralApiService();

export default function ReferAndEarnScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyFlash, setCopyFlash] = useState(false);

  const isRetail = Environment.isSuperMarketEnvironment();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getMyReferrals();
      setStats(data);
    } catch (e) {
      // Silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats]),
  );

  const handleCopyCode = () => {
    if (!stats?.referral_code) return;
    Clipboard.setString(stats.referral_code);
    setCopyFlash(true);
    setTimeout(() => setCopyFlash(false), 1500);
  };

  const handleShare = async () => {
    if (!stats?.referral_code) return;
    await ReferralApiService.shareReferralLink(stats.referral_code);
  };

  // Show stats for the current store type
  const activeStats = isRetail ? stats?.supermarket : stats?.wholesales;
  const storeLabel   = isRetail ? 'Retail' : 'Wholesale';

  return (
    <WrapperNoScroll transparent edges={[]}>
      <View style={styles.container}>
        {/* Background gradient */}
        <LinearGradient
          colors={['#0F172A', '#1E293B', '#334155']}
          style={StyleSheet.absoluteFill}
        />

        {/* Decorative circles */}
        <View style={[styles.blob, { top: -wp(20), right: -wp(15) }]} />
        <View style={[styles.blob, { bottom: wp(10), left: -wp(20), opacity: 0.15 }]} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: Math.max(insets.top + theme.spacing.md, theme.spacing.xl),
              paddingBottom: Math.max(insets.bottom + theme.spacing.lg, theme.spacing.xl),
            },
          ]}
        >
          {/* Header */}
          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.canGoBack() && navigation.goBack()}
              style={styles.backBtn}
            >
              <Icon icon={arrowBack} customStyles={{ tintColor: '#FFFFFF', width: 22, height: 22 }} />
            </TouchableOpacity>
            <Typography style={styles.headerTitle}>Refer &amp; Earn</Typography>
            <View style={{ width: 22 }} />
          </Animated.View>

          {/* Hero banner */}
          <Animated.View entering={FadeInDown.delay(100).duration(700)} style={styles.heroBanner}>
            <LinearGradient
              colors={[palette.main.p500, palette.main.p500 + 'CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroIconRow}>
                <View style={styles.heroIconWrap}>
                  <Icon icon={homeLike} customStyles={{ width: 32, height: 32, tintColor: '#fff' }} />
                </View>
                <View style={[styles.heroIconWrap, { backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 10 }]}>
                  <Icon icon={arrowBack} customStyles={{ width: 20, height: 20, tintColor: '#fff', transform: [{ rotate: '180deg' }] }} />
                </View>
                <View style={styles.heroIconWrap}>
                  <Icon icon={walletFilled} customStyles={{ width: 32, height: 32, tintColor: '#fff' }} />
                </View>
              </View>
              <Typography style={styles.heroTitle}>
                Invite friends. Earn {storeLabel} Rewards.
              </Typography>
              <Typography style={styles.heroSub}>
                {isRetail
                  ? 'Share your unique referral code and earn loyalty points when your friend verifies their phone number after signing up.'
                  : 'Share your referral link with a pharmacy or business. You earn Wholesale loyalty points once their store account is approved by our team.'}
              </Typography>
            </LinearGradient>
          </Animated.View>

          {/* Referral code card */}
          <Animated.View entering={FadeInDown.delay(200).duration(700)} style={styles.codeCard}>
            <Typography style={styles.codeLabel}>YOUR REFERRAL CODE</Typography>

            {loading && !stats ? (
              <ActivityIndicator color={palette.main.p500} style={{ marginVertical: 16 }} />
            ) : (
              <>
                <View style={styles.codeBox}>
                  <Typography style={styles.codeText}>
                    {stats?.referral_code ?? '—————'}
                  </Typography>
                </View>

                <Typography style={styles.urlLabel}>
                  {stats?.referral_url ?? ''}
                </Typography>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, copyFlash && styles.actionBtnFlash]}
                    onPress={handleCopyCode}
                    activeOpacity={0.8}
                  >
                    <Icon icon={qrcode} customStyles={{ width: 18, height: 18, tintColor: copyFlash ? '#fff' : palette.main.p500 }} />
                    <Typography style={[styles.actionBtnText, copyFlash && { color: '#fff' }]}>
                      {copyFlash ? 'Copied!' : 'Copy Code'}
                    </Typography>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnPrimary]}
                    onPress={handleShare}
                    activeOpacity={0.8}
                  >
                    <Icon icon={share_product} customStyles={{ width: 18, height: 18, tintColor: '#fff' }} />
                    <Typography style={[styles.actionBtnText, { color: '#fff' }]}>
                      Share Link
                    </Typography>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>

          {/* Stats cards */}
          <Animated.View entering={FadeInDown.delay(300).duration(700)}>
            <Typography style={styles.sectionTitle}>YOUR {storeLabel.toUpperCase()} STATS</Typography>
            <View style={styles.statsRow}>
              <StatCard
                icon={homeLike}
                label="Successful"
                value={String(activeStats?.successful_referrals ?? 0)}
                color="#22C55E"
              />
              <StatCard
                icon={sale}
                label="Pending"
                value={String(activeStats?.pending_referrals ?? 0)}
                color="#F59E0B"
              />
              <StatCard
                icon={walletFilled}
                label="Bonus Earned"
                value={String(activeStats?.bonus_earned?.toFixed(0) ?? 0)}
                unit="pts"
                color={palette.main.p500}
              />
            </View>
          </Animated.View>

          {/* How it works */}
          <Animated.View entering={FadeInDown.delay(400).duration(700)} style={styles.howCard}>
            <Typography style={styles.sectionTitle}>HOW IT WORKS</Typography>
            <StepRow step="1" label="Share your referral link with a friend" />
            <StepRow step="2" label="Friend installs the app and signs up" />
            {isRetail ? (
              <>
                <StepRow step="3" label="Friend verifies their phone number" />
                <StepRow step="4" label="You earn Retail loyalty points!" />
              </>
            ) : (
              <>
                <StepRow step="3" label="Friend verifies their phone number" />
                <StepRow step="4" label="Friend's store account is reviewed and approved by our team" />
                <StepRow step="5" label="You earn Wholesale loyalty points after approval!" />
              </>
            )}
          </Animated.View>
        </ScrollView>
      </View>
    </WrapperNoScroll>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  unit?: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '22' }]}>
        <Icon icon={icon} customStyles={{ width: 20, height: 20, tintColor: color }} />
      </View>
      <View style={styles.statValueRow}>
        <Typography style={[styles.statValue, { color }]}>{value}</Typography>
        {unit ? (
          <Typography style={[styles.statUnit, { color }]}> {unit}</Typography>
        ) : null}
      </View>
      <Typography style={styles.statLabel}>{label}</Typography>
    </View>
  );
}

function StepRow({ step, label }: { step: string; label: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepBadge}>
        <Typography style={styles.stepNum}>{step}</Typography>
      </View>
      <Typography style={styles.stepLabel}>{label}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob: {
    position: 'absolute',
    width: wp(70),
    height: wp(70),
    borderRadius: wp(35),
    backgroundColor: palette.main.p500,
    opacity: 0.08,
  },
  scroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.lg,
    fontFamily: FONT.BOLD,
    color: '#FFFFFF',
  },
  // ── Hero banner ──────────────────────────────────────────────────────────
  heroBanner: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  heroGradient: {
    padding: theme.spacing.lg,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.typography.xl,
    fontFamily: FONT.EXTRA_BOLD,
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  heroSub: {
    fontSize: theme.typography.sm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  // ── Code card ────────────────────────────────────────────────────────────
  codeCard: {
    backgroundColor: '#1E293B',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  codeLabel: {
    fontSize: normalize(11),
    fontFamily: FONT.BOLD,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  codeBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: normalize(28),
    fontFamily: FONT.EXTRA_BOLD,
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  urlLabel: {
    fontSize: normalize(11),
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  btnRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: palette.main.p500,
    gap: 6,
  },
  actionBtnFlash: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  actionBtnPrimary: {
    backgroundColor: palette.main.p500,
    borderColor: palette.main.p500,
  },
  actionBtnText: {
    fontSize: normalize(13),
    fontFamily: FONT.BOLD,
    color: palette.main.p500,
  },
  // ── Stats ────────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: normalize(11),
    fontFamily: FONT.BOLD,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  statValue: {
    fontSize: normalize(18),
    fontFamily: FONT.EXTRA_BOLD,
  },
  statUnit: {
    fontSize: normalize(11),
    fontFamily: FONT.BOLD,
    opacity: 0.85,
  },
  statLabel: {
    fontSize: normalize(10),
    fontFamily: FONT.BOLD,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  // ── How it works ─────────────────────────────────────────────────────────
  howCard: {
    backgroundColor: '#1E293B',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.main.p500,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  stepNum: {
    fontSize: normalize(12),
    fontFamily: FONT.EXTRA_BOLD,
    color: '#fff',
  },
  stepLabel: {
    fontSize: normalize(13),
    fontFamily: FONT.NORMAL,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
});
