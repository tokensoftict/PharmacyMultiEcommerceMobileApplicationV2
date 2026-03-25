import AuthSessionService from "../auth/AuthSessionService.tsx";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";

export default class CheckoutService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    getCheckoutAddress() {
        return this.request.get("address/list");
    }

    getCheckoutDelivery() {
        return this.request.get("checkout/delivery_methods");
    }

    getCheckoutPaymentMethod() {
        return this.request.get("checkout/payment_methods");
    }

    getConfirmOrder() {
        return this.request.get("checkout/confirm_order");
    }

    saveCheckoutAddress(addressId : string)
    {
        return this.request.post("checkout/save_delivery_address_id", {deliveryAddressId : addressId});
    }


    saveCheckDeliveryMethod(delivery:any)
    {
        return this.request.post("checkout/save_delivery_method", delivery);
    }

    saveCheckoutPaymentMethod(paymentMethod:any)
    {
        return this.request.post("checkout/save_payment_method", {paymentMethod: paymentMethod});
    }

    removeOrAddOrderTotal(order_total_id : number)
    {
        return this.request.post("checkout/remove_order_total", {order_total_id : order_total_id});
    }

    completeOrder(reference? : string)
    {
        if(reference) {
            return this.request.get("checkout/confirm_payment?reference=" + reference);
        } else {
            return this.request.get("checkout/confirm_payment");
        }
    }


    getPayStackTransactionData() {
        return this.request.get("checkout/create_transaction_log");
    }


    getDoorStepDelivery()  {
       return this.request.get("checkout/door_step_delivery_analysis");
    }

    applyCouponCode(code: string) {
        return this.request.post("checkout/apply_coupon", {code : code});
    }

    removeCouponOrVoucher() {
        return this.request.get("checkout/remove_coupon");
    }
}
