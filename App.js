import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  Platform,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import ForeCast from "./Forecast";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [meteo, setMeteo] = useState();
  const [forecast, setForecast] = useState();

  // const [lat, setLat] = useState();
  // const [lon, setLon] = useState();
  const [textInput, setTextInput] = useState("paris");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Get Location Coord. from Weather API from Input
  const getLocalisationFromInput = async () => {

    try {
      const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${textInput}&limit=1&appid=00ffbc1212e68b1e1750ccd6674c9081`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "appliation/json",
          },
        }
      );

      const data = await response.json();

      // if (!data) {
      //   // A remplir
      //   return;
      // }

      // setLat(data[0].lat);
      // setLon(data[0].lon)
      console.log("COORDONNEES", data);
      getMeteoFromApiAsync(data[0].lat, data[0].lon );
ci
    } catch (error) {
      console.error(error);
    }
  }

 //
  // Store location in AsyncStorage
  //

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        setLocation(value)
      }
    } catch(e) {
      // error reading value
    }
  }
  
// getData()
 

  //
  // Get data from Weather API for NOW
  //





  const getMeteoFromApiAsync = async () => {
    try {
      const response = await fetch(
        // "http://api.openweathermap.org/data/2.5/weather?q=Nice,fr&lang=fr&units=metric&APPID=00ffbc1212e68b1e1750ccd6674c9081",
        // `http://api.openweathermap.org/data/2.5/weather?q=${textInput},fr&lang=fr&units=metric&APPID=00ffbc1212e68b1e1750ccd6674c9081`,
        // `http://api.openweathermap.org/data/2.5/weather?lat=${JSON.stringify(lat)}&lon=${JSON.stringify(lon)}&lang=fr&units=metric&appid=00ffbc1212e68b1e1750ccd6674c9081`,
        `http://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&lang=fr&units=metric&appid=00ffbc1212e68b1e1750ccd6674c9081`,

        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setMeteo(data);
      setTextInput("");
      console.log("METEO", data);
    } catch (error) {
      console.error(error);
    }
  };

  //
  // Get data from FORECAST API for NOW
  //
  const getForecastFromApiAsync = async () => {
    try {
      const response = await fetch(
        // "http://api.openweathermap.org/data/2.5/weather?q=Nice,fr&lang=fr&units=metric&APPID=00ffbc1212e68b1e1750ccd6674c9081",
        // `http://api.openweathermap.org/data/2.5/weather?q=${textInput},fr&lang=fr&units=metric&APPID=00ffbc1212e68b1e1750ccd6674c9081`,
        // `http://api.openweathermap.org/data/2.5/weather?lat=${JSON.stringify(lat)}&lon=${JSON.stringify(lon)}&lang=fr&units=metric&appid=00ffbc1212e68b1e1750ccd6674c9081`,
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&lang=fr&units=metric&appid=00ffbc1212e68b1e1750ccd6674c9081`,

        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setForecast(data.list);
      console.log("METEO", data);
    } catch (error) {
      console.error(error);
    }
  };

  //
  // Exemple de la doc

  //

  // useEffect(() => {
  //   (async () => {

  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  // let text = 'Waiting..';
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }

  //
  // Get position from GPS (component Expo Location)
  //

  const getPositionFromGPS = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log(location);
    let text = "Waiting..";

    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
      getMeteoFromApiAsync();
      getForecastFromApiAsync();
      storeData(location)
    }
  };

  // useEffect(() => {console.log("meteo", meteo)}, [meteo]);
  useEffect(() => getMeteoFromApiAsync, [textInput]);
  // let time =  Intl.DateTimeFormat('fr-Fr').format(Date(meteo.dt))
  // let time = Date(meteo?.dt_txt);




  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{meteo?.name}</Text>
        <Text style={styles.text}>{Date(meteo?.dt)}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <View style={styles.bodyTopLeft}>
            <Text style={styles.text_temp}>
              {meteo?.main?.temp.toFixed(1)}°c
            </Text>
            <Text style={styles.text_wind}>
              vent : {meteo?.wind?.speed} m/s{" "}
            </Text>
          </View>
          <View style={styles.bodyTopRight}>
          <View><Image style={styles.image}
              source={{
                uri: `http://openweathermap.org/img/wn/${meteo?.weather[0]?.icon}@2x.png`,
              }}
            /></View>
            <Text style={styles.text}>{meteo?.weather[0]?.description}</Text>
          </View>
        </View>

        <View style={styles.forecast}>
          <View style={styles.forecastLeft}>
            <Text>Min :</Text>
            <Text>Max :</Text>
            <Text>Vent :</Text>
          </View>
          <View style={styles.forecastRight}></View>
          <FlatList
            horizontal={true}
            data={forecast}
            renderItem={({ item }) => (
              <ForeCast
                title={item.title}
                temp_min={item.main.temp_min.toFixed(1)}
                date={item.dt_txt}
                temp_max={item.main.temp_max.toFixed(1)}
                icon={item.weather[0].icon}
                wind={item.wind.speed.toFixed(1)}
                temp={item.main.temp}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* <ForeCast temp={forecast.list[0]?.main?.temp.toFixed(1)} /> */}
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.button}>
          <Text style={styles.textButton} onPress={getPositionFromGPS}>
            Localisez-moi
          </Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.textButton}>Chercher</Text>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <TextInput
          style={styles.inputPlace}
          onChangeText={setTextInput}
          value={textInput}
          placeholder={"Rechercher la météo dans un lieu"}
        ></TextInput>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  image : {
    alignSelf: 'center' ,
    width: 150, 
    height: 150 },

  container: {
    flex: 1,
    backgroundColor: "lightblue",
    // alignItems: "center",
    justifyContent: "center",
    // borderColor: "red",
    // borderWidth: 10,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 20,
    marginVertical: 20,
    width: 140,
    alignContent: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  textButton: {
    color: "white",
    textAlign: "center",
  },

  forecast: {
    flexDirection: "row",
    
  },
  forecastLeft: {
   paddingHorizontal: 4,
   justifyContent: "flex-end",
  },
  forecastRight: {},

  title: {
    fontSize: 42,
    textAlign: "center",
    letterSpacing: 1,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  text_temp: {
    color: "white",
    fontSize: 64,
  },
  text_wind: {
    color: "white",
    fontSize: 26,
  },
  header: {
    flex: 1,
    marginTop: 50,
    justifyContent: "center",
    alignContent: "center",
    // borderColor: "black",
    // borderWidth: 3,
  },
  body: {
    flex: 6,
    // alignContent: "center",
    // borderColor: "black",
    // borderWidth: 3,
    padding: 12,
  },

  bodyTop: {
    flex: 1,
    flexDirection: "row",
    // alignContent: "center",
    // borderColor: "black",
    // borderWidth: 3,
    backgroundColor: "rgba(0, 0, 0, 0.400)",
    borderRadius: 20,
  },
  bodyTopLeft: {
    flex: 1,
    // borderColor: "blue",
    // borderWidth: 3,
    // justifyContent: "center",
    alignContent: "center",
    // textAlign: "center",
    // verticalAlign: "center"
  },
  bodyTopRight: {
    flex: 1,
    // borderColor: "yellow",
    // borderWidth: 3,
    textAlign: "center",
    alignContent: "flex-end",
    // justifyContent: "center",

    // justifyContent: "center",
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    // borderColor: "black",
    // borderWidth: 3,
  },

  inputPlace: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
});
