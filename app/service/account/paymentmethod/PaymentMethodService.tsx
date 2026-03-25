import AuthSessionService from "@/service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class PaymentMethodService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    listPaymentMethod(){
        return this.request.get(`general/payment_method`);
    }

    setPaymentAsDefault(id: number | string){
        return this.request.get(`general/${id}/payment_method`);
    }
}
