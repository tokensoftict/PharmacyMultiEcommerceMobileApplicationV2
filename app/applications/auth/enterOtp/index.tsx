import React, { useEffect, useState } from "react";
import Wrapper from "@/shared/component/wrapper";
import { Image, View } from "react-native";
import Typography from "@/shared/component/typography";
import { OtpInput } from "react-native-otp-entry";
import { Button } from "@/shared/component/buttons";
import { styles } from './styles';
import TitleAuth from "@/shared/component/titleAuth";
import { normalize } from "@/shared/helpers";
import { logo } from "@/assets/images";
import AuthSessionService from "@/service/auth/AuthSessionService";
import ErrorText from "@/shared/component/ErrorText";
import OtpService from "@/service/auth/OtpService";
import Toasts from "@/shared/utils/Toast";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import { palette } from "@/shared/constants/colors.ts";

// @ts-ignore
export default function EnterOtp({ navigation, route }) {
    const [otpError, setOtpError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [countdown, setCountdown] = useState(120); // 2 mins = 120 secs

    const userProfile = (new AuthSessionService()).getAuthSession();

    useEffectOnce(() => {
        const requestForOTP = route.params?.otp ?? true;
        if (requestForOTP) {
            navigation.addListener("focus", function () {
                requestForOtp();
            });
        }
    }, []);

    // Countdown Timer Effect
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const formatCountdown = (secs: number) => {
        const minutes = Math.floor(secs / 60).toString().padStart(2, '0');
        const seconds = (secs % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const navigateAndClearStack = () => {
        const app = userProfile.data.apps;
        if (app.length === 1) {
            navigation.replace("supermarket");
        } else {
            navigation.replace("storeSelector");
        }
    };

    function doValidateOTP() {
        if (otpCode.length !== 4) {
            setOtpError("Please enter the complete otp code that was sent to your phone!");
        } else {
            setOtpError("");
            setIsLoading(true);
            setLoadingMessage("Validating OTP Code...");
            (new OtpService()).validateOTP(otpCode, userProfile.data.phone).then((response) => {
                setIsLoading(false);
                if (response.data.status === true) {
                    Toasts("Account verified successfully");
                    new AuthSessionService().completeSession();
                    navigateAndClearStack();
                } else {
                    const error = response.data.error;
                    if (error.otp) {
                        setOtpError(error.otp.join("\n"));
                    } else if (error.phone) {
                        setOtpError(error.phone.join("\n"));
                    }
                }
            }).catch(() => {
                setIsLoading(false);
            });
        }
    }

    function requestForOtp() {
        setIsLoading(true);
        (new OtpService()).requestForOtp(userProfile.data.phone).then((response) => {
            setIsLoading(false);
            if (response.data.status === true) {
                if(response.data.data.hasVerified === true) {
                    Toasts("Phone Number has already been verified!");
                    new AuthSessionService().completeSession();
                    navigateAndClearStack();
                } else {
                    Toasts("OTP has been sent to your phone.");
                    setCountdown(120); // restart countdown
                }
            } else {
                setOtpError(response.data.error);
            }
        }).catch(() => {
            setIsLoading(false);
        });
    }

    return (
        <Wrapper loading={isLoading} titleLoader={loadingMessage}>
            <View style={styles.container}>
                <View style={styles.titleImageContainer}>
                    <TitleAuth title="Enter OTP Code" />
                    <Image
                        style={{
                            width: normalize(100),
                            height: normalize(60),
                            marginTop: normalize(10)
                        }}
                        source={logo}
                    />
                </View>

                <View style={styles.containerEmail}>
                    <Typography>A 4-digit code has been sent to</Typography>
                    <Typography style={styles.textEmail}>{userProfile.data.phone}</Typography>
                </View>

                <View style={styles.form}>
                    <OtpInput
                        numberOfDigits={4}
                        focusColor={palette.main.p500}
                        autoFocus={false}
                        hideStick={true}
                        placeholder="****"
                        blurOnFilled={true}
                        disabled={false}
                        type="numeric"
                        secureTextEntry={false}
                        focusStickBlinkingDuration={500}
                        onFilled={(text) => setOtpCode(text)}
                        textInputProps={{
                            accessibilityLabel: "Enter OTP Code"
                        }}
                    />
                    <View style={{ height: normalize(10) }} />
                    {otpError !== '' && <ErrorText>{otpError}</ErrorText>}
                </View>

                {/* Countdown or Resend */}
                <View style={{ alignItems: 'center', marginTop: normalize(0) }}>
                    {countdown > 0 ? (
                        <Typography style={{ color: palette.main.p100 }}>
                            You can resend OTP in {formatCountdown(countdown)}
                        </Typography>
                    ) : (
                        <Typography
                            onPress={requestForOtp}
                            style={{ color: palette.main.p500 }}
                        >
                            Didn’t receive code? Resend OTP
                        </Typography>
                    )}
                </View>

                <View style={styles.containerBtns}>
                    <View style={styles.divider} />
                    <View style={{ flex: 1 }}>
                        <Button
                            title="Continue"
                            loadingText={loadingMessage}
                            loading={isLoading}
                            disabled={isLoading}
                            onPress={doValidateOTP}
                        />
                    </View>
                </View>
            </View>
        </Wrapper>
    );
}
