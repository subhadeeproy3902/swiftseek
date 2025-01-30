import { generateObject } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { z } from "zod";

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const { question } = await request.json();

  const { object } = await generateObject({
    model: groq("deepseek-r1-distill-llama-70b"),
    schema: z.object({
      similarTopics: z.array(z.string()).length(3),
    }),
    prompt: `
      You are a helpful assistant that helps the user to ask related questions, based on user's original question. Please identify worthwhile topics that can be follow-ups, and write 3 questions no longer than 20 words each. Please make sure that specifics, like events, names, locations, are included in follow up questions so they can be asked standalone. For example, if the original question asks about "the Manhattan project", in the follow up question, do not just say "the project", but use the full name "the Manhattan project". Your related questions must be in the same language as the original question.

          Please provide these 3 related questions as a JSON array of 3 strings. Do NOT repeat the original question. ONLY return the JSON array, I will get fired if you don't return JSON. Here is the user's original question: ${question}
    `,
  });

  return new Response(JSON.stringify(object));
}
