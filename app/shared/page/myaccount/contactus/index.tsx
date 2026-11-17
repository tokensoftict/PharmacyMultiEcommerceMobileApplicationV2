import React, { useEffect, useState } from 'react';
import { View, Linking, TouchableOpacity, Modal, Image, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SUPERMARKET_URL } from '@env';
import { styles } from './styles';
import { call, mail, whatsapp } from '@/assets/icons';
import { labels } from '@/shared/constants/colors.ts';
import Typography from '@/shared/component/typography';

const CONTACT_CACHE_KEY = '@store_contact_info_v1';

interface StoreLocation {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface ContactInfo {
    store_title: string;
    store_address: string;
    phone_number: string;
    email: string;
    whatsapp_number: string;
    store_location: StoreLocation;
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
    store_title: '📍 Our Store',
    store_address: 'Muritala Muhamed Way, opposite Forte Oil, Ilorin 240101, Kwara State',
    phone_number: '+2349095950088',
    email: 'info@generaldrugcentre.com',
    whatsapp_number: '2349095950088',
    store_location: {
        latitude: 8.4915319,
        longitude: 4.566907,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    },
};

function normalizeContactInfo(raw: any): ContactInfo {
    if (!raw || typeof raw !== 'object') {
        return DEFAULT_CONTACT_INFO;
    }

    const loc = raw.store_location && typeof raw.store_location === 'object' ? raw.store_location : {};
    const num = (v: any, fallback: number) => {
        const parsed = typeof v === 'number' ? v : parseFloat(String(v));
        return Number.isFinite(parsed) ? parsed : fallback;
    };
    const str = (v: any, fallback: string) =>
        typeof v === 'string' && v.trim() !== '' ? v.trim() : fallback;

    return {
        store_title: str(raw.store_title, DEFAULT_CONTACT_INFO.store_title),
        store_address: str(raw.store_address, DEFAULT_CONTACT_INFO.store_address),
        phone_number: str(raw.phone_number, DEFAULT_CONTACT_INFO.phone_number),
        email: str(raw.email, DEFAULT_CONTACT_INFO.email),
        whatsapp_number: str(raw.whatsapp_number, DEFAULT_CONTACT_INFO.whatsapp_number).replace(/[^0-9]/g, '') ||
            DEFAULT_CONTACT_INFO.whatsapp_number,
        store_location: {
            latitude: num(loc.latitude, DEFAULT_CONTACT_INFO.store_location.latitude),
            longitude: num(loc.longitude, DEFAULT_CONTACT_INFO.store_location.longitude),
            latitudeDelta: num(loc.latitudeDelta, DEFAULT_CONTACT_INFO.store_location.latitudeDelta),
            longitudeDelta: num(loc.longitudeDelta, DEFAULT_CONTACT_INFO.store_location.longitudeDelta),
        },
    };
}

function contactInfoEndpoint(baseUrl: string | undefined = SUPERMARKET_URL): string | null {
    const match = /^(https?:\/\/[^/]+)/i.exec(baseUrl ?? '');
    return match ? `${match[1]}/api/app/contact-info` : null;
}

// @ts-ignore
const StoreDialog = ({ visible, onClose }) => {
    const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);

    useEffect(() => {
        let mounted = true;
        AsyncStorage.getItem(CONTACT_CACHE_KEY)
            .then((cached) => {
                if (cached && mounted) {
                    setContact(normalizeContactInfo(JSON.parse(cached)));
                }
            })
            .catch(() => {});

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!visible) return;
        let mounted = true;
        const url = contactInfoEndpoint();
        if (!url) return;

        axios
            .get(url, { timeout: 8000, headers: { Accept: 'application/json' } })
            .then((res) => {
                const payload = res?.data?.data;
                if (payload && mounted) {
                    const normalized = normalizeContactInfo(payload);
                    setContact(normalized);
                    AsyncStorage.setItem(CONTACT_CACHE_KEY, JSON.stringify(normalized)).catch(() => {});
                }
            })
            .catch(() => {});

        return () => {
            mounted = false;
        };
    }, [visible]);

    const storeLocation = contact.store_location;
    const storeAddress = contact.store_address;
    const phoneNumber = contact.phone_number;
    const email = contact.email;
    const whatsappNumber = contact.whatsapp_number;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <Animatable.View animation="slideInUp" style={styles.container}>
                    <Typography style={styles.title}>{contact.store_title}</Typography>
                    <MapView
                        style={styles.map}
                        mapType={Platform.OS == 'android' ? 'none' : 'standard'}
                        region={storeLocation}
                    >
                        <Marker coordinate={storeLocation} title={contact.store_title.replace(/^[^\w]+/, '') || 'Our Store'} />
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
