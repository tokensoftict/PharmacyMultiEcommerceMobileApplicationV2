import AsyncStorage from "@react-native-async-storage/async-storage";
import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";

export default class OtpService
{
    request : Request
    authSessionService : AuthSessionService

    constructor() {
        this.request = new Request();
        this.authSessionService = new AuthSessionService()
    }


    /**
     *
     * @param otp
     * @param phone
     */
    validateOTP(otp: string, phone: string | undefined) {
        return this.request.post('verify-phone', {phone : phone, 'otp' : otp});
    }


    /**
     *
     * @param otp
     * @param email
     */
    validateEmailOTP(otp: string, email: string | undefined) {
        return this.request.post('verify-email', {email : email, 'otp' : otp});
    }

    /**
     *
     * @param phone
     */
    requestForOtp(phone: string|undefined){
        return this.request.post('resend-verification', {phone : phone});
    }

    requestForEmailOtp(email: string|undefined){
        return this.request.post('resend-verification', {email : email});
    }

    async getApps() {
        // Try loading from cache first for immediate UI
        const cached = await AsyncStorage.getItem("guest_apps_cache");
        if (cached) {
            this.authSessionService.setTempSession(JSON.parse(cached));
        }

        const response = await this.request.get('frontend-apps');
        if (response && response.data) {
            let tempSession = response.data;
            tempSession['loginStatus'] = false;
            await AsyncStorage.setItem("guest_apps_cache", JSON.stringify(tempSession));
            this.authSessionService.setTempSession(tempSession);
        }
    }

    async loadCachedApps() {
        const cached = await AsyncStorage.getItem("guest_apps_cache");
        if (cached) {
            this.authSessionService.setTempSession(JSON.parse(cached));
            return true;
        }
        return false;
    }
}
