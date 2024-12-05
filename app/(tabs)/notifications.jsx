import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { useHeaderHeight } from "@react-navigation/elements";
import ArrowUp from "../../assets/arrowUp.svg";
import DownArrow from "../../assets/downArrow.svg";
import Notification from "../../assets/notification.svg";
import { LinearGradient } from "expo-linear-gradient";
export default function notifications() {
  const headerHeight = useHeaderHeight();

  const transactions = useSelector((state) => state.transactions.transactions);
  const coins = useSelector((state) => state.coins.coins);
  console.log(transactions, "transactions");
  console.log(coins, "coins");

  const coinsTransactions = [];
  const seenCoins = new Set();
  const remendedCoins = [];

  for (let i = transactions.length - 1; i >= 0; i--) {
    const transaction = transactions[i];
    if (!seenCoins.has(transaction.moneda)) {
      seenCoins.add(transaction.moneda);
      coinsTransactions.unshift(transaction);
    }
  }

  console.log(coinsTransactions, "monedas únicas");

  coinsTransactions.forEach((transaccion) => {
    const coin = coins.find((coin) => coin.id === transaccion.moneda);
    if (transaccion.tipoOperacion === 1) {
      const recomendation = coin.cotizacion - transaccion.valorActual;
      if (recomendation < 0) {
        remendedCoins.push({
          ...coin,
          percentageDifference: (
            ((transaccion.valorActual - coin.cotizacion) /
              transaccion.valorActual) *
            100
          ).toFixed(0),
          conviene: "comprar".toString(),
        });
      } else {
        remendedCoins.push({
          ...coin,
          percentageDifference: (
            ((transaccion.valorActual - coin.cotizacion) /
              transaccion.valorActual) *
            100
          ).toFixed(0),
          conviene: "vender".toString(),
        });
      }
    } else {
      const recomendationSell = transaccion.valorActual - coin.cotizacion;
      if (recomendationSell < 0) {
        remendedCoins.push({
          ...coin,
          percentageDifference: (
            ((transaccion.valorActual - coin.cotizacion) /
              transaccion.valorActual) *
            100
          ).toFixed(0),
          conviene: "vender".toString(),
        });
      } else {
        remendedCoins.push({
          ...coin,
          percentageDifference: (
            ((transaccion.valorActual - coin.cotizacion) /
              transaccion.valorActual) *
            100
          ).toFixed(0),
          conviene: "comprar".toString(),
        });
      }
    }
  });
  console.log(remendedCoins, "monedas recomendadas");
  return (
    <ScrollView
      style={{
        backgroundColor: "#171717",
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
      }}
    >
      <Text style={styles.title}>Notificaciones</Text>
      <View style={styles.container}>
        {remendedCoins.length > 0 ? (
          remendedCoins.every(
            (coin) => Number(coin.percentageDifference) === 0
          ) ? (
            <View style={{ alignItems: "center", flex: 1, justifyContent:"center", height:"100%" }}>
              <Notification width={200} height={200} />
              <Text style={{ color: "white", fontSize: 20, paddingTop: 20, fontWeight:"bold" }}>No hay monedas recomendadas</Text>
            </View>
          ) : (
            remendedCoins.map((coin) =>
              Number(coin.percentageDifference) !== 0 ? (
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  key={coin.id}
                  style={styles.containerRecomendation}
                  colors={
                    coin.conviene === "comprar"
                      ? ["#AC1C1E", "#E64345"]
                      : ["#169422", "#43E653"]
                  }
                >
                  {coin.conviene === "vender" ? (
                    <ArrowUp width={120} height={90} />
                  ) : (
                    <DownArrow width={120} height={90} />
                  )}
                  <View style={styles.nameContainer}>
                    <Text style={styles.name}>{coin.nombre}</Text>
                    <Text style={styles.percentage}>
                      {Math.abs(coin.percentageDifference)}%
                    </Text>
                  </View>
                  <View style={styles.type}>
                    {coin.conviene === "comprar" ? (
                      <Text style={styles.textType}>Comprar</Text>
                    ) : (
                      <Text style={styles.textType}>Vender</Text>
                    )}
                  </View>
                  <Text
                    style={{
                      color: "black",
                      opacity: 0.5,
                      position: "absolute",
                      bottom: 5,
                      right: 10,
                      fontSize: 16,
                    }}
                  >
                    Valor actual: {coin.cotizacion}
                  </Text>
                </LinearGradient>
              ) : (
                ""
              )
            )
          )
        ) : (
          <Text style={styles.text}>No hay monedas recomendadas</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  containerRecomendation: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 15,
    borderRadius: 5,
    alignContent: "center",
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    marginBottom: 40,
  },
  nameContainer: {
    justifyContent: "center",
  },
  name: {
    color: "white",
    fontSize: 18,
  },
  percentage: {
    fontWeight: "bold",
    fontSize: 60,
    color: "white",
    marginTop: -10,
  },
  type: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  textType: {
    fontSize: 16,
    color: "white",
    backgroundColor: "black",
    padding: 8,
    borderRadius: 5,
  },
});
