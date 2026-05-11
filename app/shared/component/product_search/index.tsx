import React, { useEffect, useState } from "react";
import {
    Modal,
    KeyboardAvoidingView
} from "react-native";
import Search from "@/shared/page/search";


interface SearchDialogProps {
    visible: boolean;
    onClose: () => void;
    onItemSelected?: (item: any) => void;
    storeType?: string | null;
}

export default function SearchDialog({ visible, onClose, onItemSelected, storeType }: SearchDialogProps) {
    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <KeyboardAvoidingView style={{ flex: 1 }}>
              <Search onClose={onClose} onItemSelected={onItemSelected} visible={visible} storeType={storeType} />
            </KeyboardAvoidingView>
        </Modal>
    );
}
