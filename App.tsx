import { useEffect } from "react";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { store } from "./src/store";
import AppNavigator from "./src/navigation";
import { initializeFirebase } from "./src/services/firebase";
import { initAuthListener } from "./src/slices/authSlice";
import useTimerRecovery from "./src/hooks/useTimerRecovery";

initializeFirebase();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

function AppContent() {
  useTimerRecovery();

  useEffect(() => {
    store.dispatch(initAuthListener());
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
}
