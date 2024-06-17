import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const VideoListItem = ({ video, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
      <View style={styles.details}>
        <Text style={styles.title}>{video.title}</Text>
        {video.description && (
          <Text style={styles.description}>{video.description}</Text>
        )}
        {video.duration && (
          <Text style={styles.duration}>{video.duration}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 4,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#999",
    lineHeight: 18,
  },
  duration: {
    fontSize: 12,
    color: "#ccc",
  },
});

export default VideoListItem;
