import React, { useState } from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Input from "@/shared/component/input";
import Typography from "@/shared/component/typography";
import RNDateTimePicker from "@react-native-community/datetimepicker";

// @ts-ignore
const CustomDatePicker = ({ label, value, onChange, mode = 'date', style, display, time }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value || new Date());
    // @ts-ignore
    const handleChange = (newDate) => {
        setSelectedDate(newDate);
        if (time === undefined) {
            onChange(newDate);
        } else {
            onChange(newDate, time);
        }
    };

    const triggerDatePicker = () => {
        if (Platform.OS === 'ios') {
            setShowDatePicker(true);
        } else {
            if (mode === 'datetime') {
                // Step 1: Date Picker
                DateTimePickerAndroid.open({
                    value: selectedDate,
                    mode: 'date',
                    display: display || 'default',
                    onChange: (_, date) => {
                        if (date) {
                            // Step 2: Time Picker
                            DateTimePickerAndroid.open({
                                value: date,
                                mode: 'time',
                                display: display || 'default',
                                is24Hour: true,
                                onChange: (_, timeValue) => {
                                    if (timeValue) {
                                        const finalDateTime = new Date(date);
                                        finalDateTime.setHours(timeValue.getHours());
                                        finalDateTime.setMinutes(timeValue.getMinutes());
                                        handleChange(finalDateTime);
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                // Regular 'date' or 'time'

                DateTimePickerAndroid.open({
                    value: selectedDate,
                    // @ts-ignore
                    mode,
                    display: display || 'default',
                    is24Hour: true,
                    onChange: (_, newDate) => {
                        if (newDate) handleChange(newDate);
                    }
                });
            }
        }
    };
    // @ts-ignore
    const onDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) handleChange(date);
    };

    const formatDisplayValue = () => {
        if (!selectedDate) return '';
        switch (mode) {
            case 'time':
                return selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            case 'datetime':
                return selectedDate.toLocaleString();
            case 'date':
            default:
                return selectedDate.toLocaleDateString();
        }
    };

    return (
        Platform.OS === 'android' ? (
            <View style={style}>
                <Typography>{label}</Typography>
                <TouchableOpacity onPress={triggerDatePicker}>
                    <Input
                        value={formatDisplayValue()}
                        editable={false}
                    />
                </TouchableOpacity>
                {showDatePicker && (
                    <RNDateTimePicker
                        style={style}
                        value={selectedDate}
                        // @ts-ignore
                        mode={mode}
                        display={display}
                        onChange={onDateChange}
                    />
                )}
            </View>
        ) : (
            <RNDateTimePicker
                style={{ alignItems: 'flex-start',  alignSelf: 'flex-start', alignContent : 'flex-start' }} // This helps on Android
                value={selectedDate}
                // @ts-ignore
                mode={mode}
                display={display}
                onChange={onDateChange}
            />
        )

    );
};

export default CustomDatePicker;
