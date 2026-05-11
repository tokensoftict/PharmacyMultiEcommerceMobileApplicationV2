import AuthSessionService from "@/service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class OrderService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    list(orderType : string, page : number) {
        return this.request.get("order/lists?orderType="+orderType+"&page="+page);
    }

    get(orderId : any) {
        return this.request.get(`order/${orderId}/show`);
    }

    uploadProofOfPayment(orderId: any, file: any) {
        const formData = new FormData();
        formData.append('image', file);

        return this.request.post(`order/${orderId}/upload-proof`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}
