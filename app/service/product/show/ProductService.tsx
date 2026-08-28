import AuthSessionService from "../../../service/auth/AuthSessionService";
import EnvironmentRequest, { EnvironmentRequestInterface } from "@/network/internet/EnvironmentRequest.tsx";
import WholesalesRequest from "@/network/internet/WholesalesRequest.tsx";
import SupermarketRequest from "@/network/internet/SupermarketRequest.tsx";

export default class ProductService {

    request: EnvironmentRequestInterface;
    authSessionService: AuthSessionService;

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    getProduct(identifier: number | string, department?: 'wholesales' | 'retail') {
        let req = this.request;
        if (department === 'wholesales') {
            req = new WholesalesRequest();
        } else if (department === 'retail') {
            req = new SupermarketRequest();
        }
        return req.get("stock/" + identifier + "/show");
    }

    scanProduct(code: string) {
        return this.request.get("stock/scan/" + code);
    }

}
