import superMarketAxiosInstance from "../interceptors/supermarkeInterceptors";
import {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";

export default class SupermarketRequest implements EnvironmentRequestInterface{

    /**
     *
     * @param endpoint
     * @param data
     */
    post(endpoint: string,  data: any)
    {
        return superMarketAxiosInstance.post(endpoint, data)
    }

    /**
     *
     * @param endpoint
     */
    get(endpoint: string)
    {
        return superMarketAxiosInstance.get(endpoint)
    }

    /**
     *
     * @param endpoint
     * @param data
     */
    put(endpoint: string, data: any)
    {
        return superMarketAxiosInstance.put(endpoint, data);
    }

    /**
     *
     * @param endpoint
     */
    remove(endpoint : string)
    {
        return superMarketAxiosInstance.delete(endpoint);
    }

}
