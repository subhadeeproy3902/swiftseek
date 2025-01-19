import { getSearchResults } from "@/service/tavily";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const response: SearchResponse = await getSearchResults(body.question);
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("Error fetching sources", { status: 500 });
  }
}
