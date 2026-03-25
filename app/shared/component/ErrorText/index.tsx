import React from "react";
import Text  from 'react-native';
import PropTypes from "prop-types";
import {StyleSheet} from 'react-native';
import Typography from "../typography";

export default function ErrorText(props: any) {
  const {
    children,
    numberOfLines = 1,
    style = [],
    textAlign = "center"
  } = props;

  const  errorStyle = StyleSheet.flatten([
    {color : 'red', textAlign : textAlign} , style
  ])

  return (
    <Typography numberOfLines={numberOfLines}  style={errorStyle}>{children}</Typography>
  )

}

ErrorText.propTypes = {
  children: PropTypes.node, // plain text,
  numberOfLines: PropTypes.number,
  textAlign: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

