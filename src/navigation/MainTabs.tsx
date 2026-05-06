import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import TimerScreen from "@screens/TimerScreen";
import TasksScreen from "@screens/TasksScreen";
import StatsScreen from "@screens/StatsScreen";
import SettingsScreen from "@screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const ICONS: Record<string, React.ComponentProps<typeof MaterialIcons>["name"]> = {
  Timer: "timer",
  Tasks: "task",
  Stats: "insights",
  Settings: "settings"
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name={ICONS[route.name] ?? "circle"} size={size} color={color} />
        ),
        tabBarStyle: { backgroundColor: "#0f172a", borderTopColor: "#111827" },
        tabBarActiveTintColor: "#38bdf8",
        tabBarInactiveTintColor: "#94a3b8"
      })}
    >
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
