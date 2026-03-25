import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";

export default class Security
{
    request : Request
    authSessionService : AuthSessionService

    constructor() {
        this.request = new Request();
        this.authSessionService = new AuthSessionService()
    }


    changePassword(
        oldPassword: string,
        newPassword: string,
        confirmPassword: string
    ){

        return this.request.post('change-password',
            {
                old_password: oldPassword,
                password: newPassword,
                password_confirmation: confirmPassword
            }
            )

    }


    deleteMyAccount(user_id: string | number)
    {
        return this.request.get("delete-my-account?user_id=" + user_id)
    }

    restoreMyAccount(user_id: string | number)
    {
        return this.request.get("restore-my-account?user_id=" + user_id)
    }
    
}
