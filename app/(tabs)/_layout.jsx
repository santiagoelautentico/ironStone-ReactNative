import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default () => {
  return (
    <Tabs
      style={styles.container}
      screenOptions={{
        tabBarStyle: { backgroundColor: "black", borderTopWidth: 0 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={24}
              color="#3740DD"
              style={{ color: focused ? "#3740DD" : "gray" }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          headerBlurEffect: true,
          headerTransparent: true,
          headerTitle: "Graficos",
          headerTitleStyle: { color: "white" },
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="chart-line"
              size={24}
              color="#3740DD"
              style={{ color: focused ? "#3740DD" : "gray" }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerBlurEffect: true,
          headerTransparent: true,
          headerTitle: "Notificaciones",
          headerTitleStyle: { color: "white" },
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="bell" size={24} color="#3740DD" style={{ color: focused ? "#3740DD" : "gray" }} />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#171717",
  },
});
