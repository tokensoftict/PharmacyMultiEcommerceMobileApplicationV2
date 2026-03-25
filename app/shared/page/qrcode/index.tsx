import { Dimensions, Image, View, Platform, ScrollView } from "react-native";
import { normalize } from "@/shared/helpers";
import HeaderWithIcon from "@/shared/component/headerBack/index.tsx";
import { qrcode, security_new } from "@/assets/icons";
import React, { useState } from "react";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import { styles } from './style.ts';
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import QrCodeService from "@/service/auth/QrCodeService.tsx";
import Typography from "@/shared/component/typography/index.tsx";
import Icon from "@/shared/component/icon/index.tsx";

export default function QrcodeScreen() {
    const [isLoading, setIsLoading] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const qrSize = screenWidth * 0.65;
    const session = new AuthSessionService();
    const user = session.getAuthSession();
    const qrCodeService = new QrCodeService();
    const [qrCodeLink, setQrCodeLink] = useState("");

    function loadQrCode() {
        setIsLoading(true);
        qrCodeService.qrCode(user.data?.id).then((response) => {
            setIsLoading(false);
            if (response.data.status === true) {
                setQrCodeLink(response.data.data.qrcode);
            }
        })
    }

    useEffectOnce(function () {
        loadQrCode();
    }, []);


    return (
        <View style={{ flex: 1 }}>
            <WrapperNoScroll
                loading={isLoading}
                backgroundColorStatusBar="#B00020"
                barStyle="light-content"
            >
                <View style={styles.container}>
                    <View>
                        <HeaderWithIcon title="MY QR CODE" />
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.premiumCard}>
                            <View style={styles.officialBadge}>
                                <Icon icon={security_new} width={20} height={20} tintColor="#D50000" />
                            </View>

                            <View style={styles.userHeader}>
                                <Image
                                    source={{ uri: user?.data?.image }}
                                    style={styles.avatar}
                                />
                                <Typography style={styles.userName}>
                                    {user?.data?.firstname} {user?.data?.lastname}
                                </Typography>
                                <Typography style={styles.userRole}>Official Member</Typography>
                            </View>

                            <View style={styles.qrWrapper}>
                                {qrCodeLink !== "" && (
                                    <Image
                                        source={{ uri: qrCodeLink }}
                                        style={[styles.qrImage, { width: qrSize, height: qrSize }]}
                                        resizeMode="contain"
                                    />
                                )}
                            </View>

                            <View style={styles.scanNote}>
                                <Typography style={styles.scanTitle}>ID: {user?.data?.id}</Typography>
                                <Typography style={styles.scanSub}>
                                    Present this QR code at checkout for quick identity verification and rewards.
                                </Typography>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </WrapperNoScroll>
        </View>
    );
}
