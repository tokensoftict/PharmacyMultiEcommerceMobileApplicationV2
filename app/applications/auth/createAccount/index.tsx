import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Input from '@/shared/component/input';
import Icon from '@/shared/component/icon';
import { eyeFilled, eyeOff, lock, mail, phone, user } from '@/assets/icons';
import { Button } from '@/shared/component/buttons';
import Typography from '@/shared/component/typography';
import { logo } from '@/assets/images';
import ErrorText from '@/shared/component/ErrorText';
import SignUpService from '@/service/auth/SignUpService.tsx';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack';
import WrapperNoScroll from '@/shared/component/wrapperNoScroll';
import AuthSessionService from '@/service/auth/AuthSessionService.tsx';
import Toasts from '@/shared/utils/Toast.tsx';
import { palette } from '@/shared/constants/colors.ts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/shared/theme';
import { FONT } from '@/shared/constants/fonts';
import { isTablet, wp } from '@/shared/helpers';
import ReferralStorage from '@/service/referral/ReferralStorage';

/**
 * Create Account Screen
 *
 * RESPONSIVENESS ISSUES FIXED:
 * 1. Removed module-level `const { width } = Dimensions.get('window')` —
 *    it was captured once and never updated.
 * 2. Platform.OS fontWeight hack removed → FONT.EXTRA_BOLD used instead.
 * 3. paddingTop: normalize(48) — was too large on small phones (iPhone SE).
 *    Now uses Math.max(insets.top, theme.spacing.xl) for safe adaptive top spacing.
 * 4. Decorative blobs now use wp() (screen-width percentages).
 * 5. Card is max-width constrained and centered on tablets.
 * 6. All spacing from theme.spacing tokens.
 */
export default function CreateAccount() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();
  const tablet = isTablet();

  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [messageError, setMessageError] = useState('');

  // Referral code loaded from ReferralStorage (set by DetourService on link resolution)
  const [pendingReferralCode, setPendingReferralCode] = useState<string | null>(null);

  const signUpService = new SignUpService();

  // Read any pending referral code when the screen mounts
  useEffect(() => {
    ReferralStorage.get().then(code => {
      if (code) setPendingReferralCode(code);
    });
  }, []);

  function goBackToSignIn() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  function doRegister() {
    let validationStatus = false;

    if (firstname === '') { setFirstNameError('First Name field is required'); validationStatus = true; }
    if (lastname === '') { setLastNameError('Last Name field is required'); validationStatus = true; }
    if (password === '') { setPasswordError('Password field is required'); validationStatus = true; }
    if (phoneNumber === '') { setPhoneNumberError('Phone Number field is required'); validationStatus = true; }
    if (email === '') { setEmailError('Email Address field is required'); validationStatus = true; }

    if (!validationStatus) {
      setIsLoading(true);
      setEmailError('');
      setPasswordError('');
      setPhoneNumberError('');
      setFirstNameError('');
      setLastNameError('');

      signUpService
        .signUp(firstname, lastname, email, password, phoneNumber, pendingReferralCode ?? undefined)
        .then(
          function (response: any) {
            setIsLoading(false);
            if (response.status === false) {
              if (response.hasOwnProperty('email') && response.email !== false) { setEmailError(response.email); }
              if (response.hasOwnProperty('firstname') && response.firstname !== false) { setFirstNameError(response.firstname); }
              if (response.hasOwnProperty('lastname') && response.lastname !== false) { setLastNameError(response.lastname); }
              if (response.hasOwnProperty('phone') && response.phone !== false) { setPhoneNumberError(response.phone); }
              if (response.hasOwnProperty('password') && response.password !== false) { setPasswordError(response.password); }
              if (response.hasOwnProperty('message') && response.message !== false) { setMessageError(response.message); }
            } else {
              // Clear the pending referral code — it has been submitted successfully
              ReferralStorage.clear();

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
                    // @ts-ignore
                    navigation.navigate('enterEmailOTP', { otp: false });
                  } else {
                    Toasts('Please verify your phone number to continue!');
                    // @ts-ignore
                    navigation.navigate('enterOTP', { otp: false });
                  }
                } else {
                  Toasts('Account created successfully!');
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

        {/* Decorative blobs — wp() so they scale on any screen */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(1000)}
          style={[styles.blob, { top: -wp(13), left: -wp(8), backgroundColor: '#F0FDF4' }]}
        />
        <Animated.View
          entering={FadeInDown.delay(300).duration(1000)}
          style={[
            styles.blob,
            {
              bottom: wp(13),
              right: -wp(16),
              backgroundColor: '#EFF6FF',
              width: wp(53),
              height: wp(53),
            },
          ]}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + theme.spacing.md, theme.spacing.xl),
              paddingBottom: Math.max(insets.bottom + theme.spacing.md, theme.spacing.xl),
            },
          ]}
        >
          {/* ---- Header ---- */}
          <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
            <View style={[styles.logoContainer, tablet && styles.logoContainerTablet]}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>
            <Typography style={styles.title}>Create Account</Typography>
            <Typography style={styles.subText}>Fill in your information to join us</Typography>
          </Animated.View>

          {/* ---- Form card ---- */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(800)}
            style={[styles.card, tablet && styles.cardTablet]}
          >
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Input leftIcon={<Icon icon={user} />} label="First Name" value={firstname} onChangeText={setFirstName} placeholder="John" />
                {firstNameError !== '' && <ErrorText>{firstNameError}</ErrorText>}
              </View>
              <View style={styles.inputGroup}>
                <Input leftIcon={<Icon icon={user} />} label="Last Name" value={lastname} onChangeText={setLastName} placeholder="Doe" />
                {lastNameError !== '' && <ErrorText>{lastNameError}</ErrorText>}
              </View>
              <View style={styles.inputGroup}>
                <Input leftIcon={<Icon icon={phone} />} label="Phone Number" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="0801 234 5678" />
                {phoneNumberError !== '' && <ErrorText>{phoneNumberError}</ErrorText>}
              </View>
              <View style={styles.inputGroup}>
                <Input leftIcon={<Icon icon={mail} />} label="Email Address" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="john@example.com" />
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

              {messageError !== '' && (
                <View style={styles.errorBanner}>
                  <ErrorText textAlign="center">{messageError}</ErrorText>
                </View>
              )}

              <Button
                title="Create Account"
                loading={isLoading}
                disabled={isLoading}
                onPress={doRegister}
                loadingText="Creating Account..."
              />
            </View>
          </Animated.View>

          {/* ---- Footer link ---- */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(800)}
            style={styles.footer}
          >
            <Typography style={styles.footerLabel}>Already have an account?</Typography>
            <TouchableOpacity onPress={goBackToSignIn} style={styles.signInTouchable}>
              <Typography style={styles.signInText}> Sign In</Typography>
            </TouchableOpacity>
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
  blob: {
    position: 'absolute',
    width: wp(66),
    height: wp(66),
    borderRadius: wp(33),
    opacity: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    width: wp(24),
    height: wp(14),
    marginBottom: theme.spacing.md,
  },
  logoContainerTablet: {
    width: wp(14),
    height: wp(8),
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: theme.typography.display,
    fontFamily: FONT.EXTRA_BOLD,
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
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xl,
  },
  footerLabel: {
    fontSize: theme.typography.md,
    color: '#64748B',
  },
  signInTouchable: {
    minHeight: theme.MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  signInText: {
    fontSize: theme.typography.md,
    fontFamily: FONT.BOLD,
    color: palette.main.p500,
  },
});
