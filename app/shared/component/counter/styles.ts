import { StyleSheet } from 'react-native';
import { normalize } from '../../helpers';
import { semantic } from "@/shared/constants/colors.ts";

const btn = {
  width: normalize(34),
  height: normalize(34),
};

const icons = {
  width: normalize(24),
  height: normalize(24),
};
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: normalize(18),
    marginHorizontal: normalize(8),
    width: normalize(24),
    textAlign: 'center',
    alignSelf: 'center',
  },
  btnReduce: {
    ...btn,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAument: {
    ...btn,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minus: {
    ...icons,
  },
  plus: {
    ...icons,
  },
  input: {
    width: normalize(60),
    height: normalize(40),
    borderRadius: normalize(8),
    borderStyle: 'solid',
    borderColor: semantic.alert.danger.d500,
    borderWidth: normalize(1),
    backgroundColor: semantic.fill.f03,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(12),
    color: '#000',
    textAlign: 'center',
    marginHorizontal: normalize(12),
    fontSize: normalize(12),

  }
});
