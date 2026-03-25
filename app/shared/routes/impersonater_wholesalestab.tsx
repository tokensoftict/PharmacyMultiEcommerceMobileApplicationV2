import WholesalesHomePage from "@/applications/wholesales/home/wholesalesHome";
import {
    home as HomeIcon,
    listCart, brand, browse,
} from '@/assets/icons';
import Cart from "@/shared/page/cart";
import Brands from "@/shared/page/brands";
import Login from "@/applications/auth/login";
import Environment from "@/shared/utils/Environment.tsx";
import {useNavigation} from "@react-navigation/native";
import ExitImpersonate from '@/applications/salesrepresentative/home/exitImpersonate'

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
        id: '3',
        displayName: 'My Dashboard',
        name: 'close',
        icon: browse,
        component: ExitImpersonate,
    },
];
