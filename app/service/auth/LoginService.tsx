import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";
import { store } from "@/redux/store/store.tsx";
import { scheduleNotification } from "@/shared/utils/ScheduleNotification.tsx";
import dayjs from "dayjs";
import notifee from "@notifee/react-native";
export default class LoginService {
    request: Request
    authSessionService: AuthSessionService
    constructor() {
        this.request = new Request();
        this.authSessionService = new AuthSessionService()
    }

    /**
     * @param email
     * @param password
     */
    login(email: string, password: string) {
        let parent = this;
        return new Promise(function (resolve: any, reject: any) {
            parent.request.post("login", { email: email, password: password, deviceKey: store.getState().systemReducer.fireBaseKey })
                .then(async function (response: any) {
                    if (response.data.status === true) {
                        if ((response?.data?.data?.trashed ?? false)) {
                            parent.authSessionService.setTrashedUserData(response?.data?.data?.user)
                            resolve({
                                status: true,
                                trashed: true,
                                user: response?.data?.data?.user,
                                message: "Login Successful"
                            })
                        } else {
                            const requireVerificationField = response?.data?.data?.systemSettings.verifyField ?? 'phone_verified_status';
                            if (response?.data?.data[requireVerificationField] === false) {
                                resolve(parent.prepareSignupSession(response.data));
                            } else {
                                await Promise.all(
                                    response.data.data.medSchedules.map(async (schedule: any) => {
                                        const notificationId = await scheduleNotification(
                                            schedule.id,
                                            schedule.drugName,
                                            schedule.dosage,
                                            schedule.dosage_form,
                                            // @ts-ignore
                                            new Date(dayjs(schedule.js_date)).getTime(),
                                            schedule,
                                            "supermarket",
                                            "VIEW_MED_REMINDER",
                                        );
                                        return { [schedule.id]: notificationId };
                                    })
                                );
                                resolve(parent.prepareUserSession(response.data));
                            }
                        }
                    } else {
                        resolve(
                            parent.parseError({
                                status: false,
                                error: response.data.error,
                                message: response.data.message
                            })
                        )
                    }
                }, function (error) {
                    reject({ status: false, message: "Oops! Something went wrong with the connection, please try again" });
                });
        });
    }

    loginWithOutPassword(email: string) {
        return this.request.post("login_without_password", { email: email })
    }

    completeLoginWithoutPassword(email: string, otp: string) {
        let parent = this;
        return new Promise(function (resolve: any, reject: any) {
            parent.request.post("complete_login", { email: email, otp: otp, deviceKey: store.getState().systemReducer.fireBaseKey })
                .then(async function (response: any) {
                    if (response.data.status === true) {
                        if ((response?.data?.data?.trashed ?? false)) {
                            parent.authSessionService.setTrashedUserData(response?.data?.data?.user)
                            resolve({
                                status: true,
                                trashed: true,
                                user: response?.data?.data?.user,
                                message: "Login Successful"
                            })
                        } else {
                            const requireVerificationField = response?.data?.data?.systemSettings.verifyField ?? 'phone_verified_status';
                            if (response?.data?.data[requireVerificationField] === false) {
                                resolve(parent.prepareSignupSession(response.data));
                            } else {
                                await Promise.all(
                                    response.data.data.medSchedules.map(async (schedule: any) => {
                                        const notificationId = await scheduleNotification(
                                            schedule.id,
                                            schedule.drugName,
                                            schedule.dosage,
                                            schedule.dosage_form,
                                            // @ts-ignore
                                            new Date(dayjs(schedule.js_date)).getTime(),
                                            schedule,
                                            "supermarket",
                                            "VIEW_MED_REMINDER",
                                        );
                                        return { [schedule.id]: notificationId };
                                    })
                                );
                                resolve(parent.prepareUserSession(response.data));
                            }
                        }
                    } else {
                        resolve(
                            parent.parseError({
                                status: false,
                                error: response.data.error,
                                message: response.data.message
                            })
                        )
                    }
                }, function (error) {
                    reject({ status: false, message: "Oops! Something went wrong with the connection, please try again" });
                });
        });
    }

    async logout() {
        const response = await this.request.get("logout");
        if (response.data.status === true || response?.data.error === "Unauthenticated. Please login to continue.") {
            await new AuthSessionService().destroySession()
            const schedulesIDS = response.data.data ?? [];
            if (schedulesIDS.length > 0) {
                await Promise.all(
                    schedulesIDS.map(async (schedule: any) => {
                        await notifee.cancelNotification(schedule + "");
                    })
                )
            }
            return true;
        }
        return false;
    }

    me() {
        let parent = this;
        return new Promise(function (resolve: any, reject: any) {
            parent.request.get("me?deviceKey=" + store.getState().systemReducer.fireBaseKey)
                .then(function (response: any) {
                    if (response.data.status === true) {
                        resolve(parent.prepareUserSession(response.data))
                    } else {
                        resolve(
                            parent.parseError({
                                error: response.data.error,
                                message: response.data.message
                            })
                        )
                    }
                }, function (error) {
                    reject(error)
                });
        });
    }

    parseError(error: any) {
        const errorParse = {
            email: false,
            password: false,
            otp: false,
            message: false,
            status: false
        }

        if (error.hasOwnProperty('error') && error.error.hasOwnProperty('email')) {
            errorParse.email = error.error.email.join("\\n");
        }

        if (error.hasOwnProperty('error') && error.error.hasOwnProperty('password')) {
            errorParse.password = error.error.password.join("\\n");
        }

        if (error.hasOwnProperty('error') && error.error.hasOwnProperty('otp')) {
            errorParse.otp = error.error.otp.join("\\n");
        }

        if (!errorParse.password && !errorParse.email) {
            errorParse.message = error.message
        }

        return errorParse;
    }

    prepareUserSession(response: any): object {
        response['loginStatus'] = true;
        this.authSessionService.setAuthSession(response);
        return {
            status: true,
            message: "Login Successful"
        }
    }

    prepareSignupSession(response: any): object {
        response['loginStatus'] = true;
        this.authSessionService.setTempSession(response);
        return {
            status: true,
            message: "Login Successful"
        }
    }

}
