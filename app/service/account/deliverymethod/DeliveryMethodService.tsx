import AuthSessionService from "@/service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class DeliveryMethodService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    listDeliveryMethod(){
        return this.request.get(`general/delivery_method`);
    }

    setDeliveryAsDefault(id: number | string){
        return this.request.get(`general/${id}/delivery_method`);
    }
}
