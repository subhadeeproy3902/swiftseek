import { getVideos, YouTubeVideoItem } from "@/service/yt";

export async function POST(request: Request) {
  const { question } = await request.json();
  try {
    const response: YouTubeVideoItem[] = await getVideos(question);

    // Fill the response arrays id.videoId and snippet.title in another array
    const sources: FinalResultResponse[] = response.map((video) => ({
      name: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      image: `https://img.youtube.com/vi/${video.id.videoId}/maxresdefault.jpg`,
    }));

    return new Response(JSON.stringify(sources), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("Error fetching sources", { status: 500 });
  }
}
