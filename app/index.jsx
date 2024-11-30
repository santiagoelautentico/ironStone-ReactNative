import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  setApiKey,
  setUsername,
  setUserId,
  cleanUsername,
  cleanApiKey,
} from "../redux/slices/loginSlice.js";
import { useDispatch } from "react-redux";
import { router } from "expo-router";

const index = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  function loginAction() {
    fetch("https://crypto.develotion.com/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: user,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al iniciar sesión");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setApiKey(data.apiKey));
        dispatch(setUsername(user));
        dispatch(setUserId(data.id));
        router.push("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
        console.log(user, password, "me llega la info");
      });
  }
  const handleSubmit = () => {
    dispatch(cleanUsername());
    dispatch(cleanApiKey());
    loginAction();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.formInput}>
        <Text style={styles.label}>User</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          value={user}
          onChangeText={(text) => setUser(text)}
        />
      </View>

      <View style={styles.formInput}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Button title="Login" onPress={handleSubmit} color="#007bff" />

      <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
        <Text style={styles.link}>No tienes cuenta? Registrate</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  formInput: {
    marginBottom: 15,
    color: "white",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    color: "white",
  },
  link: {
    marginTop: 15,
    color: "#007bff",
    textAlign: "center",
    textDecorationLine: "underline",
    color: "white",
  },
});

export default index;
