import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, TouchableOpacity, View} from "react-native";
import {close, creditCardPlus} from "@/assets/icons";
import ListOptionCard, {OptionCardOptions} from "@/shared/component/ListOptionCard";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import {useFocusEffect} from "@react-navigation/native";
import {palette, semantic} from "@/shared/constants/colors.ts";
import {normalize} from "@/shared/helpers";
import Toastss from "@/shared/utils/Toast.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider";
import HeaderWithIcon from "@/shared/component/headerBack";
import CheckoutService from "@/service/checkout/CheckoutService.tsx";
import SubHeader from "@/shared/component/subHeader";
import ButtonSheet from "@/shared/component/buttonSheet";
import Typography from "@/shared/component/typography";
import Icon from "@/shared/component/icon";
import Clipboard from "@react-native-clipboard/clipboard";

export default function SelectPaymentOption({ onValidate }: { onValidate: (validateFn: () => Promise<boolean>) => void })  {
  const [paymentSelected, setPaymentSelected] = useState<OptionCardOptions>();
  const [checkOutPayment, setCheckOutPayment] = useState<OptionCardOptions[]>([]);
  const [isCheckOutPaymentLoading, setIsCheckOutPaymentLoading] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedBanks, setSelectedBanks] = useState<any[]>([]);
  const {isDarkMode} = useDarkMode();
  const checkOutService = new CheckoutService();
  const { showLoading, hideLoading } = useLoading();

  useFocusEffect(
      useCallback(() => {
        // This will run whenever the screen comes into focus
        getCheckOutPayment();
      }, [])
  );

  useEffect(() => {
    // @ts-ignore
    onValidate(async function validateAddress(){
      if (!paymentSelected?.id) {
        Toastss("Please select your preferred method payment");
        return false;
      }
      showLoading("Saving payment method...");
      const response = await checkOutService.saveCheckoutPaymentMethod(paymentSelected.id);
      if(response.data.status !== true) {
        Toastss(response.data.message);
        return false;
      }
      hideLoading();

      return paymentSelected?.id;
    }); // Validation passes if an address is selected
  }, [paymentSelected]);


  function getCheckOutPayment() {
    setIsCheckOutPaymentLoading(true);
    checkOutService.getCheckoutPaymentMethod().then((response) => {
      setCheckOutPayment([])
      if(response.data.status === true) {
        let myPaymentLists = [];
        for(let key in response.data.data) {
          myPaymentLists.push({
            id : response.data.data[key].id,
            icon : creditCardPlus,
            title : response.data.data[key].name,
            description : response.data.data[key].description,
            active : false,
            code : response.data.data[key].code,
            extra : response.data.data[key].bank_list,
          });

        }
        setCheckOutPayment(myPaymentLists)
      }
      setIsCheckOutPaymentLoading(false);
    });
  }

  function onSelectPayment(option: OptionCardOptions) {
    setPaymentSelected(option)
    if(option.code === 'Bank' && option.extra && option.extra.length > 0) {
      setSelectedBanks(option.extra);
      setShowBankModal(true);
    }
  }

  function copyToClipboard(text: string) {
    Clipboard.setString(text);
    Toastss("Account number copied to clipboard!");
  }

  return (
      <View style={{
        flex: 1,
        backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
      }}>
        <SubHeader icon={creditCardPlus} title="Payment Method" />

        {isCheckOutPaymentLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={semantic.alert.danger.d500} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: normalize(16) }}>
            <ListOptionCard
              value={paymentSelected}
              onChange={onSelectPayment}
              options={checkOutPayment}
            />
            <View style={{ height: normalize(140) }} />
          </ScrollView>
        )}

        <ButtonSheet onClose={() => setShowBankModal(false)} dispatch={showBankModal} height={normalize(450)}>
          <View style={{ padding: normalize(24) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(20) }}>
              <Typography style={{ fontSize: normalize(18), fontWeight: 'bold' }}>{"Bank Transfer Details"}</Typography>
              <TouchableOpacity onPress={() => setShowBankModal(false)}>
                <Icon icon={close} height={normalize(24)} tintColor={palette.main.p100} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedBanks.map((bank, index) => (
                <View key={index} style={{
                  backgroundColor: isDarkMode ? palette.secondary.s800 : '#F1F5F9',
                  padding: normalize(16),
                  borderRadius: normalize(12),
                  marginBottom: normalize(16),
                  borderWidth: 1,
                  borderColor: isDarkMode ? palette.secondary.s700 : '#E2E8F0'
                }}>
                  <View style={{ marginBottom: normalize(8) }}>
                    <Typography style={{ fontSize: normalize(12), color: semantic.text.f04, marginBottom: normalize(2) }}>{"Bank Name"}</Typography>
                    <Typography style={{ fontSize: normalize(16), fontWeight: 'bold' }}>{bank.name}</Typography>
                  </View>

                  <View style={{ marginBottom: normalize(8) }}>
                    <Typography style={{ fontSize: normalize(12), color: semantic.text.f04, marginBottom: normalize(2) }}>{"Account Name"}</Typography>
                    <Typography style={{ fontSize: normalize(15) }}>{bank.account_name}</Typography>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View style={{ flex: 1 }}>
                      <Typography style={{ fontSize: normalize(12), color: semantic.text.f04, marginBottom: normalize(2) }}>{"Account Number"}</Typography>
                      <Typography style={{ fontSize: normalize(18), fontWeight: 'bold', color: palette.main.p100 }}>{bank.account_number}</Typography>
                    </View>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(bank.account_number)}
                      style={{
                        backgroundColor: palette.main.p100,
                        paddingHorizontal: normalize(12),
                        paddingVertical: normalize(6),
                        borderRadius: normalize(8),
                      }}
                    >
                      <Typography style={{ color: '#FFFFFF', fontSize: normalize(12), fontWeight: 'bold' }}>{"COPY"}</Typography>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={{ height: normalize(40) }} />
            </ScrollView>
          </View>
        </ButtonSheet>
      </View>
  )
}
