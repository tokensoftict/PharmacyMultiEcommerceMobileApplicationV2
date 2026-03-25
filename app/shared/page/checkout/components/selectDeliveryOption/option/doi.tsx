import ButtonSheet from "@/shared/component/buttonSheet";
import { normalize } from "@/shared/helpers";
import { Animated, Dimensions, Easing, ScrollView, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";
import Typography from "@/shared/component/typography";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/shared/component/buttons";
import ListItemOption, { ListOptions } from "@/shared/component/ListItemOption";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import Icon from "@/shared/component/icon";
import { close, arrowBack } from "@/assets/icons";
import { palette, semantic } from "@/shared/constants/colors";
import { FONT } from "@/shared/constants/fonts";
import useDarkMode from "@/shared/hooks/useDarkMode";
import DeliveryToDriverWithinIlorin
    from "@/shared/page/checkout/components/selectDeliveryOption/option/doi/delivertodriverwithinilorin.tsx";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// @ts-ignore
export default function Doi({ callback, deliveryMethod = "", showDialog = false, extra = [] }: any) {
    const [dialogShow, setDialogShow] = useState<boolean>(showDialog);
    const [doiOptions, setDoiOptions] = useState<ListOptions[]>([]);
    const [doiOption, setDoiOption] = useState<ListOptions>();
    const { isDarkMode } = useDarkMode();

    const [step, setStep] = useState(1);
    const slideAnim = useRef(new Animated.Value(0)).current; // Slide animation
    const validationRefs = useRef({}); // Store validation functions

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


    useEffectOnce(() => {
        let myDoiLists = [];
        for (let key in extra) {
            // @ts-ignore
            myDoiLists.push({
                // @ts-ignore
                id: key,
                // @ts-ignore
                title: extra[key].name,
                // @ts-ignore
                price: extra[key].amount,
                active: false,
                // @ts-ignore
                option: extra[key].option,
            })
        }
        setDoiOptions(myDoiLists);
    }, [])

    function onSelectDoi(option: ListOptions) {
        setDoiOption(option);
        if (option.option.length > 0) {
            nextStep();
        }
    }

    const nextStep = () => {
        setStep((prev) => Math.min(prev + 1, 2));
    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const getDriverDetailsCallback = (data: any) => {
        callback({
            deliveryMethod: deliveryMethod,
            // @ts-ignore
            template_settings: extra[doiOption?.id],
            template_settings_value: data
        });

        setDialogShow(false);
    }



    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? semantic.fill.f01 : '#FFFFFF',
            overflow: 'hidden',
        },
        stepWrapper: {
            width: SCREEN_WIDTH,
            padding: normalize(24),
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: normalize(24),
        },
        title: {
            fontSize: normalize(18),
            fontFamily: FONT.BOLD,
            color: isDarkMode ? '#FFF' : '#1A1D1E',
        },
        listContainer: {
            flex: 1,
            marginBottom: normalize(24),
        },
        footer: {
            marginTop: 'auto',
            paddingBottom: normalize(8),
        },
    });

    const renderStepContent = () => (
        <Animated.View
            style={[
                {
                    flexDirection: 'row',
                    width: SCREEN_WIDTH * 2,
                    flex: 1,
                },
                {
                    transform: [
                        {
                            translateX: slideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -SCREEN_WIDTH],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            {/* Step 1: Select Location */}
            <View style={styles.stepWrapper}>
                <View style={styles.header}>
                    <Typography style={styles.title}>Select Location</Typography>
                    <TouchableOpacity onPress={() => setDialogShow(false)}>
                        <Icon icon={close} height={normalize(24)} tintColor={isDarkMode ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                    {doiOptions.length > 0 ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <ListItemOption
                                value={doiOption}
                                options={doiOptions}
                                onChange={onSelectDoi}
                            />
                        </ScrollView>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color={semantic.alert.danger.d500} />
                        </View>
                    )}
                </View>

                {doiOption?.option && doiOption.option.length === 0 && (
                    <View style={styles.footer}>
                        <Button title="Save Delivery Option" onPress={() => getDriverDetailsCallback({})} />
                    </View>
                )}
            </View>

            {/* Step 2: Driver Details */}
            <View style={styles.stepWrapper}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={prevStep} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon icon={arrowBack} height={normalize(24)} tintColor={isDarkMode ? '#FFF' : '#000'} />
                        <Typography style={[styles.title, { marginLeft: normalize(12) }]}>Driver Details</Typography>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                    <DeliveryToDriverWithinIlorin callback={getDriverDetailsCallback} />
                </View>
            </View>
        </Animated.View>
    );

    return (
        <ButtonSheet dispatch={dialogShow} height={normalize(step === 1 ? 500 : 600)}>
            <View style={styles.container}>
                {renderStepContent()}
            </View>
        </ButtonSheet>
    )
}
