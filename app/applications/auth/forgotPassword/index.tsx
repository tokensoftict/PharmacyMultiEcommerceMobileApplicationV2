import React, {useState} from "react";
import HeaderWithIcon from "@/shared/component/headerBack";
import {Image, ScrollView, View} from "react-native";
import TitleAuth from "@/shared/component/titleAuth";
import Typography from "@/shared/component/typography";
import Input from "@/shared/component/input";
import { Button } from "@/shared/component/buttons";
import {styles} from './styles'
import {normalize} from "@/shared/helpers";
import {logo} from "@/assets/images";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import ErrorText from "@/shared/component/ErrorText";
import ResetPasswordService from "@/service/auth/ResetPasswordService.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";

export default function ForgotPassword() {
    const navigation = useNavigation<NavigationProps>();
    const [isLoading, setIsLoading] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [emailOrPhoneError, setEmailOrPhoneError] = useState("");

    const forgotPasswordService = new ResetPasswordService();

    const backToLoginPage = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: "login" }]
            }));
    }

    function doPasswordRequest() {
        if(emailOrPhone === ""){
            setEmailOrPhoneError("Please enter your phone number or email address!")
        }else{
            setEmailOrPhoneError("");
            setIsLoading(true);
            forgotPasswordService.resetPasswordRequest(emailOrPhone).then(function(response){
                setIsLoading(false);
                if(response.data.status === true){
                    if(!isNaN(Number(emailOrPhone))){
                        //this means they entered a phone number
                        (new AuthSessionService().setPageSessionData("phone", emailOrPhone));
                        navigation.navigate('resetPassword');
                        Toasts(response.data.data.message)
                    }else{
                        (new AuthSessionService().setPageSessionData("phone", emailOrPhone));
                        navigation.navigate('resetPassword');
                        Toasts(response.data.data.message)
                    }
                }else{
                    const error = response.data.error;
                    if(error.hasOwnProperty("email_or_phone")){
                        const error_string = error.email_or_phone.join("\\n");
                        setEmailOrPhoneError(error_string);
                    }else{
                        setEmailOrPhoneError(error);
                    }
                }
            }, function (error){ setIsLoading(false);})
        }
    }

  return (
    <WrapperNoScroll>
        <HeaderWithIcon />
      <ScrollView style={{height : '100%', width:'100%'}} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>

              <View style={styles.titleImageContainer}>
                  <TitleAuth title="Forgot Password"/>
                  <Image
                      style={{
                          width: normalize(100),
                          height: normalize(60),
                          marginTop: normalize(10)
                      }}
                      source={logo}
                  />
              </View>


              <Typography style={styles.description}>{"Don't worry! it Happens. please enter the email or phone number associated with your account"}</Typography>

              <View style={styles.form}>
                  <Input
                      label="Email/Phone Number"
                      placeholder="Enter Your Email or Phone Number"
                      value={emailOrPhone}
                      onChangeText={(emailOrPhone) => setEmailOrPhone(emailOrPhone)}
                  />
                  {emailOrPhoneError !== '' ? <ErrorText>{emailOrPhoneError}</ErrorText> : ''}
              </View>
              <Button title={"Request Password Reset"} disabled={isLoading} loading={isLoading} onPress={doPasswordRequest} />
          </View>
      </ScrollView>
    </WrapperNoScroll>
  )
}
