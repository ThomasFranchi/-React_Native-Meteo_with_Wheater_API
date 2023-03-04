import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import * as Location from "expo-location";
import {
  StyleSheet,
  Text,
  View,
  Back,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";

//import pour modifier le rendu de l'heure
import moment from "moment";

export default function Meteo() {
  const [meteo, setMeteo] = useState({});
  const [forecast, setForecast] = useState([]);
  const [description, setDescription] = useState("...loading");
  const [icon, setIcon] = useState("...");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // fonction avec mon fetch pour get météo à 5 jours
  const getForecast = async () => {
    const options = {
      method: "GET",
    };
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?lat=43.6961&lon=7.27178&appid=bdb97645ce611289c0abb8c3f467c2ce&units=metric",
      options
    )
      // on initialise la response en format JSOn pour etre lu par RN
      .then((response) => {
        return response.json();
      })

      // on joue avec la data récupéré ici
      .then(
        async (responseObject) => {
          if (responseObject) {
            //console.log("response", responseObject);

            setForecast(responseObject.list);
          } else console.log("non");
        },

        (error) => {
          console.log(error);
        }
      );
  };

  // fonction avec mon fetch pour get la météo
  const getMeteo = async () => {
    // console.log("test", latitude);
    const options = {
      method: "GET",
    };
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}8&appid=bdb97645ce611289c0abb8c3f467c2ce&units=metric`,
      options
    )
      // on initialise la response en format JSOn pour etre lu par RN
      .then((response) => {
        return response.json();
      })

      // on joue avec la data récupéré ici
      .then(
        async (responseObject) => {
          if (responseObject) {
            //console.log("response", responseObject);
            setMeteo(responseObject);
            setDescription(responseObject.weather[0].description);
            setIcon(responseObject.weather[0].icon);
            await AsyncStorage.setItem(
              "description",
              responseObject.weather[0].description
            );
            await AsyncStorage.setItem("icon", responseObject.weather[0].icon);
          } else console.log("non");
        },

        (error) => {
          console.log(error);
        }
      );
  };

  // je récupère mon Asyncstorage
  const testAsync = async () => {
    console.log("AsyncStorage", await AsyncStorage.getItem("icon"));
  };

  // location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(
        "location",
        location.coords.latitude,
        location.coords.longitude
      );
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();

    let text = "Waiting..";
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }
  }, []);

  useEffect(() => {
    //j'initialise la fonction fetch pour la lancer à chaque lancement de l'app

    if (latitude != null && longitude != null) {
      getForecast();
      getMeteo();
    }

    // test du comportement de ma data
    // console.log("meteo1", meteo);
  }, [latitude, longitude]);

  // ce useEffect ce relance à chaque fois que ma variable d'état météo se met à jour
  useEffect(() => {
    console.log("meteo", latitude, longitude);
    testAsync();
  }, [meteo, forecast]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#77B5FE",
      }}>
      <Text
        style={{
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: 30,
        }}>
        Météo du jour
      </Text>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{ width: 100, height: 100 }}
          source={{ uri: `http://openweathermap.org/img/wn/${icon}@2x.png` }}
        />
        <Text>{description}</Text>
      </View>
      <View style={{ flex: 2, alignItems: "center" }}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
          {meteo?.name}
        </Text>

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-around",
            marginTop: 20,
          }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text>{meteo?.main?.temp}°C</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text>{meteo?.wind?.speed}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 20,
              fontWeight: "bold",
              color: "white",
            }}>
            Météo des 5 prochains jours{" "}
          </Text>
          {forecast ? (
            <ScrollView horizontal={true} style={{ paddingHorizontal: 20 }}>
              <View style={{ marginRight: 10 }}>
                <Image
                  style={{ width: 30, height: 30 }}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${forecast[0]?.weather[0]?.icon}@2x.png`,
                  }}
                />
                <Text>{forecast[0]?.weather[0]?.description}</Text>
                <View>
                  <Text>
                    {moment(forecast[0]?.dt_txt).format("DD/MM/YYYY")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text>{}</Text>
                </View>
              </View>
              <View style={{ marginRight: 10 }}>
                <View>
                  <Image
                    style={{ width: 30, height: 30 }}
                    source={{
                      uri: `http://openweathermap.org/img/wn/${forecast[8]?.weather[0]?.icon}@2x.png`,
                    }}
                  />
                  <Text>{forecast[8]?.weather[0]?.description}</Text>
                </View>
                <View style={{ marginRight: 10 }}>
                  <Text>
                    {moment(forecast[8]?.dt_txt).format("DD/MM/YYYY")}
                  </Text>
                </View>
              </View>
              <View>
                <Image
                  style={{ width: 30, height: 30 }}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${forecast[16]?.weather[0]?.icon}@2x.png`,
                  }}
                />
                <Text>{forecast[16]?.weather[0]?.description}</Text>
                <View style={{ marginRight: 20 }}>
                  <Text>
                    {moment(forecast[16]?.dt_txt).format("DD/MM/YYYY")}
                  </Text>
                </View>
              </View>
              <View>
                <Image
                  style={{ width: 30, height: 30 }}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${forecast[24]?.weather[0]?.icon}@2x.png`,
                  }}
                />
                <Text>{forecast[24]?.weather[0]?.description}</Text>
                <View>
                  <Text>
                    {moment(forecast[24]?.dt_txt).format("DD/MM/YYYY")}
                  </Text>
                </View>
              </View>
            </ScrollView>
          ) : (
            <Text>Loading ...</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
