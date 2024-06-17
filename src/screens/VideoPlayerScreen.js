import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Button,
  Alert,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import Video from "react-native-video";
import { captureScreen } from "react-native-view-shot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useNavigation } from "@react-navigation/native";

const VideoPlayerScreen = ({ route, navigation }) => {
  const { video } = route.params;
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      saveToHistory();
      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [navigation, currentTime]);

  const handleCapture = async () => {
    try {
      const uri = await captureScreen({
        format: "jpg",
        quality: 0.8,
      });
      await saveImageToGallery(uri);
      Alert.alert(
        "Captura de pantalla",
        "Captura de pantalla realizada correctamente."
      );
    } catch (error) {
      console.error("Error al capturar la pantalla:", error);
    }
  };

  const saveImageToGallery = async (uri) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const fileName = `screenshot_${timestamp}.jpg`;

    if (Platform.OS === "android") {
      const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;

      try {
        await RNFS.mkdir(RNFS.PicturesDirectoryPath);
        await RNFS.moveFile(uri, destPath);
        console.log("Imagen guardada en:", destPath);
      } catch (error) {
        console.error("Error al guardar la imagen:", error);
      }
    } else if (Platform.OS === "ios") {
      try {
        const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        await RNFS.moveFile(uri, path);
        CameraRoll.save(path, { type: "photo", album: "Screenshots" });
        console.log("Imagen guardada en la galería:", path);
      } catch (error) {
        console.error("Error al guardar la imagen en la galería:", error);
      }
    }
  };

  const handleVideoEnd = () => {
    saveToHistory();
  };

  const saveToHistory = async () => {
    const historyItem = {
      ...video,
      watchedAt: new Date().toISOString(),
      durationWatched: currentTime,
    };

    try {
      const history = await AsyncStorage.getItem("videoHistory");
      let historyList = history ? JSON.parse(history) : [];

      const tenMinutesAgo = new Date().getTime() - 10 * 60 * 1000;
      historyList = historyList.filter(
        (item) => new Date(item.watchedAt).getTime() > tenMinutesAgo
      );

      // Check if the current video is already in history
      const existingIndex = historyList.findIndex(
        (item) => item.id === historyItem.id
      );
      if (existingIndex !== -1) {
        // Remove the existing item to replace it with the updated one
        historyList.splice(existingIndex, 1);
      }

      historyList.push(historyItem);

      await AsyncStorage.setItem("videoHistory", JSON.stringify(historyList));
    } catch (error) {
      console.error("Error al guardar en el historial:", error);
    }
  };

  const handleProgress = (progress) => {
    setCurrentTime(progress.currentTime);
  };

  const buttonPlayPause = useMemo(
    () => (paused ? "Reproducir" : "Pausar"),
    [paused]
  );

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: video.videoUrl }}
        style={styles.video}
        controls
        paused={paused}
        onProgress={handleProgress}
        onEnd={handleVideoEnd}
        resizeMode="contain"
      />
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => setPaused(!paused)}
          style={{ ...styles.button, right: 5 }}
        >
          <Text style={styles.text}>{buttonPlayPause}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCapture}
          style={{ ...styles.button, left: 5 }}
        >
          <Text style={styles.text}>Capturar Pantalla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    paddingBottom: "10%",
  },
  button: {
    width: "50%",
    backgroundColor: "#ccc",
    padding: 16,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default VideoPlayerScreen;
