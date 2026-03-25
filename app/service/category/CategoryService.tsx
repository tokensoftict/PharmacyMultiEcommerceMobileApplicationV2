import AuthSessionService from "../auth/AuthSessionService.tsx";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class CategoryService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    getCategories( page: number, search : string) {
        if(search.length > 3){
            return this.request.get("general/product_categories?page="+page+'&s='+search);
        }
        return this.request.get("general/product_categories?page="+page);
    }

}
