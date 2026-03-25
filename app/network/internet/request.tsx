import axiosInstance from "../interceptors/interceptors";

export default class Request{

    /**
     *
     * @param endpoint
     * @param data
     */
    post(endpoint: string,  data: any)
    {
        return axiosInstance.post(endpoint, data)
    }

    /**
     *
     * @param endpoint
     */
    get(endpoint: string)
    {
        return axiosInstance.get(endpoint)
    }

    /**
     *
     * @param endpoint
     * @param data
     */
    put(endpoint: string, data: any)
    {
        return axiosInstance.put(endpoint, data);
    }

    /**
     *
     * @param endpoint
     */
    remove(endpoint : string)
    {
        return axiosInstance.delete(endpoint);
    }

}
