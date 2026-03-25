import AuthSessionService from "../auth/AuthSessionService.tsx";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class BrandService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    getBrands( page: number, search : string) {
        if(search.length > 3) {
            return this.request.get("general/product_manufacturers?page=" + page+'&s='+search);
        } else {
            return this.request.get("general/product_manufacturers?page=" + page);
        }
    }

    getBrandList() {
        return this.request.get("general/manufacturers");
    }

}
