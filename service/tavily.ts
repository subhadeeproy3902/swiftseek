"use server";

import { tavily } from "@tavily/core";

const API_KEY = process.env.TAVILY_API_KEY!;

const client = tavily({ apiKey: API_KEY });

export async function getSearchResults(
  searchQuery: string
): Promise<SearchResponse> {
  const apiUrl = "https://api.tavily.com/search";

  const requestPayload = {
    api_key: process.env.TAVILY_API_KEY,
    query: searchQuery,
    search_depth: "general",
    include_images: true,
    include_answer: true,
    include_image_descriptions: true,
    include_raw_content: false,
    max_results: 6,
  };

  try {
    const x = await client.search(searchQuery, {
      searchDepth: "advanced",
      maxResults: 6,
      includeAnswer: true,
      includeImages: true,
      includeImageDescriptions: true,
    });

    console.log(x);

    const responseJson: SearchResponse = {
      query: searchQuery,
      answer: x.answer || "",
      images: x.images.map((image) => ({
        url: image.url,
        description: image.description || "",
      })),
      results: x.results.map((result) => ({
        url: result.url,
        title: result.title,
        content: result.content,
        score: result.score,
        raw_content: null,
      })),
    };
    return responseJson;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw new Error(
      "An error occurred while fetching search results. Please try again later."
    );
  }
}
