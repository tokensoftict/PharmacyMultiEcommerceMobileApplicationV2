import AuthSessionService from "@/service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class AddressService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    listStates() {
        return this.request.get(`general/160/states`);
    }

    listLocalGovt(state_id : number|undefined) {
        return this.request.get(`general/${state_id}/lgas`);
    }

    listTown(lga_id : number|undefined) {
        return this.request.get(`general/${lga_id}/towns`);
    }

    /**. Address Crud Operation State here  **/

    listAddresses() {
        return this.request.get(`address/list`);
    }

    getAddress(id: number | string) {
        return this.request.get(`address/${id}/show`);
    }

    removeAddress(id: number) {
        return this.request.get(`address/${id}/remove`);
    }

    setAddressHasDefault(id: number | string) {
        return this.request.get(`address/${id}/set_as_default`);
    }

    saveAddress(data: any, id: string | number | undefined) {
        if(!id) {
            return this.request.post(`address/create`, data);
        }
        return this.request.post(`address/${id}/update`, data);
    }


    notifications() {
        return this.request.get("general/notifications");
    }
    /**. Address Crud Operation State here  **/
}
