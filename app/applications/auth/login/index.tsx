import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Input from '@/shared/component/input';
import Icon from '@/shared/component/icon';
import { eyeFilled, eyeOff, lock, mail } from '@/assets/icons';
import { Button } from '@/shared/component/buttons';
import Typography from '@/shared/component/typography';
import LoginService from '@/service/auth/LoginService.tsx';
import { logo } from '@/assets/images';
import ErrorText from '@/shared/component/ErrorText';
import AuthSessionService from '@/service/auth/AuthSessionService.tsx';
import Toasts from '@/shared/utils/Toast.tsx';
import { CommonActions } from '@react-navigation/native';
import WrapperNoScroll from '@/shared/component/wrapperNoScroll';
import { palette } from '@/shared/constants/colors.ts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/shared/theme';
import { FONT } from '@/shared/constants/fonts';
import { isTablet, wp } from '@/shared/helpers';

/**
 * Login Screen
 *
 * RESPONSIVENESS ISSUES FIXED:
 * 1. Removed module-level Dimensions.get('window') — was captured once at
 *    import time and would not update on orientation change or foldable unfold.
 * 2. Replaced Platform.OS === 'ios' ? '800' : undefined fontWeight pattern
 *    with proper FONT.EXTRA_BOLD / FONT.SEMI_BOLD font family references.
 * 3. normalize(28) heading — replaced with theme.typography.display (26dp,
 *    moderateScale), which scales appropriately across small phones to tablets.
 * 4. All spacing now from theme.spacing tokens (no raw magic numbers).
 * 5. Tablet: content is max-width constrained and centered via alignSelf.
 * 6. Logo container uses wp() for proportional sizing instead of fixed px.
 */
