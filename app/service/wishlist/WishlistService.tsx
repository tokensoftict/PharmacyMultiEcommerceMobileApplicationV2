import AuthSessionService from "../../service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class WishlistService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }


    add(productId: number|undefined) {
        return this.request.post("wishlist/add-item", {stock_id : productId});
    }

    remove(productId: number) {
        return this.request.get("wishlist/"+productId+"/remove-item");
    }

    clear() {
        return this.request.get("wishlist/clear");
    }

    get() {
        return this.request.get("wishlist/lists");
    }
}
