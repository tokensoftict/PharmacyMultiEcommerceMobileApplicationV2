import {View} from "react-native";
import {normalize} from "@/shared/helpers";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import {user, phone} from "@/assets/icons";
import ErrorText from "@/shared/component/ErrorText";
import React, {useEffect} from "react";
import {Button} from "@/shared/component/buttons";

// @ts-ignore
export default function DeliveryToDriverWithinIlorin({ callback})
{
    const [driversName, setDriversName] = React.useState<string>("");
    const [driversNameError, setDriversNameError] = React.useState<string>("");

    const [driversPhone, setDriversPhone] = React.useState<string>("");
    const [driversPhoneError, setDriversPhoneError] = React.useState<string>("");


    function validatePhone() {
        setDriversPhoneError("");
        setDriversNameError("");
        if(driversName == "") {
            setDriversNameError("Driver's Name is required");
            return false
        } else if(driversPhone == "") {
            setDriversPhoneError("Driver's Phone Number is required")
            return false
        } else {

            callback({
                "Driver's Name" : driversName,
                "Driver's Phone Number" : driversPhone
            })
        }
    }

    return (
        <View style={{
            flex: 1,
            paddingHorizontal: normalize(10)
        }}>

            <View style={{marginBottom: normalize(15)}}>
                <Input
                    leftIcon={<Icon icon={user} />}
                    label="Driver's Name"
                    value={driversName}
                    onChangeText={(name) => setDriversName(name)}
                    placeholder="Driver's Name"
                />
                {driversNameError !== '' ? <ErrorText>{driversNameError}</ErrorText> : ''}
            </View>

            <View style={{marginBottom: normalize(15)}}>
                <Input
                    leftIcon={<Icon icon={phone} />}
                    label="Driver's Phone Number"
                    value={driversPhone}
                    onChangeText={(phone) => setDriversPhone(phone)}
                    placeholder="Driver's Phone Number"
                />
                {driversPhoneError !== '' ? <ErrorText>{driversPhoneError}</ErrorText> : ''}
            </View>

            <View style={{marginBottom: normalize(0), flexDirection: 'row', alignItems: 'center', marginTop: normalize(5), paddingLeft: normalize(50), paddingRight : normalize(50)}}>
                <View style={{flex: 1}}>
                    <Button  title="SAVE" onPress={validatePhone}/>
                </View>
            </View>

        </View>
    );
}
