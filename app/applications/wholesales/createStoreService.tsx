import axios from "axios";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import {UserProfile} from "@/service/auth/interfaces/UserProfile.tsx";
import {WHOLESALES_URL} from "@env";

const createStoreRequest = axios.create();

createStoreRequest.interceptors.request.use( async function (request) {

    request.baseURL = WHOLESALES_URL;
    request.headers['Content-Type'] = 'multipart/form-data';

    const authSession = new AuthSessionService();

    const userSession: UserProfile = await authSession.getAuthSession();

    if (userSession.loginStatus) {
        const token = userSession.data?.token;
        if(token) {
            request.headers.Authorization =  'Bearer ' +token.access_token;
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



    return request;
}, function (error) {
    return Promise.reject(error);
});


createStoreRequest.interceptors.response.use((response) => response, (error) => {
    // whatever you want to do with the error\
    switch (error.response.status) {
        case 422:
            return Promise.resolve({
                data : {
                    status : false,
                    error : error.response.data?.error
                }
            })
            break;
        case 404:
            return Promise.resolve({
                data : {
                    status : false,
                    error : "Unknown resources, requested"
                }
            })
        case 401:
            return Promise.resolve({
                data : {
                    status : false,
                    error : error.response.data?.error
                }
            })
            break;
        case 400:
            return Promise.resolve({
                data : {
                    status : false,
                    error : error.response.data?.error
                }
            })
        default:
            return Promise.reject({
                data : {
                    status : false,
                    error : "Unknown error occurred, Please try again"
                }
            })
    }
});

export default createStoreRequest;
