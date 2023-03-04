import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";

export default function ForeCast({ icon, temp_min, temp_max, wind, date }) {
  console.log(icon);
  console.log(temp_min);

  return (
    <View style={styles.forecastView}>
              <Text style={styles.cellView}>{date.substring(5,10)}</Text>

      <Text style={styles.cellView}>{date.substring(11, 13)}h</Text>

      <Image
        source={{
          uri: `http://openweathermap.org/img/wn/${icon}@2x.png`,
        }}
        style={{ width: 50, height: 50 }}
      />
      <Text style={styles.cellView}>{temp_min}</Text>
      <Text style={styles.cellView}>{temp_max}</Text>
      <Text style={styles.cellView}> {wind}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  forecastView: {
    flex: 1,
    marginHorizontal: 0,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  cellView: {
    textAlign: "center",
  },
});

// <View> {forecast.list[0].wind.speed} </View>
