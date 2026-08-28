/**
 * AppUpdateProvider.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * • Intercepts every Axios response from ALL configured instances.
 * • Reads the `app_update` payload injected by the Laravel middleware.
 * • Shows the update dialog ONCE per app launch if has_update === true.
 * • For force updates the dismiss button is hidden and the user must update.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    axiosInstance,
    wholesalesAxiosInstance,
    superMarketAxiosInstance,
    salesRepresentativeAxiosInstance,
} from '@/network/internet';
import AppUpdateDialog, { AppUpdateInfo } from '@/shared/component/appUpdateDialog';

interface AppUpdateContextType {
    updateInfo: AppUpdateInfo | null;
    showUpdateDialog: () => void;
}

const AppUpdateContext = createContext<AppUpdateContextType>({
    updateInfo: null,
    showUpdateDialog: () => {},
});

export const useAppUpdate = () => useContext(AppUpdateContext);

/**
 * AppUpdateProvider
 * Wraps the whole app and injects an Axios response interceptor that watches
 * for the `app_update` field. Shows the dialog once per launch.
 */
export const AppUpdateProvider = ({ children }: { children: React.ReactNode }) => {
    const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    /**
     * Track whether we have already shown the dialog this session.
     * We use a ref so it is reset on every app re-launch (cold start).
     */
    const hasShownThisLaunch = useRef(false);

    /**
     * Handles the update info extracted from any API response.
     * Only shows the dialog once per launch.
     */
    const handleUpdateInfo = useCallback((info: AppUpdateInfo) => {
        if (!info?.has_update) return;
        if (hasShownThisLaunch.current) return;

        setUpdateInfo(info);
        setDialogVisible(true);
        hasShownThisLaunch.current = true;
    }, []);

    /**
     * Programmatically show the dialog (e.g. from a settings page).
     */
    const showUpdateDialog = useCallback(() => {
        if (!updateInfo?.has_update) return;
        setDialogVisible(true);
    }, [updateInfo]);

    const handleDismiss = useCallback(() => {
        // Only allow dismiss if it is not a force update
        if (updateInfo?.force_update) return;
        setDialogVisible(false);
    }, [updateInfo]);

    /**
     * Attach a response interceptor to every Axios instance used in the app.
     * The interceptor is read-only — it never modifies the response.
     */
    useEffect(() => {
        const instances = [
            axiosInstance,
            wholesalesAxiosInstance,
            superMarketAxiosInstance,
            salesRepresentativeAxiosInstance,
        ];

        const interceptorIds: { instance: typeof axiosInstance; id: number }[] = [];

        instances.forEach((instance) => {
            const id = instance.interceptors.response.use(
                (response) => {
                    try {
                        const appUpdate: AppUpdateInfo | undefined = response?.data?.app_update;
                        if (appUpdate?.has_update) {
                            handleUpdateInfo(appUpdate);
                        }
                    } catch {
                        // Never crash the app due to update checks
                    }
                    return response;
                },
                (error) => Promise.reject(error)
            );
            interceptorIds.push({ instance, id });
        });

        // Clean up interceptors when the provider unmounts
        return () => {
            interceptorIds.forEach(({ instance, id }) => {
                instance.interceptors.response.eject(id);
            });
        };
    }, [handleUpdateInfo]);

    return (
        <AppUpdateContext.Provider value={{ updateInfo, showUpdateDialog }}>
            {children}

            <AppUpdateDialog
                visible={dialogVisible}
                updateInfo={updateInfo}
                onDismiss={handleDismiss}
            />
        </AppUpdateContext.Provider>
    );
};
