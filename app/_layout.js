import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { StyleSheet } from "react-native";

export default function layout() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Stack
          screenOptions={{ title: "", headerShown: false }}/>
      </View>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
