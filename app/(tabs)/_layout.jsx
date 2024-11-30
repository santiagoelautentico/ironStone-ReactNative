import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

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
              style={{ color: focused ? '#3740DD' : 'gray' }} // Cambia la opacidad aquí
            />
          ),
        }}
      />
      <Tabs.Screen name="charts" />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#171717",
  },
});
