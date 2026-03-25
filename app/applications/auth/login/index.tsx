import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp, withDelay, withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import TitleAuth from "@/shared/component/titleAuth";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { eyeFilled, eyeOff, lock, mail } from "@/assets/icons";
import { Button } from "@/shared/component/buttons";
import Typography from "@/shared/component/typography";
import LoginService from "@/service/auth/LoginService.tsx";
import { normalize } from "@/shared/helpers";
import { logo } from "@/assets/images";
import ErrorText from "@/shared/component/ErrorText";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import { CommonActions } from "@react-navigation/native";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import { palette } from "@/shared/constants/colors.ts";

const { width, height } = Dimensions.get('window');

export default function Login({ navigation }: any) {
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
      setEmailError("");
      setPasswordError("");
      setMessageError("");
      loginService.login(email, password).then(async function (response: any) {
        setIsLoading(false);
        if (response.status === false) {
          setPassword("");
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
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'restoreMyAccount' }],
            });
            navigation.navigate('restoreMyAccount');
          } else {
            const userProfile = new AuthSessionService().getAuthSession();
            const userData = userProfile?.data;
            const systemSettings = (userData as any)?.systemSettings;
            const authKey = systemSettings?.verifyField ?? 'phone_verified_status';
            
            if (userData && userData[authKey] === false) {
              if (systemSettings?.mustVerify === "email") {
                Toasts("Please verify your email address to continue!");
                navigation.navigate('enterEmailOTP', { otp: true });
              } else {
                Toasts("Please verify your phone number to continue!");
                navigation.navigate('enterOTP', { otp: true });
              }
            } else {
              Toasts('Login successful, please wait..');
              setTimeout(() => {
                if (userData?.apps && userData.apps.length === 1) {
                  navigation.replace("supermarket");
                } else {
                  navigation.replace("storeSelector");
                }
              }, 1000);
            }
          }
        }
      }, function (error) {
        setIsLoading(false);
        if (error.hasOwnProperty('message') && error.message !== false) {
          setMessageError(error.message);
        }
      });
    }
  }

  return (
    <WrapperNoScroll transparent={true} edges={[]}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#f8fafc', '#f1f5f9', '#e2e8f0']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Decorative Background Elements */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(1000)}
          style={[styles.circle, { top: -normalize(50), right: -normalize(30), backgroundColor: '#E0E7FF' }]} 
        />
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={[styles.circle, { bottom: normalize(100), left: -normalize(60), backgroundColor: '#F0F9FF', width: normalize(200), height: normalize(200) }]} 
        />

        <View style={styles.content}>
          <Animated.View 
            entering={FadeInUp.duration(800)}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
               <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>
            <Typography style={styles.welcomeText}>Welcome back</Typography>
            <Typography style={styles.subText}>Please enter your details to sign in</Typography>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200).duration(800)}
            style={styles.card}
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

          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            style={styles.bottomActions}
          >
            <TouchableOpacity
                onPress={() => navigation.navigate('loginWithOutPassword')}
                style={styles.passwordlessLink}
            >
                <Typography style={styles.passwordlessText}>Sign in with One-Time Code</Typography>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Typography style={styles.footerLabel}>Don't have an account?</Typography>
              <TouchableOpacity onPress={signUp}>
                <Typography style={styles.signUpText}>Sign Up</Typography>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </WrapperNoScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    position: 'absolute',
    width: normalize(250),
    height: normalize(250),
    borderRadius: normalize(125),
    opacity: 0.6,
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(24),
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: normalize(32),
  },
  logoContainer: {
    width: normalize(100),
    height: normalize(60),
    marginBottom: normalize(16),
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: normalize(28),
    fontWeight: Platform.OS === 'ios' ? '800' : undefined,
    color: '#0F172A',
    textAlign: 'center',
  },
  subText: {
    fontSize: normalize(15),
    color: '#64748B',
    marginTop: normalize(8),
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    padding: normalize(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: normalize(20),
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: normalize(24),
  },
  forgotText: {
    fontSize: normalize(14),
    color: palette.main.p500,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    padding: normalize(12),
    borderRadius: normalize(12),
    marginBottom: normalize(20),
  },
  bottomActions: {
    marginTop: normalize(32),
    alignItems: 'center',
  },
  passwordlessLink: {
    marginBottom: normalize(40),
  },
  passwordlessText: {
    fontSize: normalize(15),
    color: '#0284C7',
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: normalize(15),
    color: '#64748B',
  },
  signUpText: {
    fontSize: normalize(15),
    color: palette.main.p500,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    marginLeft: normalize(6),
  },
});
