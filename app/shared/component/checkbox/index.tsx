// @ts-ignore
import {checkBoxRed, checkIcon} from "../../../assets/icons";
import {Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {normalize} from '../../helpers';
import {semantic} from '../../constants/colors';

interface CheckBoxProps {
  onChange: (value: boolean) => void
  value: boolean
}
export default function CheckBox({onChange, value}: CheckBoxProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(value);
  function onToggleTerms() {
    onChange(!acceptedTerms)
    setAcceptedTerms(!acceptedTerms);
  }

    useEffect(() => {
        setAcceptedTerms(value);
    }, [value]);

  // @ts-ignore
    return (
    <TouchableOpacity
      onPress={onToggleTerms}
      style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image
          style={{
            tintColor: acceptedTerms ? semantic.background.red.d500 : 'white',
            borderWidth: acceptedTerms ? 0 : 1,
            borderColor: 'gray',
            borderRadius: normalize(0),
            width: normalize(20),
            height: normalize(20),
          }}
          source={checkBoxRed}
      />
    </TouchableOpacity>
  );
}
