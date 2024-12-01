import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useSelector } from "react-redux";

export default function notifications() {
  const transactions = useSelector((state) => state.transactions.transactions);
  const coins = useSelector((state) => state.coins.coins);
  console.log(transactions, "transactions");
  console.log(coins, "coins");

  const buyCoinsTransactions = [];
  const seenCoins = new Set();
  const remendedCoins = [];

  // Filtrar transacciones únicas por moneda
  transactions.map((transaction) => {
    if (!seenCoins.has(transaction.moneda)) {
      seenCoins.add(transaction.moneda);
      buyCoinsTransactions.push(transaction);
    }
  });

  console.log(buyCoinsTransactions, "monedas únicas");

  // Calcular recomendaciones
  buyCoinsTransactions.forEach((transaccion) => {
    const coin = coins.find((coin) => coin.id === transaccion.moneda);
    if (coin) {
      const recomendation = coin.cotizacion - transaccion.valorActual;
      if (recomendation < 0) {
        remendedCoins.push({
          ...coin,
          percentageDifference: (
            ((transaccion.valorActual - coin.cotizacion) /
              transaccion.valorActual) *
            100
          ).toFixed(0), // Calcula el porcentaje de diferencia
        });
      }
    }
  });
  console.log(remendedCoins, "monedas recomendadas");
  return (
    <View style={styles.container}>
      {remendedCoins.length > 0 ? (
        remendedCoins.map((coin) => (
          <Text key={coin.id} style={styles.text}>
            La moneda **{coin.nombre}** está un{" "}
            {Math.abs(coin.percentageDifference)}% más barata que antes.
          </Text>
        ))
      ) : (
        <Text style={styles.text}>No hay monedas recomendadas</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    padding: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
});
