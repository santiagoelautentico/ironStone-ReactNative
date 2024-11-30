import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setCoins } from "../../redux/slices/coinsReducer.js";
import {
  setTransactions,
  addTransaction,
} from "../../redux/slices/transactionReducer.js";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TotalInvested from "../../components/TotalInvested.jsx";
import Transaction from "../../components/Transaction.jsx";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";

const home = () => {
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const bgTop = require("../../assets/backgroundTop.png");

  const snapPoints = useMemo(() => ["75%"], []);

  const bottomSheetRef = useRef(null);

  const handleOpenModal = () => bottomSheetRef.current?.expand();
  const handleCloseModal = () => {
    setSelectedCoin("");
    setIsDropdownOpen(false);
    bottomSheetRef.current?.close();
  };

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

  const handlerValue = (cant) => {
    const numCant = Number(cant);
    setCantCoin(numCant);
    const selectedCoinData = coins.find(
      (coin) => coin.id === parseInt(selectedCoin)
    );
    setMsjTotal(selectedCoinData ? selectedCoinData.cotizacion * numCant : 0);
  };

  const handlerBuy = () => {
    const selectedCoinData = coins.find(
      (coin) => coin.id === parseInt(selectedCoin)
    );
    const cant = Number(cantCoin);
    let trasactionFetch = {
      idUsuario: userId,
      tipoOperacion: handleTrasacction,
      moneda: Number(selectedCoin),
      cantidad: cant,
      valorActual: selectedCoinData.cotizacion,
    };

    if (cant === 0 || selectedCoin === "" || handleTrasacction === 0) {
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
          index={-1}
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: "black" }}
          handleIndicatorStyle={{ backgroundColor: "white" }}
          onClose={handleCloseModal}
          onOpen={handleOpenModal}
          detached={true}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text style={styles.titleBuy}>
              {handleTrasacction === 1
                ? "Compra de Criptos"
                : "Venta de Criptos"}
            </Text>
            <View>
              <Text style={styles.label}>Moneda:</Text>
              <TouchableOpacity
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                style={styles.dropdown}
              >
                <Text style={styles.dropdownText}>
                  {selectedCoin
                    ? coins.find((coin) => coin.id === parseInt(selectedCoin))
                        ?.nombre
                    : "Seleccione una moneda"}
                </Text>
              </TouchableOpacity>
              {isDropdownOpen && (
                <ScrollView style={styles.dropdownList}>
                  {coins.map((coin) => (
                    <TouchableOpacity
                      key={coin.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCoin(coin.id.toString());
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{coin.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            <View>
              <Text style={styles.label}>Cantidad:</Text>
              <TextInput
                placeholder="Ingrese una cantidad"
                placeholderTextColor="#A7A7A7"
                value={cantCoin.toString()}
                style={styles.input}
                onChangeText={(cant) => handlerValue(cant)}
              />
            </View>

            {msgTotal > 0 && (
              <Text style={styles.msgTotal}>
                {handleTrasacction === 1 ? "Gasto total: " : "Ganancia de: "} $
                {msgTotal}
              </Text>
            )}
            <LinearGradient
              colors={["#3740DD", "#545BE7"]}
              style={styles.gradientBuyBottom}
            >
              <TouchableOpacity onPress={handlerBuy} style={styles.button}>
                <Text style={styles.textButton}>Comprar</Text>
              </TouchableOpacity>
            </LinearGradient>
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
    paddingTop: 80,
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
    color: "white",
  },
  input: {
    borderWidth: 2,
    borderColor: "#393E46",
    padding: 10,
    borderRadius: 5,
    color: "white",
    backgroundColor: "#707070",
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
  gradientBuyBottom: {
    marginHorizontal: 100,
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 10,
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "black",
    gap: 15,
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
    fontWeight: "bold",
    textAlign: "center",
  },
  dropdown: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#707070",
    marginBottom: 10,
  },
  dropdownText: {
    color: "white",
  },
  dropdownList: {
    zIndex: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#707070",
    maxHeight: 150,
    position: "absolute",
    width: "100%",
    top: 80,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    color: "white",
  },
  label: {
    color: "white",
    fontSize: 16,
    paddingBottom: 10,
  },
  msgTotal: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 5,
  },
});

export default home;
