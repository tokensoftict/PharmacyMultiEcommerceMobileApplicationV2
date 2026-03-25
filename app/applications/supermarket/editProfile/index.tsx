import React, {useState} from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import HeaderWithIcon from '@/shared/component/headerBack';
import Icon from '@/shared/component/icon';
import {mail, phone, user} from '../../../assets/icons';
import Input from '@/shared/component/input';
import {Button} from '@/shared/component/buttons';
import {_styles} from './styles.ts';
import AuthSessionService from "@/service/auth/AuthSessionService";
import ErrorText from "@/shared/component/ErrorText";
import Toasts from "@/shared/utils/Toast.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import SignUpService from "@/service/auth/SignUpService.tsx";
import {useNavigation} from "@react-navigation/native";

const EditProfile = () => {

  const userProfile = (new AuthSessionService()).getAuthSession();
  const signUpService = new SignUpService();

  const [firstname , setFirstName] = useState(userProfile.data.firstname);
  const [lastname , setLastName] = useState(userProfile.data.lastname);
  const [email , setEmail] = useState(userProfile.data.email);
  const [phoneNumber , setPhoneNumber] = useState(userProfile.data.phone);

  const [isLoading, setIsLoading] = useState(false);

  const [firstNameError , setFirstNameError] = useState('');
  const [lastNameError , setLastNameError] = useState('');
  const [emailError , setEmailError] = useState('');
  const [phoneNumberError , setPhoneNumberError] = useState('');

  const navigation = useNavigation();



  const [messageError, setMessageError] = useState('');

  function doProfileUpdate() {

    let validationStatus = false;
    if(firstname === ''){
      setFirstNameError("First Name field is required");
      validationStatus = true;
    }
    if(lastname === ''){
      setLastNameError('Last Name field is required');
      validationStatus = true;
    }

    if(!validationStatus) {
      setIsLoading(true)
      setFirstNameError('');
      setLastNameError('')
      signUpService.updateAccount(firstname, lastname).then(function (response : any) {
        setIsLoading(false);
        if (response.status === false) {
          if (response.hasOwnProperty('firstname') && response.firstname !== false) {
            setLastNameError(response.firstname);
          }
          if (response.hasOwnProperty('lastname') && response.lastname !== false) {
            setLastNameError(response.lastname);
          }
        } else {
          Toasts('Your Profile has been updated successfully. 👋');
          navigation.goBack();
        }
      });
    }

  }

  return (
      <WrapperNoScroll>
        <HeaderWithIcon title="Edit Profile" />
        <ScrollView>
          <View style={_styles.container}>
            <View style={_styles.imageContainer}>
              <Image
                  style={_styles.image}
                  source={{uri: userProfile.data.image}}
              />
              {/*
            <TouchableOpacity style={_styles.editImage}>
              <Icon icon={edit} />
            </TouchableOpacity>
            */}
            </View>
            <View style={_styles.formContainer}>
              <View style={_styles.formControl}>
                <Input label="First Name"   value={firstname} onChangeText={(firstname) => setFirstName(firstname)} leftIcon={<Icon icon={user} />} placeholder="First Name"/>
                {firstNameError !== '' ? <ErrorText>{firstNameError}</ErrorText> : ''}
              </View>
              <View style={_styles.formControl}>
                <Input label="Last Name" onChangeText={(lastname) => setLastName(lastname)}   value={lastname} leftIcon={<Icon icon={user} />} placeholder="Last Name"/>
                {lastNameError !== '' ? <ErrorText>{lastNameError}</ErrorText> : ''}
              </View>

              <View style={_styles.formControl}>
                <Input editable={false} label="Email Address" onChangeText={(email) => setEmail(email)}  value={email} leftIcon={<Icon icon={mail} />} placeholder="Email Address"/>
                {emailError !== '' ? <ErrorText>{emailError}</ErrorText> : ''}
              </View>


              <View style={_styles.formControl}>
                <Input editable={false} label="Phone Number" onChangeText={(phone) => setPhoneNumber(phone)}  value={phoneNumber} leftIcon={<Icon icon={phone} />} placeholder="Phone Number"/>
                {emailError !== '' ? <ErrorText>{emailError}</ErrorText> : ''}
              </View>

            </View>
            <View style={_styles.formControl}>
              {messageError !== '' ?  <ErrorText textAlign={'center'} style={{marginBottom: 10}}>{messageError}</ErrorText> : <View/>}
              <Button title="Update Profile" disabled={isLoading} loading={isLoading} loadingText={"Update Profile"} onPress={doProfileUpdate} />
            </View>
          </View>
        </ScrollView>
      </WrapperNoScroll>
  );
};

export default EditProfile;
