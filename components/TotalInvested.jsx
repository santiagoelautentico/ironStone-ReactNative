import { View, Text, ScrollView, Button } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";

const TotalInvested = () => {
  const transactions = useSelector((state) => state.transactions.transactions);
  const totalCompras = transactions.reduce((acc, transaction) => {
    if (transaction.tipoOperacion === 1) {
      return acc + transaction.cantidad * transaction.valorActual;
    }
    return acc;
  }, 0);

  const totalSell = transactions.reduce((acc, transaction) => {
    if (transaction.tipoOperacion === 2) {
      return acc + transaction.cantidad * transaction.valorActual;
    }
    return acc;
  }, 0);

  const total = totalCompras - totalSell;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Balance Total:</Text>
      <Text style={styles.amount}>
        {total > 0 ? `${total}` : `Total Perdido: $${total}`}
        <Text style={styles.usd}>USD</Text>
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(53, 52, 62, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
  },
  title: {
    fontSize: 21,
    color: "white",
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "white",
  },
  usd: {
    fontWeight: "normal",
    opacity: 0.7,
    fontSize: 21,
    color: "white",
  },
});
export default TotalInvested;
