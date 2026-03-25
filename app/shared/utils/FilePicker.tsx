import React, { useState } from "react";
import { View, TouchableOpacity, Animated, Image } from "react-native";
import { pick, types } from "@react-native-documents/picker";
import Typography from "@/shared/component/typography";
import Icon from "@/shared/component/icon";
import { upload_file } from "@/assets/icons";
import { normalize } from "@/shared/helpers";
import Input from "@/shared/component/input";

const FilePicker = ({ onFileSelected, label }: any) => {
    const [fileName, setFileName] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [scale] = useState(new Animated.Value(1));

    const handlePickFile = async () => {
        try {
            const [result] = await pick({
                mode: 'open',
            })
            // @ts-ignore
            setFileName(result.name);
            // @ts-ignore
            setFileType(result.type);
            onFileSelected(result);
        } catch (err) {
            // see error handling
        }
    };

    // Animated button press effect
    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    // @ts-ignore

    return (
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
            <Input
                label={label}
                editable={false}
                placeholder={label}
                value={fileName ?? ""}
            />
            <View style={{ flex: 1, padding: normalize(15) }}>
                {/* Upload Button */}
                <Animated.View style={{
                    transform: [{ scale }],
                    position: "absolute",
                    right: normalize(40),
                    top: normalize(40),
                }}>
                    <TouchableOpacity
                        onPress={handlePickFile}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#ff4757",
                            padding: normalize(10),
                            shadowColor: "#ff6b81",
                            shadowOffset: { width: normalize(0), height: normalize(5) },
                            shadowOpacity: 0.5,
                            shadowRadius: normalize(10),
                            elevation: 5,
                            borderRadius: 5,
                        }}
                    >
                        <Icon icon={upload_file} height={20} width={20} tintColor={"#fff"} />
                        <Typography style={{ color: "#fff", fontSize: normalize(12) }}>
                            Select File
                        </Typography>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>

    );
};

export default FilePicker;
