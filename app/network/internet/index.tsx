import axios, { AxiosInstance } from 'axios';
import { setInternetContextGetter } from "@/network/internet/internetContextBridge.ts";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import { navigate, reset } from "@/shared/utils/NavigationService";

const MAX_RETRIES = 3;

export const axiosInstance = axios.create();
export const wholesalesAxiosInstance = axios.create();
export const superMarketAxiosInstance = axios.create();
export const salesRepresentativeAxiosInstance = axios.create();


export function attachInterceptors(instance: AxiosInstance) {
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const config = error.config;
            const internet = setInternetContextGetter();

            // Handle Retry Logic for network errors/timeouts
            // Only retry for network-level issues where no response was received (e.g. Connection refused, Timeout)
            if (!error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error') {
                // @ts-ignore
                config.__retryCount = config.__retryCount || 0;

                // @ts-ignore
                if (config.__retryCount < MAX_RETRIES) {
                    // @ts-ignore
                    config.__retryCount += 1;
                    console.log(`Retrying request... attempt ${config.__retryCount}`);
                    return instance(config);
                }

                // If retries exhausted, show "Connection Issue" dialog and reject
                internet?.showDialog?.();
                return Promise.reject({
                    data: {
                        status: false,
                        error: "We're having trouble connecting. Please check your network and try again.",
                    },
                });
            }

            const status = error.response.status;
            const responseData = error.response.data;

            // Handle 401 Unauthorized (Specific "Unauthenticated" message)
            if (status === 401 && responseData?.error === "Unauthenticated. Please login to continue.") {
                const authService = new AuthSessionService();
                await authService.destroySession();
                reset('login');
                return Promise.reject({
                    data: {
                        status: false,
                        error: "Your session has expired. Please login again to continue.",
                    },
                });
            }

            // Server errors (5xx) -> Show Dialog with "Try Again"
            if (status >= 500) {
                internet?.showErrorDialog?.({
                    title: "Server Error",
                    message: "Something went wrong on our end. Please try again later.",
                    onRetry: () => instance(config) // Manual retry when user clicks "Try Again"
                });
                // We return a permanent rejection here, but the dialog allows the user to re-trigger the call
                return Promise.reject({
                    data: { status: false, error: "Internal Server Error" }
                });
            }

            // Normal status handling
            switch (status) {
                case 422:
                    return Promise.resolve({
                        data: { status: false, error: responseData?.error || "Validation failed. Please check your input." },
                    });
                case 404:
                    return Promise.resolve({
                        data: { status: false, error: "The requested resource was not found." },
                    });
                case 401:
                case 400:
                    return Promise.resolve({
                        data: { status: false, error: responseData?.error || "Invalid request. Please try again." },
                    });
                default:
                    return Promise.reject({
                        data: {
                            status: false,
                            error: "Something went wrong. Please try again later.",
                        },
                    });
            }
        }
    );
}
