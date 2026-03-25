import { StyleSheet } from 'react-native';
import { normalize } from '../../helpers';

export const styles = StyleSheet.create({
  header: {
    paddingVertical: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  title: {
    textAlign: 'center',

    fontSize: normalize(16),
  },
});
