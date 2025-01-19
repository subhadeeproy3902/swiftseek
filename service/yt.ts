"use server";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

// Define the types for the YouTube API response
export interface YouTubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Record<string, { url: string }>;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}

export interface YouTubeVideoItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: YouTubeVideoSnippet;
}

export async function getVideos(query: string): Promise<YouTubeVideoItem[]> {
  const url = `${YOUTUBE_BASE_URL}/search?part=snippet&maxResults=4&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&q=${encodeURIComponent(query)}&type=video`;

  try {
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Failed to fetch videos: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items as YouTubeVideoItem[];
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw new Error("An error occurred while fetching videos. Please try again later.");
  }
}
