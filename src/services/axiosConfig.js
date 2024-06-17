import axios from "axios";
import { PEXELS_API_KEY, PEXELS_API, USER_URL } from "@env";

export const fetchVideos = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(PEXELS_API, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: "nature",
        per_page: perPage,
        page: page,
      },
    });

    return {
      videos: response.data.videos.map((video) => ({
        id: video.id.toString(),
        title: video.user.name,
        description: video.user.url.substring(USER_URL.length),
        duration: `${video.duration} seconds`,
        thumbnail: video.image,
        videoUrl: video.video_files[0].link,
      })),
      nextPage: response.data.next_page,
    };
  } catch (error) {
    console.error("Error fetching videos from Pexels API:", error);
    return { videos: [], nextPage: null };
  }
};
