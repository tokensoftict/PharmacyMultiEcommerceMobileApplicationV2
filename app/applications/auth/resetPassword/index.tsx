import {CommonActions, useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import React, {useState} from "react";
import {styles} from "./styles";
import HeaderWithIcon from "@/shared/component/headerBack";
import Wrapper from "@/shared/component/wrapper";
import {Image, View} from "react-native";
import TitleAuth from "@/shared/component/titleAuth";
import {normalize} from "@/shared/helpers";
import {logo} from "@/assets/images";
import Typography from "@/shared/component/typography";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import {eyeFilled, eyeOff, lock} from "@/assets/icons";
import ErrorText from "@/shared/component/ErrorText";
import {Button} from "@/shared/component/buttons";
import ResetPasswordService from "@/service/auth/ResetPasswordService";
import AuthSessionService from "@/service/auth/AuthSessionService";
import Toasts from "@/shared/utils/Toast.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";

export default function ResetPassword() {
    const navigation = useNavigation<NavigationProps>();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
    const [pin, setPin] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [messageError, setMessageError] = useState('');

    const [errorPin, setErrorPin] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPasswordConfirmation, setErrorPasswordConfirmation] = useState("");

    const passwordRequest = new ResetPasswordService();

    const phone = (new AuthSessionService().getPageSessionData("phone"));

    const backToLoginPage = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: "login" }]
            }));
    }

    function doPasswordReset() {
        let validationError = false;
        if(pin === ""){
            setErrorPin("Please enter the four digit pin sent your phone");
            validationError = true;
        }
        if(password === ""){
            setErrorPin("Please enter your new Password");
            validationError = true;
        }
        if(passwordConfirmation === ""){
            setErrorPin("Please enter confirm your new password");
            validationError = true;
        }

        if(!validationError){
            setIsLoading(true)
            passwordRequest.resetPassword(phone, pin, password, passwordConfirmation).then(function (response){
                setIsLoading(false);
                if(response.data.status === true){
                    new AuthSessionService().setPageSessionData("phone", "");
                    Toasts('Your password has been reset successfully 👋 , please login with your new password');
                    backToLoginPage();
                }else{
                    const error = response.data.error;
                    if(error.hasOwnProperty("pin")){
                        const error_string = error.pin.join("\\n");
                        setErrorPin(error_string)
                    }else if(error.hasOwnProperty("password")){
                        const error_string = error.password.join("\\n");
                        setErrorPassword(error_string)
                    }else if(error.hasOwnProperty("password_confirmation")){
                        const error_string = error.password_confirmation.join("\\n");
                        setErrorPassword(error_string)
                    }else{
                        setMessageError(response.data.error);
                    }
                }
            }, function (error){setIsLoading(false)})

        }
    }

    return (
        <WrapperNoScroll>
            <HeaderWithIcon />
            <View style={styles.container}>
                <View style={styles.titleImageContainer}>
                    <TitleAuth title="Reset Password"/>
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
                    <Typography>A Four digits code has been send to</Typography>
                    <Typography style={styles.textEmail}>{phone}</Typography>
                </View>


                <View style={styles.form}>

                    <View style={styles.formControl}>
                        <Input
                            leftIcon={<Icon icon={lock} />}
                            value={pin}
                            onChangeText={(pin) => setPin(pin)}
                            maxLength={4}
                            keyboardType={"phone-pad"}
                            label={"Four Digit Code"}
                            placeholder={"Enter the four digit code"}/>

                        {errorPin !== '' ? <ErrorText>{errorPin}</ErrorText> : ''}
                    </View>

                    <View style={styles.formControl}>
                        <Input
                            leftIcon={<Icon icon={lock} />}
                            rightIcon={
                                isPasswordShown ? <Icon onPress={() => setIsPasswordShown(false)} icon={eyeOff} /> : <Icon onPress={() => setIsPasswordShown(true)} icon={eyeFilled} />
                            }
                            secureTextEntry={isPasswordShown}
                            onChangeText={(password) => setPassword(password)}
                            value={password}
                            label="New Password"
                            placeholder="Enter Your New Password"
                        />
                        {errorPassword !== '' ? <ErrorText>{errorPassword}</ErrorText> : ''}
                    </View>


                    <View style={styles.formControl}>
                        <Input
                            leftIcon={<Icon icon={lock} />}
                            rightIcon={
                                isConfirmPasswordShown ? <Icon onPress={() => setIsConfirmPasswordShown(false)} icon={eyeOff} /> : <Icon onPress={() => setIsConfirmPasswordShown(true)} icon={eyeFilled} />
                            }
                            secureTextEntry={isConfirmPasswordShown}
                            onChangeText={(passwordConfirmation) => setPasswordConfirmation(passwordConfirmation)}
                            value={passwordConfirmation}
                            label="Confirm Password"
                            placeholder="Confirm Your New Password"
                        />
                        {errorPasswordConfirmation !== '' ? <ErrorText>{errorPasswordConfirmation}</ErrorText> : ''}
                    </View>

                    <View style={styles.formControl}>
                        {messageError !== '' ?  <ErrorText textAlign={'center'} style={{marginBottom: 10}}>{messageError}</ErrorText> : <View/>}
                        <Button title="Reset Password" loading={isLoading} disabled={isLoading}  onPress={doPasswordReset}  loadingText="Resetting Your Password Please wait.." />
                    </View>


                </View>

            </View>

        </WrapperNoScroll>

    );

}
