import React from 'react';
import { styles } from "./styles";
import { View } from "react-native";
import Typography from "../typography";
import { currencyType } from "../../constants/global";

export default function ResumeTransaction() {
  return (
    <View style={styles.resume}>
      <View style={styles.containerResumeText}>
        <Typography>{"checkout.amount"}</Typography>
        <Typography>{currencyType} 83.00</Typography>
      </View>
      <View style={styles.containerResumeText}>
        <Typography>{"checkout.shipping"}</Typography>
        <Typography>-</Typography>
      </View>
      <View style={styles.containerResumeText}>
        <Typography>{"checkout.total"}</Typography>
        <Typography>-</Typography>
      </View>
    </View>
  )
}
