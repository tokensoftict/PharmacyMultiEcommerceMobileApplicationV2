import React from 'react';
import {ActivityIndicator, Image, Text, TouchableOpacity, View} from "react-native";
import {styles} from './styles'
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../../routes/stack";
import AuthSessionService from "../../../service/auth/AuthSessionService";
import Typography from "@/shared/component/typography";
import Environment from "@/shared/utils/Environment.tsx";
import {semantic} from "@/shared/constants/colors.ts";
import {normalize} from "@/shared/helpers";


export default function ImpersonateHeader() {
    const navigation = useNavigation<NavigationProps>()
    const imperCustomer = Environment.checkForImpersonateCustomerData();
    return (
        <View style={{backgroundColor : '#F7D9D9',flex: 1, flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
            <View style={styles.container}>
                <Image style={styles.avatar} source={{uri: imperCustomer.user.image}} />
                <View style={styles.header}>
                    <Typography style={styles.headerText}>{imperCustomer.business_name}</Typography>
                    <Typography style={styles.subHeaderText}>{imperCustomer.user.email}</Typography>
                    <Typography style={styles.subHeaderText}>{imperCustomer.user.phone}</Typography>
                </View>
            </View>
            <TouchableOpacity  style={styles.addToCartButton} onPress={()=>{
                const session = new AuthSessionService();
                session.removeImpersonateCustomerData();
                session.setEnvironment("sales_representative");
                // @ts-ignore
                navigation.replace('sales_representative');
            }}>
                <Typography style={{color : '#FFF'}}>Cancel</Typography>
            </TouchableOpacity>
        </View>
    )
}
