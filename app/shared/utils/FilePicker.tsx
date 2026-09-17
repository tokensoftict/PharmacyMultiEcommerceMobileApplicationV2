import React, { useState } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { pick } from "@react-native-documents/picker";
import Typography from "@/shared/component/typography";
import Icon from "@/shared/component/icon";
import { upload_file } from "@/assets/icons";
import { normalize } from "@/shared/helpers";
import { semantic, palette } from "@/shared/constants/colors";

const FilePicker = ({ onFileSelected, label }: any) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [scale] = useState(new Animated.Value(1));

    const handlePickFile = async () => {
        try {
            const [result] = await pick({
                mode: 'open',
            })
            // @ts-ignore
            setFileName(result.name);
            onFileSelected(result);
        } catch (err) {
            // see error handling
        }
    };

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                onPress={handlePickFile}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.85}
                style={{
                    borderWidth: 1.5,
                    borderColor: fileName ? palette.main.p500 : semantic.text.borderColor,
                    borderStyle: "dashed",
                    borderRadius: normalize(12),
                    backgroundColor: fileName ? '#FFF5F5' : semantic.fill.f04,
                    paddingVertical: normalize(16),
                    paddingHorizontal: normalize(16),
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {/* Icon container */}
                <View
                    style={{
                        width: normalize(44),
                        height: normalize(44),
                        borderRadius: normalize(12),
                        backgroundColor: fileName ? palette.main.p500 : '#E8E8E8',
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Icon
                        icon={upload_file}
                        height={22}
                        width={22}
                        tintColor={fileName ? "#fff" : semantic.text.grey}
                    />
                </View>

                {/* Text content */}
                <View style={{ flex: 1, marginLeft: normalize(14) }}>
                    <Typography
                        style={{
                            fontSize: normalize(13),
                            fontWeight: "600",
                            color: semantic.text.black,
                            marginBottom: normalize(2),
                        }}
                    >
                        {label}
                    </Typography>
                    <Typography
                        numberOfLines={1}
                        style={{
                            fontSize: normalize(11),
                            color: fileName ? palette.main.p500 : semantic.text.grey,
                        }}
                    >
                        {fileName ? fileName : "Tap to select a file"}
                    </Typography>
                </View>

                {/* Action indicator */}
                <View
                    style={{
                        paddingHorizontal: normalize(12),
                        paddingVertical: normalize(6),
                        borderRadius: normalize(8),
                        backgroundColor: fileName ? palette.main.p500 : '#E8E8E8',
                    }}
                >
                    <Typography
                        style={{
                            fontSize: normalize(11),
                            fontWeight: "600",
                            color: fileName ? "#fff" : semantic.text.grey,
                        }}
                    >
                        {fileName ? "Change" : "Browse"}
                    </Typography>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default FilePicker;
