import salesRepresentativeAxiosInstance from "../interceptors/salesrepresentativesinterceptor";
import {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";

export default class SalesRepresentativesRequest implements EnvironmentRequestInterface{

    /**
     *
     * @param endpoint
     * @param data
     */
    post(endpoint: string,  data: any)
    {
        return salesRepresentativeAxiosInstance.post(endpoint, data)
    }

    /**
     *
     * @param endpoint
     */
    get(endpoint: string)
    {
        return salesRepresentativeAxiosInstance.get(endpoint)
    }

    /**
     *
     * @param endpoint
     * @param data
     */
    put(endpoint: string, data: any)
    {
        return salesRepresentativeAxiosInstance.put(endpoint, data);
    }

    /**
     *
     * @param endpoint
     */
    remove(endpoint : string)
    {
        return salesRepresentativeAxiosInstance.delete(endpoint);
    }

}
