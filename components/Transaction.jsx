import { Text, View } from 'react-native'
import React, { Component } from 'react'

function Transaction({transaction}) {
    return (
      <View>
        <Text>{transaction.tipoOperacion}</Text>
      </View>
    )
  }

export default Transaction