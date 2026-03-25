
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class PopupService {

    request : EnvironmentRequestInterface

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
    }

    getPopups() {
        return this.request.get("pop-ups/list");
    }

}
