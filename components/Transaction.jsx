import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

function Transaction({ transaction }) {
  const coins = useSelector((state) => state.coins.coins);
  const getCoinName = (idMoneda) => {
    const coin = coins.find((coin) => coin.id === idMoneda);
    return coin ? coin.nombre : "Moneda no encontrada";
  };
  return (
    <LinearGradient
      colors={["#333333", "#161616"]}
      style={styles.gradientTransaction}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{getCoinName(transaction.moneda)}</Text>
          <Text style={styles.amount}>
            {transaction.tipoOperacion === 1 ? (
              <>
                <Text style={styles.span}>Gastado: </Text>
                <Text style={styles.buyAmount}>
                  ${transaction.valorActual * transaction.cantidad}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.span}>Ganancia: </Text>
                <Text style={styles.sellAmount}>
                  $ {transaction.cantidad * transaction.valorActual}
                </Text>
              </>
            )}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
          <Text style={styles.text}>Cant: {transaction.cantidad}</Text>
          <Text style={styles.text}>Cotización: {transaction.valorActual}</Text>
        </View>
      </View>
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientTransaction: {
    borderRadius: 10,
    overflow: "hidden",
    color: "white",
    borderRadius: 10,
    paddingVertical: 20,
  },

  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10.24,
    elevation: 13,
  },
  title: {
    color: "white",
    fontSize: 21,
    paddingBottom: 10,
    fontFamily: "PP Mondwest Regular",
    paddingBottom: 0,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  amount: {
    fontFamily: "PP Mondwest Regular",
    color: "white",
    fontSize: 21,
    fontWeight: "regular",
  },
  buyAmount: {
    color: "#E72B2B",
  },
  sellAmount: {
    color: "#19D12F",
    marginLeft: 5,
  },
  span: {
    fontSize: 16,
  },
  text: {
    color: "white",
  },
});

export default Transaction;
