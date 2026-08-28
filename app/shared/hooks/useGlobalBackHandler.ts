import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { navigationRef } from '@/shared/utils/NavigationService';

/**
 * useGlobalBackHandler
 *
 * Intercepts the Android hardware back-press at the global (App) level.
 *
 * Behaviour:
 *   - If the navigation stack CAN go back → let React Navigation handle it
 *     normally (the default behaviour — pop the current screen).
 *   - If the navigation stack CANNOT go back (i.e. we are at the root /
 *     no more screens in the stack) → navigate to the `storeSelector` screen
 *     instead of exiting the app.
 *
 * Usage:
 *   Call once from App.tsx, inside the NavigationContainer tree.
 *
 *   ```tsx
 *   function App() {
 *     useGlobalBackHandler();
 *     return <NavigationContainer>…</NavigationContainer>;
 *   }
 *   ```
 *
 * Notes:
 *   - This is Android-only (iOS has no hardware back button).
 *   - The handler runs BEFORE React Navigation's own BackHandler listener,
 *     so returning `true` prevents the default (exit) behaviour.
 */
export function useGlobalBackHandler() {
    useEffect(() => {
        if (Platform.OS !== 'android') {
            // iOS has no hardware back button — nothing to do
            return;
        }

        const onBackPress = (): boolean => {
            if (!navigationRef.isReady()) {
                // Navigator not ready yet — let the OS handle it
                return false;
            }

            if (navigationRef.canGoBack()) {
                // There is a screen to go back to — let React Navigation handle it
                return false;
            }

            // Stack is empty (or at root) — redirect to storeSelector instead of exiting
            navigationRef.reset({
                index: 0,
                routes: [{ name: 'storeSelector' }],
            });

            // Return true to prevent the default OS "exit app" behaviour
            return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => {
            subscription.remove();
        };
    }, []);
}
