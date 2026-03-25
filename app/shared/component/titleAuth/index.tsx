import React from 'react';
import { styles } from "./styles";
import Typography from "../typography";

interface TitleAuthProps {
  title: string;
}
export default function TitleAuth({title}: TitleAuthProps) {

  return (
    <Typography style={styles.title}>{title}</Typography>
  )
}
