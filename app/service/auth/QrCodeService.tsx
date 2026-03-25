import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";

export default class QrCodeService
{
    request : Request
    authSessionService : AuthSessionService

    constructor() {
        this.request = new Request();
        this.authSessionService = new AuthSessionService()
    }

    qrCode(id : string | number) {
        return this.request.get("my-qrcode?id="+id);
    }

}
