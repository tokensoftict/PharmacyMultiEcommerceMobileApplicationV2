import AuthSessionService from "../../../../service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class ProductListService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    getProduct(endpoint : string, page : number, search : string = "", sort : string = ""){
        const searchQuery = search.trim() ? "&search=" + encodeURIComponent(search.trim()) : "";
        const sortQuery = sort ? "&sort=" + encodeURIComponent(sort) : "";
        return this.request.get(endpoint+"?page="+page+searchQuery+sortQuery);
    }
}
