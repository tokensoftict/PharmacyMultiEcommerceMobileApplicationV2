import { normalize } from '../../../shared/helpers';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontSize: normalize(14),
    color: '#7A8499',
    marginBottom: normalize(2),
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(12),
  },
  name: {
    fontSize: normalize(13),
    marginLeft: normalize(10),
  },
});
