import AuthSessionService from "../../service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";
import CampaignEventBus from "@/campaign/CampaignEventBus";


export default class WishlistService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }


    async add(productId: number|undefined) {
        try {
            const response = await this.request.post("wishlist/add-item", {stock_id : productId});
            if (response?.data?.status === true || response?.status === 200) {
                CampaignEventBus.emit('ADD_TO_WISHLIST', { product_id: productId });
            }
            return response;
        } catch (error) {
            throw error;
        }
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
