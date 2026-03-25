import React, { useEffect, useState } from 'react';
import { styles } from "./style";
import {
    View,
    FlatList,
    useWindowDimensions, Image, TouchableOpacity, ScrollView, RefreshControl
} from 'react-native';
import { Card } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import * as Animatable from 'react-native-animatable';
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Typography from "@/shared/component/typography";
import Input from "@/shared/component/input";
import { normalize } from "@/shared/helpers";
import { labels, semantic } from "@/shared/constants/colors.ts";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import DashboardService from "@/service/salesrepresnetative/DashboardService.tsx";
import { Customer, Dashboard } from "@/service/salesrepresnetative/interface/Dashboard.tsx";
import { useNavigation } from "@react-navigation/native";
import Toastss from "@/shared/utils/Toast.tsx";
import CustomerProfileModal from "@/applications/salesrepresentative/home/customer";

// @ts-ignore
const CustomersRoute = ({ searchCustomer, setSearchCustomer, filteredCustomers, renderCustomerItem }) => (
    <View style={styles.tabContainer}>
        <Input
            placeholder="Search Customers..."
            value={searchCustomer}
            onChangeText={setSearchCustomer}
        />
        <FlatList
            style={{ marginTop: normalize(20) }}
            data={filteredCustomers}
            renderItem={renderCustomerItem}
            keyExtractor={(item) => item.id.toString()}
        />
    </View>
);
// @ts-ignore
const OrdersRoute = ({ searchOrder, setSearchOrder, filteredOrders, renderOrderItem }) => (
    <View style={styles.tabContainer}>
        <Input
            placeholder="Search Orders..."
            value={searchOrder}
            onChangeText={setSearchOrder}
        />
        <FlatList
            style={{ marginTop: normalize(20) }}
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    </View>
);



