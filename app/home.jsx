import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCoins } from "../redux/slices/coinsReducer.js";
import {
  setTransactions,
  addTransaction,
} from "../redux/slices/transactionReducer.js";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TotalInvested from "../components/TotalInvested.jsx";
import Transaction from "../components/Transaction.jsx";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native";
import { Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";

const Home = () => {
  const headerHeight = useHeaderHeight();

  const username = useSelector((state) => state.login.username);
  const userId = useSelector((state) => state.login.userId);
  const apiKey = useSelector((state) => state.login.apiKey);
  const coins = useSelector((state) => state.coins.coins);
  const transactions = useSelector((state) => state.transactions.transactions);

  const dispatch = useDispatch();

  const [cantCoin, setCantCoin] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("");
  const [handleTrasacction, setHandleTransaction] = useState(0);
  const [msgTotal, setMsjTotal] = useState("");

  const bgTop = require("../assets/backgroundTop.png");

  const snapPoints = useMemo(() => ["50%"], []);

  const bottomSheetRef = useRef(null);

  const handleOpenModal = () => bottomSheetRef.current?.expand();
  const handleCloseModal = () => bottomSheetRef.current?.close();

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

  const handlerValue = (text) => {
    const value = Number(text);
    setCantCoin(value);
    console.log(value, "cantCoin");
    const selectedCoinData = coins.find(
      (coin) => coin.id === parseInt(selectedCoin)
    );
    setMsjTotal(selectedCoinData ? selectedCoinData.cotizacion * value : 0);
    console.log(msgTotal, "msgTotal");
  };
  const handlerBuy = () => {
    const cant = Number(cantCoin);
    let trasactionFetch = {
      idUsuario: userId,
      tipoOperacion: handleTrasacction,
      moneda: Number(selectedCoin),
      cantidad: cant,
      valorActual: msgTotal,
    };

    console.log(msgTotal, "total");

    if (cant === 0 || selectedCoin === 0 || handleTrasacction === 0) {
      console.log("Error en la compra");
    } else {
      fetch("https://crypto.develotion.com/transacciones.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: apiKey,
        },
        body: JSON.stringify(trasactionFetch),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data, "compra realizada");
          dispatch(addTransaction(trasactionFetch));
          handleCloseModal();
        });
    }
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#171717" }}>
        <View style={{ flex: 1, flexGrow: 1 }}>
          <Image source={bgTop} />
        </View>
        <ScrollView style={{ paddingTop: headerHeight }}>
          <Stack.Screen
            options={{
              headerBlurEffect: "regular",
              headerTransparent: true,
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitle: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{ color: "#fff", marginLeft: 8, fontWeight: "bold" }}
                  >
                    IronStone
                  </Text>
                </View>
              ),
            }}
          />
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="face-man-profile"
              size={24}
              color="black"
            />
            <Text style={styles.nameUser}>{username}</Text>
          </View>
          <View style={styles.containerHeader}>
            <TotalInvested />
            <View style={styles.containerButtons}>
              <LinearGradient
                colors={["#3740DD", "#545BE7"]}
                style={styles.gradientBuy}
              >
                <TouchableOpacity
                  onPress={() => {
                    setHandleTransaction(1);
                    handleOpenModal();
                  }}
                  style={styles.button}
                >
                  <Text style={styles.textButton}>Comprar</Text>
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={["#1F1F1F", "#000000"]}
                style={styles.gradientSell}
              >
                <TouchableOpacity
                  onPress={() => {
                    setHandleTransaction(2);
                    handleOpenModal();
                  }}
                  style={styles.button}
                >
                  <Text style={styles.textButton}>Vender</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          <Text style={styles.title}>Historial de transacciones</Text>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {[...transactions].reverse().map((transaction) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))}
          </ScrollView>
        </ScrollView>
        <BottomSheet
          snapPoints={snapPoints}
          index={1}
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: "#121212" }}
          handleIndicatorStyle={{ backgroundColor: "white" }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text style={styles.titleBuy}>Elige una moneda</Text>
            <Picker
              selectedValue={selectedCoin}
              onValueChange={(coinValue) => setSelectedCoin(coinValue)}
              style={styles.picker}
            >
              <Picker.Item
                label="Seleccione una moneda"
                value=""
                key="0"
                disabled
              />
              {coins.map((coin) => (
                <Picker.Item
                  key={coin.id}
                  label={coin.nombre}
                  value={coin.id}
                />
              ))}
            </Picker>
            <TextInput
              placeholder="Ingrese una cantidad"
              value={cantCoin.toString()}
              style={styles.input}
              onChangeText={(text) => handlerValue(text)}
            />
            <Button title="Comprar" onPress={handlerBuy} color="#007bff" />
            {msgTotal > 0 && <Text>{msgTotal}</Text>}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 40,
    gap: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  containerHeader: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    gap: 20,
  },
  nameUser: {
    fontSize: 20,
    color: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
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
    paddingVertical: 20,
    alignItems: "center",
  },
  gradientSell: {
    width: "48%",
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: 20,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171717",
  },
  bgTop: {
    position: "absolute",
    top: 0,
    width: "100%",
    flex: 1,
    flexGrow: 1,
  },
  titleBuy: {
    color: "white",
    fontSize: 24,
  },
  picker: {
    height: 50,
    color: "white",
    backgroundColor: "#333333",
  },
});

export default Home;
