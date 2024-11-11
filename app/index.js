import { View } from "react-native";
import Login from "../pages/login";
import { StyleSheet } from "react-native";
// import { useFonts } from "expo-font";

export default function index() {


  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
