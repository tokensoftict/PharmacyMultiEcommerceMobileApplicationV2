import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import { _styles } from "./styles";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import SelectCheckoutAddress from "@/shared/page/checkout/components/selectCheckoutAddress";
import SelectDeliveryOption from "@/shared/page/checkout/components/selectDeliveryOption";
import SelectPaymentOption from "@/shared/page/checkout/components/selectPaymentOption";
import { normalize } from "@/shared/helpers";
import ConfirmCheckout from "@/shared/page/checkout/components/confirmCheckout";
import { Icon } from "react-native-paper";
import { arrowBack, arrowForward } from "@/assets/icons";
import { semantic } from "@/shared/constants/colors.ts";
import SwipeToComplete from "@/shared/page/checkout/components/swipeToComplete.tsx";
import OrderSuccessDialog from "@/shared/page/checkout/components/confirmCheckout/dialog/orderSuccessDialog.tsx";
import { useLoading } from "@/shared/utils/LoadingProvider.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import CheckoutService from "@/service/checkout/CheckoutService.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Typography from "@/shared/component/typography";
import { usePaystack } from "react-native-paystack-webview";
import styles from "@/shared/page/medreminder/create-medreminder/styles.ts";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CheckoutStepper = () => {
    const [step, setStep] = useState(1);
    const slideAnim = useRef(new Animated.Value(0)).current; // Slide animation
    const validationRefs = useRef({}); // Store validation functions
    const { isDarkMode } = useDarkMode();
    const [modalVisible, setModalVisible] = useState(false);
    const [order, setOrder] = useState({});
    const [paymentMethod, setPaymentMethod] = useState();
    // @ts-ignore
    const styles = new _styles(isDarkMode);
    const checkOutService = new CheckoutService();
    const { showLoading, hideLoading } = useLoading();
    const navigation = useNavigation();

    const { popup } = usePaystack();

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: step - 1,
            duration: 250, // Faster transition (previously 500ms)
            easing: Easing.inOut(Easing.ease), // Smooth easing
            useNativeDriver: true,
        }).start();
    }, [step]);

    // Register validation function for each step
    const registerValidation = (stepIndex: number, validationFunc: any) => {
        // @ts-ignore
        validationRefs.current[stepIndex] = validationFunc;
    };



    const nextStep = async () => {
        // @ts-ignore
        const validateFunc = validationRefs.current[step];
        if (validateFunc) {
            const isValid = await validateFunc(); // Await validation function
            if (typeof isValid == "number") {
                // @ts-ignore
                setPaymentMethod(isValid)
            }
            if (!isValid) return;
        }

        setStep((prev) => Math.min(prev + 1, 4));

    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    function popUpPayment() {
        showLoading("Please wait...");
        checkOutService.getPayStackTransactionData().then((response) => {

            if (response.data.status === true) {
                const paymentData = response.data.data;
                hideLoading();
                paymentData['onSuccess'] = function (response: any) {
                    if (response.status === "success") {
                        completeOrder(response.reference);
                    }
                }

                paymentData['onCancel'] = function () {

                }

                paymentData['onLoad'] = function (response: any) {

                }

                paymentData['onError'] = function (response: any) {

                }
                popup.checkout(paymentData);
            } else {
                hideLoading();
                Toastss("There was an error generating payment, please try again");
            }
        }, function (error) {
            hideLoading();
            Toastss("There was an error generating payment, please try again");
        })
    }

    function completeOrder(reference?: string) {
        showLoading("Placing Order... Please wait...");
        checkOutService.completeOrder(reference).then((response) => {
            hideLoading();
            if (response.data.status === true) {
                const orderDetails = response.data.data;
                setOrder(orderDetails);
                setModalVisible(true);
            } else {
                Toastss(response.data.message);
            }
        }, function (error) {
            hideLoading();
        });
    }

    const resetNavigation = (screen: string) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: screen }], // Replace stack with HomeScreen
            })
        );
    };


    function closeModal() {
        console.log("am pressed closeModal")
        setModalVisible(false);
        resetNavigation(new AuthSessionService().getEnvironment());
    }


    function onViewOrder() {
        console.log("am pressed onViewOrder")
        setModalVisible(false);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: "showOrder",
                        // @ts-ignore
                        params: { orderId: order?.id }, // ✅ Passing parameters
                    },
                ],
            })
        );
    }

    const renderStepContent = () => {
        return (<Animated.View
            style={[
                styles.stepsContainer,
                {
                    transform: [
                        {
                            translateX: slideAnim.interpolate({
                                inputRange: [0, 1, 2, 3],
                                outputRange: [0, -SCREEN_WIDTH, -SCREEN_WIDTH * 2, -SCREEN_WIDTH * 3],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <View style={styles.step}>
                {
                    step == 1 && (<SelectCheckoutAddress onValidate={(validate) => registerValidation(1, validate)} />)
                }
            </View>

            <View style={styles.step}>
                {
                    step == 2 && (<SelectDeliveryOption onValidate={(validate) => registerValidation(2, validate)} />)
                }
            </View>
            <View style={styles.step}>
                {
                    step == 3 && (<SelectPaymentOption onValidate={(validate) => registerValidation(3, validate)} />)
                }

            </View>
            <View style={styles.step}>
                {step == 4 && (
                    <>
                        <ConfirmCheckout onValidate={(validate) => registerValidation(4, validate)} />
                    </>
                )}
            </View>
        </Animated.View>);
    };

    const renderStepHeader = (stepNumber: number, title: string, isActive: boolean) => (
        <View style={styles.stepHeader} key={stepNumber}>
            <Typography style={[styles.stepTitle, isActive && styles.stepTitleActive]}>{title}</Typography>
            <View style={[styles.stepLine, isActive && styles.stepLineActive]} />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Step Headers */}
            <View style={styles.headerContainer}>
                {renderStepHeader(1, 'Address', step === 1)}
                {renderStepHeader(2, 'Delivery', step === 2)}
                {renderStepHeader(3, 'Payment', step === 3)}
                {renderStepHeader(4, 'Confirm', step === 4)}
            </View>

            {/* Step Content */}
            <View style={styles.content}>{renderStepContent()}</View>

            {/* Navigation Buttons */}
            <View style={styles.navigation}>
                {
                    step === 4
                        ?
                        (paymentMethod === 4 || paymentMethod === 8) ?
                            <SwipeToComplete swipedAndCompleteOrder={popUpPayment} />
                            :
                            <SwipeToComplete swipedAndCompleteOrder={completeOrder} />
                        :
                        <View style={styles.nav}>

                            <TouchableOpacity
                                disabled={step === 1}
                                style={[
                                    styles.buttonSecondary,
                                    step === 1 && styles.buttonDisabled,
                                ]}
                                onPress={prevStep}
                            >
                                <Icon
                                    size={normalize(18)}
                                    source={arrowBack}
                                    color={isDarkMode ? '#94A3B8' : '#475569'}
                                />
                                <Typography style={styles.buttonSecondaryText}> PREV</Typography>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={nextStep}>
                                <Typography style={styles.buttonPrimaryText}>{step === 4 ? 'Finish' : 'NEXT'}</Typography>
                                {step !== 4 && (
                                    <Icon
                                        size={normalize(18)}
                                        source={arrowForward}
                                        color="#FFF"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                }

            </View>
            <OrderSuccessDialog
                visible={modalVisible}
                onClose={closeModal}
                onViewOrder={onViewOrder}
            />
        </View>
    );
};


export default CheckoutStepper;