export default function SalesRepresentativeHome() {
    const layout = useWindowDimensions();
    const [dashBoardData, setDashBoardData] = useState<Dashboard>({
        customerList: [],
        month: "",
        orderList: [],
        sumOfDispatchedOrders: 0,
        totalNumberOfCustomers: 0,
        totalNumberOfDispatchedOrders: 0

    })
    const navigation = useNavigation();
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
    const [searchCustomer, setSearchCustomer] = useState('');
    const [searchOrder, setSearchOrder] = useState('');
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [routes] = useState([{ key: 'customers', title: 'My Customers' }, { key: 'orders', title: 'Recent Orders' }]);
    const userProfile = (new AuthSessionService()).getAuthSession();
    const salesRep = userProfile.data?.apps.filter((app: any) => {
        return app.name === 'sales representative';
    })[0].info;

    const dashboardService = new DashboardService();
    useEffect(() => {
        loadDashboard();
    }, []);

    function loadDashboard() {
        setLoading(true)
        dashboardService.dashboard().then(function (response) {
            console.log(response);
            setLoading(false)
            setDashBoardData(response.data.data);
        }, function (error) { setLoading(false) })
    }




    const filteredCustomers = dashBoardData?.customerList.filter((item) =>
        item.business_name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchCustomer.toLowerCase())

    );


    const filteredOrders = dashBoardData?.orderList.filter((item) =>
        item.orderId.toLowerCase().includes(searchOrder.toLowerCase()) ||
        item.customer.business_name.toLowerCase().includes(searchCustomer.toLowerCase())
    );

    function triggerCustomerDialog(status: boolean) {
        setOpenCustomerDialog(status);
    }

    const impersonateCustomer = function (data: Customer) {
        const session = new AuthSessionService();
        session.setImpersonateCustomerData(data);
        triggerCustomerDialog(false);
        session.setEnvironment("wholesales");
        // @ts-ignore
        navigation.navigate('wholesales');
    }

    const renderCustomerItem = ({ item, index }: any) => (
        <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.gridItem}>
            <TouchableOpacity onPress={() => {
                setSelectedCustomer(item);
                triggerCustomerDialog(true);
            }}>
                <Card style={styles.gridCard}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
                        <Image style={styles.avatarCustomer} source={{ uri: item.user.image }} />
                        <View style={styles.gridContent}>
                            <Typography style={styles.gridTitle}>{item.business_name}</Typography>
                            <Typography style={styles.gridSub}>{item.phone}</Typography>
                            <Typography style={styles.gridSub}>{item?.customer_type?.name ?? ""} - {item?.customer_group?.name ?? ""}</Typography>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        </Animatable.View>
    );

    const renderOrderItem = ({ item, index }: any) => (
        <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.gridItem}>
            <TouchableOpacity onPress={() => {
                // @ts-ignore
                navigation.navigate('showOrder', { orderId: item.id })
            }} style={{ flex: 1 }}>
                <Card style={styles.gridCard}>
                    <View style={styles.gridContent}>
                        <Typography style={styles.gridTitle}>#{item.orderId} - ₦{item.totalAmount}</Typography>
                        <Typography style={styles.gridSub}>{item.customer.business_name}</Typography>
                        <Typography style={styles.gridSub}>{item.orderDate}</Typography>
                        <Typography style={styles.status}>{item.status}</Typography>
                        <Typography style={styles.status}>No Of Items : {item.product_count}</Typography>
                    </View>
                </Card>
            </TouchableOpacity>
        </Animatable.View>
    );


    // @ts-ignore
    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'customers':
                return (
                    <CustomersRoute
                        searchCustomer={searchCustomer}
                        setSearchCustomer={setSearchCustomer}
                        filteredCustomers={filteredCustomers}
                        renderCustomerItem={renderCustomerItem}
                    />
                );
            case 'orders':
                return (
                    <OrdersRoute
                        searchOrder={searchOrder}
                        setSearchOrder={setSearchOrder}
                        filteredOrders={filteredOrders}
                        renderOrderItem={renderOrderItem}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <WrapperNoScrollNoDialogNoSafeArea loading={loading}>
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading ?? false} onRefresh={loadDashboard} />
                }
            >
                <View style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <Image style={styles.avatar} source={{ uri: userProfile?.data?.image }} />
                        <View style={styles.header}>
                            <Typography style={styles.headerText}>{userProfile?.data?.name}</Typography>
                            <Typography style={styles.subHeaderText}>{userProfile?.data?.email}</Typography>
                            <Typography style={styles.subHeaderText}>{userProfile?.data?.phone}</Typography>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Typography style={styles.subHeaderText}>Referral Code : </Typography>
                                <TouchableOpacity onPress={() => {
                                    Clipboard.setString(salesRep.code);
                                    Toastss("Copied to clipboard!");
                                }}>
                                    <Typography style={styles.code}>{salesRep.code}</Typography>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                    <View style={styles.cardRow}>
                        <Card style={styles.card}>
                            <View style={styles.cardContent}>
                                <Typography style={styles.cardTitle}>Customers</Typography>
                                <Typography style={styles.cardValue}>{dashBoardData?.totalNumberOfCustomers}</Typography>
                            </View>
                        </Card>
                        <Card style={styles.card}>
                            <View style={styles.cardContent}>
                                <Typography style={styles.cardTitle}>Dispatched Orders</Typography>
                                <Typography style={styles.cardValue}>{dashBoardData?.totalNumberOfDispatchedOrders}</Typography>
                            </View>
                        </Card>
                    </View>
                    <View style={styles.cardRow}>
                        <Card style={styles.cardFull}>
                            <View style={styles.cardContent}>
                                <Typography style={styles.cardTitle}>{dashBoardData?.month} Sales</Typography>
                                <Typography style={styles.cardValue}>₦{dashBoardData?.sumOfDispatchedOrders}</Typography>
                            </View>
                        </Card>
                    </View>

                </View>
            </ScrollView>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props =>
                    <TabBar {...props}
                        activeColor={labels.type4.textColor}
                        inactiveColor={'#000'}
                        indicatorStyle={{ backgroundColor: labels.type4.textColor }}
                        style={{ backgroundColor: '#FFF' }}
                    />
                }
            />
            <CustomerProfileModal
                customerData={selectedCustomer}
                visible={openCustomerDialog} onClose={() => triggerCustomerDialog(false)}
                onImpersonate={impersonateCustomer}
            />
        </WrapperNoScrollNoDialogNoSafeArea>
    );




}