export default function Login({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const tablet = isTablet();

  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [messageError, setMessageError] = useState('');

  const loginService = new LoginService();

  function signUp() {
    navigation.navigate('createAccount');
  }

  function forgotPassword() {
    navigation.navigate('forgotPassword');
  }

  function doLogin() {
    if (email === '') {
      setEmailError('Email Address is required');
    } else if (password === '') {
      setPasswordError('Password field is required');
    } else {
      setIsLoading(true);
      setEmailError('');
      setPasswordError('');
      setMessageError('');
      loginService.login(email, password).then(
        async function (response: any) {
          setIsLoading(false);
          if (response.status === false) {
            setPassword('');
            if (response.hasOwnProperty('email') && response.email !== false) {
              setEmailError(response.email);
            }
            if (response.hasOwnProperty('password') && response.password !== false) {
              setPasswordError(response.password);
            }
            if (response.hasOwnProperty('message') && response.message !== false) {
              setMessageError(response.message);
            }
          } else {
            if (response.hasOwnProperty('trashed') && response.trashed) {
              CommonActions.reset({ index: 0, routes: [{ name: 'restoreMyAccount' }] });
              navigation.navigate('restoreMyAccount');
            } else {
              const userProfile = new AuthSessionService().getAuthSession();
              const userData = userProfile?.data;
              const systemSettings = (userData as any)?.systemSettings;
              const authKey = systemSettings?.verifyField ?? 'phone_verified_status';

              if (userData && userData[authKey] === false) {
                if (systemSettings?.mustVerify === 'email') {
                  Toasts('Please verify your email address to continue!');
                  navigation.navigate('enterEmailOTP', { otp: true });
                } else {
                  Toasts('Please verify your phone number to continue!');
                  navigation.navigate('enterOTP', { otp: true });
                }
              } else {
                Toasts('Login successful, please wait..');
                setTimeout(() => {
                  if (userData?.apps && userData.apps.length === 1) {
                    navigation.replace('supermarket');
                  } else {
                    navigation.replace('storeSelector');
                  }
                }, 1000);
              }
            }
          }
        },
        function (error) {
          setIsLoading(false);
          if (error.hasOwnProperty('message') && error.message !== false) {
            setMessageError(error.message);
          }
        },
      );
    }
  }

  return (
    <WrapperNoScroll transparent={true} edges={[]}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#f8fafc', '#f1f5f9', '#e2e8f0']}
          style={StyleSheet.absoluteFill}
        />

        {/* Decorative background blobs — use % sizing so they scale with screen */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(1000)}
          style={[styles.blob, { top: -wp(13), right: -wp(8), backgroundColor: '#E0E7FF' }]}
        />
        <Animated.View
          entering={FadeInDown.delay(300).duration(1000)}
          style={[
            styles.blob,
            {
              bottom: wp(25),
              left: -wp(16),
              backgroundColor: '#F0F9FF',
              width: wp(53),
              height: wp(53),
            },
          ]}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: Math.max(insets.bottom + theme.spacing.md, theme.spacing.xl),
              paddingTop: Math.max(insets.top + theme.spacing.lg, theme.spacing.xl),
            },
          ]}
        >
          {/* ---- Logo & heading ---- */}
          <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
            <View style={[styles.logoContainer, tablet && styles.logoContainerTablet]}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>
            <Typography style={styles.welcomeText}>Welcome back</Typography>
            <Typography style={styles.subText}>Please enter your details to sign in</Typography>
          </Animated.View>

          {/* ---- Form card ---- */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(800)}
            style={[styles.card, tablet && styles.cardTablet]}
          >
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Input
                  leftIcon={<Icon icon={mail} />}
                  label="Email or Phone"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                />
                {emailError !== '' && <ErrorText>{emailError}</ErrorText>}
              </View>

              <View style={styles.inputGroup}>
                <Input
                  leftIcon={<Icon icon={lock} />}
                  rightIcon={
                    isPasswordShown
                      ? <Icon onPress={() => setIsPasswordShown(false)} icon={eyeOff} />
                      : <Icon onPress={() => setIsPasswordShown(true)} icon={eyeFilled} />
                  }
                  secureTextEntry={isPasswordShown}
                  value={password}
                  onChangeText={setPassword}
                  label="Password"
                  placeholder="••••••••"
                />
                {passwordError !== '' && <ErrorText>{passwordError}</ErrorText>}
              </View>

              <TouchableOpacity onPress={forgotPassword} style={styles.forgotBtn}>
                <Typography style={styles.forgotText}>Forgot Password?</Typography>
              </TouchableOpacity>

              {messageError !== '' && (
                <View style={styles.errorBanner}>
                  <ErrorText textAlign="center">{messageError}</ErrorText>
                </View>
              )}

              <Button
                loading={isLoading}
                disabled={isLoading}
                onPress={doLogin}
                loadingText="Signing In..."
                title="Sign In"
              />
            </View>
          </Animated.View>

          {/* ---- Bottom actions ---- */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(800)}
            style={styles.bottomActions}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('loginWithOutPassword')}
              style={styles.passwordlessLink}
            >
              <Typography style={styles.passwordlessText}>
                Sign in with One-Time Code
              </Typography>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Typography style={styles.footerLabel}>Don't have an account?</Typography>
              <TouchableOpacity onPress={signUp}>
                <Typography style={styles.signUpText}> Sign Up</Typography>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </WrapperNoScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  /**
   * Decorative background circles use wp() so they scale
   * with screen width on any device size.
   */
  blob: {
    position: 'absolute',
    width: wp(66),  // ~66% of screen width
    height: wp(66),
    borderRadius: wp(33),
    opacity: 0.6,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    width: wp(26),       // 26% of screen width — scales on all devices
    height: wp(16),
    marginBottom: theme.spacing.md,
  },
  logoContainerTablet: {
    width: wp(15),       // Proportionally smaller on tablet (more screen real estate)
    height: wp(9),
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: theme.typography.display,  // 26dp, moderateScale — not too big on small phones
    fontFamily: FONT.EXTRA_BOLD,         // Correct cross-platform bold — no fontWeight hack
    color: '#0F172A',
    textAlign: 'center',
  },
  subText: {
    fontSize: theme.typography.md,
    color: '#64748B',
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  cardTablet: {
    // On tablets: constrain the card width and center it
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
    minHeight: theme.MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  forgotText: {
    fontSize: theme.typography.body,
    fontFamily: FONT.SEMI_BOLD,
    color: palette.main.p500,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  bottomActions: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  passwordlessLink: {
    marginBottom: theme.spacing.xxl,
    minHeight: theme.MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  passwordlessText: {
    fontSize: theme.typography.md,
    fontFamily: FONT.SEMI_BOLD,
    color: '#0284C7',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerLabel: {
    fontSize: theme.typography.md,
    color: '#64748B',
  },
  signUpText: {
    fontSize: theme.typography.md,
    fontFamily: FONT.BOLD,
    color: palette.main.p500,
  },
});
