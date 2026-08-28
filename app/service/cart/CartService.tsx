import AuthSessionService from "../../service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";
import Environment from "@/shared/utils/Environment.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import CampaignEventBus from "@/campaign/CampaignEventBus";

export default class CartService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    add(productId: number|undefined , quantity: number, accept_dependent: boolean = false, options: number[] = []) {
        if(Environment.isLogin()) {
            CampaignEventBus.emit('ADD_TO_CART', { product_id: productId, quantity });
            return this.request.post("cart/add-item", {stock_id : productId, quantity : quantity, accept_dependent : accept_dependent, options: options});
        }
        Toasts('Please login to add item to cart..')
        return   Promise.resolve({
            data : {
                status : false,
                error : "Unknown error occurred, Please try again"
            }
        })
    }

    remove(productId: number) {
        CampaignEventBus.emit('REMOVE_FROM_CART', { product_id: productId });
        return this.request.get("cart/"+productId+"/remove-item");
    }

    clear() {
        return this.request.get("cart/clear");
    }

    get() {
        return this.request.get("cart/lists");
    }
}
