import WholesalesHomePage from "@/applications/wholesales/home/wholesalesHome";
import {
    home as HomeIcon,
    myAccount,
    listCart, qrcode, brand,
} from '@/assets/icons';
import Cart from "@/shared/page/cart";
import MyAccount from "@/shared/page/myaccount";
import QrcodeScreen from "@/shared/page/qrcode";
import Brands from "@/shared/page/brands";
import Login from "@/applications/auth/login";
import Environment from "@/shared/utils/Environment.tsx";
import {useNavigation} from "@react-navigation/native";


// @ts-ignore
const RequireLogin = ({ children, fallback }) => {
    const isLoggedIn = Environment.isLogin(); // You can replace this with a useAuth hook if needed
    return isLoggedIn ? children : fallback;
};

// @ts-ignore
const withAuth = (Component : any) => () => (
    <RequireLogin fallback={<Login navigation={useNavigation()} />}>
        <Component />
    </RequireLogin>
);


export default [
    {
        id: '1',
        displayName: 'Home',
        name: 'homeTab',
        icon: HomeIcon,
        component: WholesalesHomePage,
    },
    {
        id: '2',
        displayName: 'Brands',
        name: 'brands',
        icon: brand,
        component: Brands,
    },

    {
        id: '3',
        displayName: 'My Cart',
        name: 'myCart',
        icon: listCart,
        component: withAuth(Cart),
    },

    {
        id: '4',
        displayName: 'QR Code',
        name: 'qrcode',
        icon: qrcode,
        component: withAuth(QrcodeScreen),
    },
    {
        id: '5',
        displayName: 'Account',
        name: 'myAccount',
        icon: myAccount,
        component: withAuth(MyAccount),
    },
];
