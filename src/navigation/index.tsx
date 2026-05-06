import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { useAppSelector } from "@hooks/useAppSelector";
import { RootState } from "@store";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const scheme = useColorScheme();
  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
