import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function requestNotificationPermissions() {
  const settings = await Notifications.requestPermissionsAsync();
  return settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function scheduleTimerCompleteNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Pomodoro complete",
      body: "Time to switch your focus or take a break.",
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH
    },
    trigger: null
  });
}

export function configureNotificationHandling() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false
    })
  });

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default"
    });
  }
}
