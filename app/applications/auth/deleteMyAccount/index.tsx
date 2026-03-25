import React, {useState} from 'react';
import {styles} from './styles'
import {
    View,
    Text,
    Alert,
    ActivityIndicator,
    Pressable, Image, TouchableOpacity
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import CheckBox from "@/shared/component/checkbox";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import Typography from "@/shared/component/typography";
import Security from "@/service/auth/Security.tsx";
import LoginService from "@/service/auth/LoginService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

// @ts-ignore
const DeleteAccountScreen = ({ navigation }) => {
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const security = new Security();
    const { showLoading, hideLoading } = useLoading();

    const handleDelete = () => {
        if (!confirmed) {
            Alert.alert('Confirmation Required', 'Please check the box to confirm.');
            return;
        }

        Alert.alert(
            'Are you absolutely sure?',
            'Deleting your account will erase all your data permanently. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes, Delete',
                    style: 'destructive',
                    onPress: () => deleteAccount(),
                },
            ]
        );
    };

    const deleteAccount = async () => {
        setLoading(true);
        const userProfile = new AuthSessionService().getAuthSession();
        showLoading("Logging out... Please wait...");
        new LoginService().logout().then(function (result) {
            if (result) {
                hideLoading();
                setTimeout(() => {
                    showLoading("Deleting your account... Please wait...");
                    security.deleteMyAccount(userProfile.data.id).then((response) => {
                        setLoading(false);
                        hideLoading();
                        if (response.data.status === true) {
                            Alert.alert('Deleted', 'Your account has been successfully deleted.');
                            navigation.reset({
                                index: 0,
                                routes: [{name: 'login'}],
                            });
                        } else {
                            Alert.alert('Error', 'Something went wrong.');
                            navigation.reset({
                                index: 0,
                                routes: [{name: 'login'}],
                            });
                        }
                    })
                }, 1000)
            } else {
                setLoading(false);
                hideLoading();
                Toastss("There was an error login out, please restart the application.")
            }
        })
    }

    return (
        <WrapperNoScrollNoDialogNoSafeArea>

            <View style={styles.container}>
                <Image
                    source={require("@/assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Animated.Text entering={FadeInDown.delay(100)} style={styles.title}>
                    Delete Account
                </Animated.Text>

                <Animated.Text entering={FadeInDown.delay(300)} style={styles.warning}>
                    ⚠️ This will permanently delete your account and all related data.
                    This action cannot be undone.
                </Animated.Text>

                <Animated.View entering={FadeInUp.delay(500)} style={styles.checkboxContainer}>
                    <CheckBox
                        onChange={(value) => {setConfirmed(value)}} value={confirmed}
                    />
                    <Typography style={styles.label}>I understand the consequences.</Typography>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(700)}>
                    <Pressable
                        style={[styles.button, { opacity: confirmed ? 1 : 0.5 }]}
                        onPress={handleDelete}
                        disabled={!confirmed || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Delete My Account</Text>
                        )}
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(700)}>
                    <Pressable
                        style={[styles.button2, { opacity:1 }]}
                        onPress={navigation.goBack}
                        disabled={false}
                    >
                        <Text style={styles.buttonText}>Cancel and Go Back</Text>
                    </Pressable>
                </Animated.View>

            </View>
        </WrapperNoScrollNoDialogNoSafeArea>
    );
};

export default DeleteAccountScreen;
