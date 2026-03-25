import WholesalesHomePage from "@/applications/wholesales/home/wholesalesHome";
import {
    myAccount, qrcode, brand, dashboard,
} from '@/assets/icons';
import MyAccount from "@/shared/page/myaccount";
import QrcodeScreen from "@/shared/page/qrcode";
import Login from "@/applications/auth/login";
import Environment from "@/shared/utils/Environment.tsx";
import {useNavigation} from "@react-navigation/native";
import SalesRepresentativeHome from "@/applications/salesrepresentative/home/salesRepresentativeHome.tsx";


// @ts-ignore
const RequireLogin = ({ children, fallback }) => {
    const isLoggedIn = Environment.isLogin(); // You can replace this with a useAuth hook if needed
    return isLoggedIn ? children : fallback;
};

// @ts-ignore
const withAuth = (Component) => () => (
    <RequireLogin fallback={<Login navigation={useNavigation()} />}>
        <Component />
    </RequireLogin>
);

export default [
    {
        id: '1',
        displayName: 'Dashboard',
        name: 'homeTab',
        icon: dashboard,
        component: SalesRepresentativeHome,
    },
    {
        id: '2',
        displayName: 'Account',
        name: 'myAccount',
        icon: myAccount,
        component: withAuth(MyAccount),
    },
];
