import { View, Text, ScrollView } from "react-native";
import React, { useMemo } from "react";
import { BarChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";
import { useHeaderHeight } from "@react-navigation/elements";

export default function Charts() {
  const headerHeight = useHeaderHeight();

  const transactions = useSelector((state) => state.transactions.transactions);
  const coins = useSelector((state) => state.coins.coins);

  const getCoinName = (idMoneda) => {
    const coin = coins.find((coin) => coin.id === idMoneda);
    return coin ? coin.nombre : "Moneda no encontrada";
  };

  const transactionsByCoin = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.tipoOperacion === 1) {
        const coinId = transaction.moneda;
        if (!acc[coinId]) {
          acc[coinId] = 0;
        }
        acc[coinId] += transaction.valorActual * transaction.cantidad;
      }
      return acc;
    }, {});
  }, [transactions]);

  const transactionsChart = Object.entries(transactionsByCoin).map(
    ([coinId, total]) => ({
      value: total,
      label: getCoinName(parseInt(coinId)),
      frontColor: "#1B6BB0",
      gradientColor: "#FFEEFE",
    })
  );

  const transactionsByCoinSell = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.tipoOperacion === 2) {
        const coinId = transaction.moneda;
        if (!acc[coinId]) {
          acc[coinId] = 0;
        }
        acc[coinId] += transaction.valorActual * transaction.cantidad;
      }
      return acc;
    }, {});
  }, [transactions]);

  const transactionsChartSell = Object.entries(transactionsByCoinSell).map(
    ([coinId, total]) => ({
      value: total,
      label: getCoinName(parseInt(coinId)),
      frontColor: "#FF5733",
      gradientColor: "#FFC371",
    })
  );

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#171717",
        paddingTop: headerHeight + 20,
        paddingBottom: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 30,
          fontWeight: "bold",
          paddingBottom: 20,
          textAlign: "left",
        }}
      >
        Gasto por moneda
      </Text>

      <View
        style={{
          backgroundColor: "#272727",
          width: "100%",
          padding: 10,
          borderRadius: 5,
          borderColor: "gray",
          borderWidth: 1,
        }}
      >
        <BarChart
          data={transactionsChart}
          hideRules
          barBorderRadius={4}
          barWidth={18}
          initialSpacing={30}
          spacing={55}
          width={300}
          rulesType="none"
          showGradient
          frontColor={"#1B6BB0"}
          gradientColor={"#FFEEFE"}
          yAxisTextStyle={{
            color: "gray",
            fontFamily: "PP Mondwest",
          }}
          xAxisLabelTextStyle={{
            color: "white",
            fontSize: 12,
            fontFamily: "PP Mondwest",
          }}
          noOfSections={5}
          yAxisThickness={0}
          xAxisThickness={0}
        />
      </View>

      <Text
        style={{
          color: "white",
          fontSize: 30,
          fontWeight: "bold",
          paddingTop: 40,
          paddingBottom: 20,
        }}
      >
        Venta por moneda
      </Text>

      <View
        style={{
          backgroundColor: "#272727",
          width: "100%",
          padding: 10,
          borderRadius: 5,
          borderColor: "gray",
          borderWidth: 1,
        }}
      >
        <BarChart
          data={transactionsChartSell}
          hideRules
          barBorderRadius={4}
          barWidth={18}
          initialSpacing={30}
          spacing={55}
          width={300}
          rulesType="none"
          showGradient
          frontColor={"#FF5733"}
          gradientColor={"#FFC371"}
          yAxisTextStyle={{
            color: "gray",
            fontFamily: "PP Mondwest",
          }}
          xAxisLabelTextStyle={{
            color: "white",
            fontSize: 12,
            fontFamily: "PP Mondwest",
          }}
          noOfSections={5}
          yAxisThickness={0}
          xAxisThickness={0}
        />
      </View>
    </ScrollView>
  );
}
