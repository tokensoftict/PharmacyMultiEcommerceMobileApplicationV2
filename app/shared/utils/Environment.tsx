import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

function isWholeSalesEnvironment(): boolean {
    return new AuthSessionService().getEnvironment() === "wholesales";
}

function isSuperMarketEnvironment(): boolean {
    return new AuthSessionService().getEnvironment() === "supermarket";
}

function isSalesRepresentativeEnvironment(): boolean {
    return new AuthSessionService().getEnvironment() === "sales_representative";
}

function getEnvironment() {
    return new AuthSessionService().getEnvironment();
}

function isLogin(): boolean {
    return new AuthSessionService().getAuthSession().loginStatus === true;
}

function getNotificationData() {
    const notification = new AuthSessionService().getLaunchPage();
    if(notification === "") return false
    const startUpPage = JSON.parse(new AuthSessionService().getLaunchPage());
    if(!startUpPage) return false;
    const med = startUpPage['extraData'];
    if(med) {
        new AuthSessionService().removeLaunchPage();
        return med;
    }
    return false;
}

function checkForImpersonateCustomerData() {
    return new AuthSessionService().getImpersonateCustomerData();
}


export default {
    isWholeSalesEnvironment : isWholeSalesEnvironment,
    isSuperMarketEnvironment : isSuperMarketEnvironment,
    isSalesRepresentativeEnvironment : isSalesRepresentativeEnvironment,
    getNotificationData : getNotificationData,
    isLogin : isLogin,
    checkForImpersonateCustomerData : checkForImpersonateCustomerData,
    getEnvironment : getEnvironment
}
