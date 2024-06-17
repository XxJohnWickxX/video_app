import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import VideoPlayerScreen from "./src/screens/VideoPlayerScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await requestStoragePermissionAndroid();
    } else if (Platform.OS === "ios") {
      await requestPhotosPermissionIOS();
    }
  };

  const requestStoragePermissionAndroid = async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      if (result !== RESULTS.GRANTED) {
        const requestResult = await request(
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        );
        if (requestResult !== RESULTS.GRANTED) {
          Alert.alert(
            "Permiso denegado",
            "No se concedió el permiso para almacenar imágenes."
          );
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestPhotosPermissionIOS = async () => {
    try {
      const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
      if (result !== RESULTS.GRANTED) {
        const requestResult = await request(
          PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
        );
        if (requestResult !== RESULTS.GRANTED) {
          Alert.alert(
            "Permiso denegado",
            "No se concedió el permiso para almacenar imágenes."
          );
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Lista de Videos" }}
        />
        <Stack.Screen
          name="VideoPlayer"
          component={VideoPlayerScreen}
          options={{
            title: "Reproductor de Video",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "Historial", headerBackTitleVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
