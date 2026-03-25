import React from "react";
import { View } from "react-native";
import useDarkMode from "@/shared/hooks/useDarkMode";
import {_styles} from './styles'
import Icon from "@/shared/component/icon";
import { mail, sale, shippingCart, shoppingBag, wallet } from "@/assets/icons";
import Typography from "@/shared/component/typography";
import { NotificationDTO } from "@/shared/DTO";

interface NotificationProps {
  notification: NotificationDTO
}
function Notification({notification}: NotificationProps) {
  const {isDarkMode} = useDarkMode()
  const styles = _styles(isDarkMode)
  function renderIcon() {
    const icons = {
      'payment': shippingCart,
      'new_service': shoppingBag,
      'wallet': wallet,
      'promo': sale
    }
    // @ts-ignore
    return icons[notification.state]
  }
  return (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon customStyles={styles.iconSize} icon={renderIcon()} />
        </View>
      <View style={styles.containerInfo}>
        <Typography style={styles.title}>{notification.title}</Typography>
        <Typography style={styles.description}>
          {notification.description}
        </Typography>
      </View>
    </View>
  )
}

export default React.memo(Notification);
