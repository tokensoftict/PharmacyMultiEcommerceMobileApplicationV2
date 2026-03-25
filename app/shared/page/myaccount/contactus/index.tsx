import React from 'react';
import {View, Text, Linking, TouchableOpacity, Modal, Image, Platform} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import {styles} from './styles';
import {call, mail, whatsapp} from "@/assets/icons";
import {labels} from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";

// @ts-ignore
const StoreDialog = ({ visible, onClose }) => {
    const storeLocation = {
        latitude: 8.4915319,
        longitude: 4.566907,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };

    const storeAddress = "Muritala Muhamed Way, opposite Forte Oil, Ilorin 240101, Kwara State";
    const phoneNumber = "+2349095950088";
    const email = "info@generaldrugcentre.com";
    const whatsappNumber = "2349095950088";


    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <Animatable.View animation="slideInUp" style={styles.container}>
                    <Typography style={styles.title}>📍 Our Store</Typography>
                    <MapView
                        style={styles.map}
                        mapType={Platform.OS == "android" ? "none" : "standard"}
                        region={storeLocation}
                    >
                        <Marker coordinate={storeLocation} title="Our Store" />
                    </MapView>

                    <Typography style={styles.label}>{storeAddress}</Typography>
                    <Typography style={styles.label}>{phoneNumber}</Typography>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: labels.type2.textColor }]}
                            onPress={() => Linking.openURL(`https://wa.me/${whatsappNumber}`)}
                        >
                            <Image source={whatsapp} style={styles.icon} tintColor={'#ffffff'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: labels.type3.textColor }]}
                            onPress={() => Linking.openURL(`mailto:${email}`)}
                        >
                            <Image source={mail} style={styles.icon} tintColor={'#ffffff'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: labels.type4.textColor }]}
                            onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
                        >
                            <Image source={call} style={styles.icon} tintColor={'#ffffff'} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Typography style={styles.closeText}>❌ Close</Typography>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        </Modal>
    );
};

export default StoreDialog;
