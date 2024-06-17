import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { fetchVideos } from "../services/axiosConfig";
import VideoListItem from "../components/VideoListItem";

const HomeScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    if (loading) return;

    setLoading(true);
    const { videos: newVideos, nextPage: next } = await fetchVideos(page);
    setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    setNextPage(next);
    setLoading(false);
  };

  const handleVideoPress = (video) => {
    navigation.navigate("VideoPlayer", { video });
  };

  const handleLoadMore = () => {
    if (nextPage && page < 2) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      loadVideos();
    }
  }, [page]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("History")}
        style={styles.button}
      >
        <Text style={styles.text}>Ver Historial</Text>
      </TouchableOpacity>
      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <VideoListItem video={item} onPress={() => handleVideoPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginBottom: 4,
    borderRadius: 8,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
