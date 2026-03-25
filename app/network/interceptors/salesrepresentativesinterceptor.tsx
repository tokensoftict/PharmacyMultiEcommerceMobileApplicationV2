import { attachInterceptors, salesRepresentativeAxiosInstance } from '../internet';
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import { UserProfile } from "@/service/auth/interfaces/UserProfile.tsx";
import { SALES_REP_URL } from '@env';
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

salesRepresentativeAxiosInstance.interceptors.request.use(async function (request) {

    request.baseURL = SALES_REP_URL;
    request.headers['Content-Type'] = 'multipart/form-data';



    const authSession = new AuthSessionService();
    const userSession: UserProfile = await authSession.getAuthSession();
    if (userSession.loginStatus) {
        const token = userSession.data?.token;
        if (token) {
            request.headers.Authorization = 'Bearer ' + token.access_token;

        }
    }

    request.transformRequest = [
        function (data) {
            let form_data = new FormData();
            if (!(data instanceof FormData)) {
                for (let key in data) {
                    if (typeof data[key] === 'object') {
                        form_data.append(key, JSON.stringify(data[key]));
                    } else {
                        form_data.append(key, data[key]);
                    }
                }
            } else {
                form_data = data;
            }
            return form_data;
        },
    ];


    const version = DeviceInfo.getVersion();
    request.params = { ...request.params, device: 'mobile' };
    request.params = { ...request.params, deviceType: Platform.OS };
    request.params = { ...request.params, version: version };


    return request;
}, function (error) {
    return Promise.resolve({
        data: {
            status: false,
            error: "There was error while processing request, please try again.",
        }
    });
});

attachInterceptors(salesRepresentativeAxiosInstance);

export default salesRepresentativeAxiosInstance;
