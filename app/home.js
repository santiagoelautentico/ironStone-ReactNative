import { ScrollView, Text, View, TouchableHighlight } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCoins } from "../redux/slices/coinsReducer.js";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { setTransactions } from "../redux/slices/transactionReducer.js";
import TotalInvested from "../components/TotalInvested.jsx";
import { LinearGradient } from "expo-linear-gradient";

const home = () => {
  const name = useSelector((state) => state.login.username);
  const userId = useSelector((state) => state.login.userId);
  const apiKey = useSelector((state) => state.login.apiKey);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://crypto.develotion.com/monedas.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apiKey: apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setCoins(data.monedas));
        return fetch(
          `https://crypto.develotion.com/transacciones.php?idUsuario=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              apiKey: apiKey,
            },
          }
        );
      })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setTransactions(data.transacciones));
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 60,
        paddingHorizontal: 40,
        gap: 20,
      }}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="face-man-profile"
          size={24}
          color="black"
        />
        <Text style={styles.title}>{name}</Text>
      </View>
      <TotalInvested />
      <View style={styles.containerButtons}>
        <LinearGradient colors={["#3740DD", "#545BE7"]} style={styles.gradientBuy}>
          <TouchableHighlight>
            <Text style={styles.textButton}>Comprar</Text>
          </TouchableHighlight>
        </LinearGradient>
        <LinearGradient colors={["#1F1F1F", "#000000"]} style={styles.gradientSell}>
          <TouchableHighlight>
            <Text style={styles.textButton}>Vender</Text>
          </TouchableHighlight>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
  },
  containerButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    maxWidthwidth: "100%",
  },
 
  textButton: {
    color: "white",
    fontSize: 18,
  },
  gradientBuy: {
    width: "48%",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    color: "white",
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: "center",
  },
  gradientSell: {
    width: "48%",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    color: "white",
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: "center",
  },
});
export default home;
