import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";

export default class ResetPasswordService {

    request : Request
    authSessionService : AuthSessionService

    constructor() {
        this.request = new Request();
        this.authSessionService = new AuthSessionService()
    }

    /**
     *
     * @param email_or_phone
     */
    resetPasswordRequest(email_or_phone : String) {
        return this.request.post("forgot-password", {"email_or_phone" : email_or_phone});
    }

    /**
     *
     * @param phone
     * @param pin
     * @param password
     * @param confirm_password
     */
    resetPassword(phone : string, pin : string, password : string, confirm_password : string){
        return this.request.post("reset-password",{
            phone : phone,
            pin : pin,
            password : password,
            password_confirmation : confirm_password,
        });
    }
}
