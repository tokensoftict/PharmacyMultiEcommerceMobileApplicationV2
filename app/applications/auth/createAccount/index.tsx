import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import TitleAuth from "@/shared/component/titleAuth";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { eyeFilled, eyeOff, lock, mail, phone, user } from "@/assets/icons";
import { Button } from "@/shared/component/buttons";
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";
import { logo } from "@/assets/images";
import ErrorText from "@/shared/component/ErrorText";
import SignUpService from "@/service/auth/SignUpService.tsx";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import { palette } from "@/shared/constants/colors.ts";

const { width } = Dimensions.get('window');

export default function CreateAccount() {
  const navigation = useNavigation<NavigationProps>()

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

  const signUpService = new SignUpService();

  function goBackToSignIn() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  function doRegister() {
    let validationStatus = false;

    if (firstname === '') {
      setFirstNameError("First Name field is required");
      validationStatus = true;
    }
    if (lastname === '') {
      setLastNameError('Last Name field is required');
      validationStatus = true;
    }
    if (password === '') {
      setPasswordError('Password field is required');
      validationStatus = true;
    }
    if (phoneNumber === '') {
      setPhoneNumberError('Phone Number field is required');
      validationStatus = true;
    }
    if (email === '') {
      setEmailError("Email Address field is required");
      validationStatus = true;
    }

    if (!validationStatus) {
      setIsLoading(true)
      setEmailError('');
      setPasswordError('');
      setPhoneNumberError('');
      setFirstNameError('');
      setLastNameError('')
      signUpService.signUp(firstname, lastname, email, password, phoneNumber).then(function (response: any) {
        setIsLoading(false);

        if (response.status === false) {
          if (response.hasOwnProperty('email') && response.email !== false) {
            setEmailError(response.email);
          }
          if (response.hasOwnProperty('firstname') && response.firstname !== false) {
            setFirstNameError(response.firstname);
          }
          if (response.hasOwnProperty('lastname') && response.lastname !== false) {
            setLastNameError(response.lastname);
          }
          if (response.hasOwnProperty('phone') && response.phone !== false) {
            setPhoneNumberError(response.phone);
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
            })
            navigation.navigate('restoreMyAccount');
          } else {
            const userProfile = new AuthSessionService().getAuthSession();
            const userData = userProfile?.data;
            const systemSettings = (userData as any)?.systemSettings;
            const authKey = systemSettings?.verifyField ?? 'phone_verified_status';

            if (userData && userData[authKey] === false) {
              if (systemSettings?.mustVerify === "email") {
                Toasts("Please verify your email address to continue!");
                // @ts-ignore
                navigation.navigate('enterEmailOTP', { otp: false });
              } else {
                Toasts("Please verify your phone number to continue!");
                // @ts-ignore
                navigation.navigate('enterOTP', { otp: false });
              }
            } else {
              Toasts("Account created successfully!");
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
          style={[styles.circle, { top: -normalize(50), left: -normalize(30), backgroundColor: '#F0FDF4' }]} 
        />
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={[styles.circle, { bottom: normalize(50), right: -normalize(60), backgroundColor: '#EFF6FF', width: normalize(200), height: normalize(200) }]} 
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Animated.View 
              entering={FadeInUp.duration(800)}
              style={styles.header}
            >
              <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} resizeMode="contain" />
              </View>
              <Typography style={styles.title}>Create Account</Typography>
              <Typography style={styles.subText}>Fill in your information to join us</Typography>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(200).duration(800)}
              style={styles.card}
            >
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Input
                    leftIcon={<Icon icon={user} />}
                    label="First Name"
                    value={firstname}
                    onChangeText={setFirstName}
                    placeholder="John"
                  />
                  {firstNameError !== '' && <ErrorText>{firstNameError}</ErrorText>}
                </View>

                <View style={styles.inputGroup}>
                  <Input
                    leftIcon={<Icon icon={user} />}
                    label="Last Name"
                    value={lastname}
                    onChangeText={setLastName}
                    placeholder="Doe"
                  />
                  {lastNameError !== '' && <ErrorText>{lastNameError}</ErrorText>}
                </View>

                <View style={styles.inputGroup}>
                  <Input
                    leftIcon={<Icon icon={phone} />}
                    label="Phone Number"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="0801 234 5678"
                  />
                  {phoneNumberError !== '' && <ErrorText>{phoneNumberError}</ErrorText>}
                </View>

                <View style={styles.inputGroup}>
                  <Input
                    leftIcon={<Icon icon={mail} />}
                    label="Email Address"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="john@example.com"
                  />
                  {emailError !== '' && <ErrorText>{emailError}</ErrorText>}
                </View>

                <View style={styles.inputGroup}>
                  <Input
                    leftIcon={<Icon icon={lock} />}
                    rightIcon={
                      isPasswordShown ? <Icon onPress={() => setIsPasswordShown(false)} icon={eyeOff} /> : <Icon onPress={() => setIsPasswordShown(true)} icon={eyeFilled} />
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

            <Animated.View 
              entering={FadeInDown.delay(400).duration(800)}
              style={styles.footer}
            >
              <Typography style={styles.footerLabel}>Already have an account?</Typography>
              <TouchableOpacity onPress={goBackToSignIn}>
                <Typography style={styles.signInText}>Sign In</Typography>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </WrapperNoScroll>
  )
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
    opacity: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: normalize(24),
    paddingTop: normalize(48),
    paddingBottom: normalize(40),
  },
  header: {
    alignItems: 'center',
    marginBottom: normalize(32),
  },
  logoContainer: {
    width: normalize(90),
    height: normalize(50),
    marginBottom: normalize(16),
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: normalize(28),
    fontWeight: Platform.OS === 'ios' ? '800' : undefined,
    color: '#0F172A',
  },
  subText: {
    fontSize: normalize(15),
    color: '#64748B',
    marginTop: normalize(8),
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
    marginBottom: normalize(18),
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    padding: normalize(12),
    borderRadius: normalize(12),
    marginBottom: normalize(20),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(32),
  },
  footerLabel: {
    fontSize: normalize(15),
    color: '#64748B',
  },
  signInText: {
    fontSize: normalize(15),
    color: palette.main.p500,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    marginLeft: normalize(6),
  },
});
