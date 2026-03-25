import { attachInterceptors, wholesalesAxiosInstance } from '../internet';
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import { UserProfile } from "@/service/auth/interfaces/UserProfile.tsx";
import { WHOLESALES_URL } from '@env';
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

wholesalesAxiosInstance.interceptors.request.use(async function (request) {

    request.baseURL = WHOLESALES_URL;
    request.headers['Content-Type'] = 'multipart/form-data';

    const authSession = new AuthSessionService();

    const userSession: UserProfile = await authSession.getAuthSession();

    if (userSession.loginStatus) {
        const token = userSession.data?.token;

        // @ts-ignore
        if (token.access_token) {
            // @ts-ignore
            request.headers.Authorization = 'Bearer ' + token.access_token;
        }
    }

    if (authSession.getImpersonateCustomerData() !== false) {
        const customerBeenImpersonated = authSession.getImpersonateCustomerData();
        request.headers['impersonation-wholesales-id'] = customerBeenImpersonated.id;
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
    return Promise.reject(error);
});


attachInterceptors(wholesalesAxiosInstance);

export default wholesalesAxiosInstance;
