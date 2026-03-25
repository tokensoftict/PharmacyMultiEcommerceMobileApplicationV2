import React, {useState} from "react";
import {styles} from "./styles";
import HeaderWithIcon from "@/shared/component/headerBack";
import {Image, TouchableOpacity, View} from "react-native";
import TitleAuth from "@/shared/component/titleAuth";
import {normalize} from "@/shared/helpers";
import {logo} from "@/assets/images";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import {eyeFilled, eyeOff, lock} from "@/assets/icons";
import ErrorText from "@/shared/component/ErrorText";
import {Button} from "@/shared/component/buttons";
import Toasts from "@/shared/utils/Toast.tsx";
import Security from "@/service/auth/Security.tsx";
import Typography from "@/shared/component/typography";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";

export default function ChangePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isOldPasswordShown, setIsOldPasswordShown] = useState(true);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [messageError, setMessageError] = useState('');

    const [errorOldPassword, setErrorOldPassword] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPasswordConfirmation, setErrorPasswordConfirmation] = useState("");
    const navigation = useNavigation<NavigationProps>();
    const security = new Security();


    function doPasswordReset() {
        let validationError = false;
        setErrorPassword("");
        setMessageError("");
        setErrorOldPassword("");
        setErrorPasswordConfirmation("")
        if(oldPassword === ""){
            setErrorOldPassword("Please enter your old password");
            validationError = true;
        }
        if(password === ""){
            setErrorPassword("Please enter your new Password");
            validationError = true;
        }
        if(passwordConfirmation === ""){
            setErrorPasswordConfirmation("Please enter confirm your new password");
            validationError = true;
        }

        if(!validationError){
            setIsLoading(true)
            security.changePassword(oldPassword, password, passwordConfirmation).then(function (response){
                setIsLoading(false);
                if(response.data.status === true){
                 Toasts('Your password has been reset successfully 👋');
                 setOldPassword("");
                 setPassword("");
                 setPasswordConfirmation("");
                }else{
                    const error = response.data.error;
                    if(error.hasOwnProperty("old_password")){
                        const error_string = error.pin.join("\\n");
                        setErrorOldPassword(error_string)
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
            <HeaderWithIcon title={"SECURITY"} />
            <View style={styles.container}>
                <View style={styles.titleImageContainer}>
                    <TitleAuth title="Change Password"/>
                    <Image
                        style={{
                            width: normalize(100),
                            height: normalize(60),
                            marginTop: normalize(10)
                        }}
                        source={logo}
                    />
                </View>


                <View style={styles.form}>

                    <View style={styles.formControl}>
                        <Input
                            leftIcon={<Icon icon={lock} />}
                            rightIcon={
                                isOldPasswordShown ? <Icon onPress={() => setIsOldPasswordShown(false)} icon={eyeOff} /> : <Icon onPress={() => setIsOldPasswordShown(true)} icon={eyeFilled} />
                            }
                            secureTextEntry={isOldPasswordShown}
                            value={oldPassword}
                            onChangeText={(password) => setOldPassword(password)}
                            label={"Old Password"}
                            placeholder={"Enter Your Old Password"}/>

                        {errorOldPassword !== '' ? <ErrorText>{errorOldPassword}</ErrorText> : ''}
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
                        <Button title="Change Password" loading={isLoading} disabled={isLoading}  onPress={doPasswordReset}  loadingText="Resetting Your Password Please wait.." />
                    </View>

                    <View style={styles.formControl}>
                        <TouchableOpacity  style={styles.addToCartButton} onPress={() =>{navigation.navigate('deleteAccount')}}>
                            <Typography style={styles.buttonText}>Delete My Account</Typography>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

        </WrapperNoScroll>

    );

}
