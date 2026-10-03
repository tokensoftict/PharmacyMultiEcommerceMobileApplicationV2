import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";

export default class WholesalesProvisionsService {

    request : EnvironmentRequestInterface

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
    }

    load(category?: string, page: number = 1){
        const query = `page=${page}` + (category ? `&category=${category}` : "");
        return this.request.get(`general/provisions?${query}`);
    }
}
