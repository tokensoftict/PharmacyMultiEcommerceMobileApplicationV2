import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";
import LoginService from "./LoginService.tsx";
import {store} from "@/redux/store/store.tsx";

export default class SignUpService {

    request : Request
    authSessionService : AuthSessionService
    loginService : LoginService
    constructor() {
        this.request = new Request();
        this.authSessionService = new AuthSessionService();
        this.loginService = new LoginService();
    }

    signUp(firstname : string, lastname : string, email :string, password : string, phone : string) {
        let parent = this;
        return new Promise(function (resolve : any, reject : any){
            parent.request.post("signup", {
                email : email,
                password : password,
                phone : phone,
                firstname : firstname,
                lastname : lastname,
                deviceKey : store.getState().systemReducer.fireBaseKey
            })
                .then(function (response : any){
                    if(response.data.status === true){
                        if((response?.data?.data?.trashed ?? false)){
                            parent.authSessionService.setTrashedUserData(response?.data?.data?.user)
                            resolve({
                                status : true,
                                trashed : true,
                                user : response?.data?.data?.user,
                                message : "Sign up Successful"
                            })
                        } else {
                            resolve(parent.loginService.prepareSignupSession(response.data))
                        }
                    }else{
                        resolve(
                            parent.parseError(response.data)
                        )
                    }
                }, function (error) {
                    reject(error)
                });
        });
    }

    parseError(error: any)
    {
        const errorParse = {
            email : false,
            password : false,
            firstname : false,
            lastname : false,
            phone : false,
            message : false,
            status : false
        }

        if(error.hasOwnProperty('error') && error.error.hasOwnProperty('email')){
            errorParse.email = error.error.email.join("\\n");
        }

        if(error.hasOwnProperty('error') && error.error.hasOwnProperty('password')){
            errorParse.password = error.error.password.join("\\n");
        }

        if(error.hasOwnProperty('error') && error.error.hasOwnProperty('firstname')){
            errorParse.firstname = error.error.firstname.join("\\n");
        }

        if(error.hasOwnProperty('error') && error.error.hasOwnProperty('lastname')){
            errorParse.lastname = error.error.lastname.join("\\n");
        }

        if(error.hasOwnProperty('error') && error.error.hasOwnProperty('phone')){
            errorParse.phone = error.error.phone.join("\\n");
        }

        if(!errorParse.password && !errorParse.email){
            errorParse.message = error.message
        }

        return errorParse;
    }


    updateAccount(firstname : string, lastname : string) {
        let parent = this;
        return new Promise(function (resolve : any, reject : any){
            parent.request.post("update", {
                firstname : firstname,
                lastname : lastname,
            })
                .then(function (response : any){
                    if(response.data.status === true){
                        if((response?.data?.data?.trashed ?? false)){
                            parent.authSessionService.setTrashedUserData(response?.data?.data?.user)
                            resolve({
                                status : true,
                                trashed : true,
                                user : response?.data?.data?.user,
                                message : "Your Profile has been updated successfully. 👋'"
                            })
                        } else {
                            resolve(parent.loginService.prepareUserSession(response.data))
                        }
                    }else{
                        resolve(
                            parent.parseError(response.data)
                        )
                    }
                }, function (error) {
                    reject(error)
                });
        });
    }
}
