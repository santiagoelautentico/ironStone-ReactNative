import {
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCoins } from "../redux/slices/coinsReducer.js";
import { setTransactions } from "../redux/slices/transactionReducer.js";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TotalInvested from "../components/TotalInvested.jsx";
import Transaction from "../components/Transaction.jsx";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Home = () => {
  const name = useSelector((state) => state.login.username);
  const userId = useSelector((state) => state.login.userId);
  const apiKey = useSelector((state) => state.login.apiKey);
  const dispatch = useDispatch();

  const snapPoints = useMemo(() => ["25%", "50%"], []);

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

  // const transactions = useSelector((state) => state.transactions.transactions);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="face-man-profile"
            size={24}
            color="black"
          />
          <Text style={styles.nameUser}>{name}</Text>
        </View>
        <TotalInvested />
        <View style={styles.containerButtons}>
          <LinearGradient
            colors={["#3740DD", "#545BE7"]}
            style={styles.gradientBuy}
          >
            <TouchableHighlight>
              <Text style={styles.textButton}>Comprar</Text>
            </TouchableHighlight>
          </LinearGradient>
          <LinearGradient
            colors={["#1F1F1F", "#000000"]}
            style={styles.gradientSell}
          >
            <TouchableHighlight>
              <Text style={styles.textButton}>Vender</Text>
            </TouchableHighlight>
          </LinearGradient>
        </View>
        <Text style={styles.title}>Historial de transacciones</Text>
        {/* {transactions.map(
          (transaction) => (
            console.log(transaction),
            (<Transaction key={transaction.id} transaction={transaction} />)
          )
        )} */}
      </ScrollView>
      <BottomSheet snapPoints={snapPoints}>
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    gap: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: "grey",
  },
  nameUser: {
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  containerButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "100%",
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
    paddingVertical: 20,
    alignItems: "center",
  },
  gradientSell: {
    width: "48%",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    paddingVertical: 20,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
});

export default Home;
