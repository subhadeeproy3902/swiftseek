import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";
import {
  TogetherAIStream,
  TogetherAIStreamPayload,
} from "@/utils/TogetherAIStream";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env["TOGETHER_API_KEY"],
  baseURL: "https://together.helicone.ai/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});

export const maxDuration = 45;

export async function POST(request: Request) {
  let { question, sources } = await request.json();

  console.log("[getAnswer] Fetching text from source URLS");
  let finalResults = await Promise.all(
    sources.map(async (result: any) => {
      try {
        // Fetch the source URL, or abort if it's been 3 seconds
        const response = await fetchWithTimeout(result.url);
        const html = await response.text();
        const virtualConsole = new jsdom.VirtualConsole();
        const dom = new JSDOM(html, { virtualConsole });

        const doc = dom.window.document;
        const parsed = new Readability(doc).parse();
        let parsedContent = parsed
          ? cleanedText(parsed.textContent)
          : "Nothing found";

        return {
          ...result,
          fullContent: parsedContent,
        };
      } catch (e) {
        console.log(`error parsing ${result.name}, error: ${e}`);
        return {
          ...result,
          fullContent: "not available",
        };
      }
    }),
  );

  const mainAnswerPrompt = `
  Given a user question and some context, please write a detailed atleast 5 page, structured, and professional elaborated report on the topic in Markdown. You will be given a set of related contexts to the question, each starting with a reference number like 'x.', where x is a number. Use these contexts and your AI provice to create an in-depth, detailed, with every single thing highly explained, accurate, and well-organized report.

  Your report should be in Markdown format and should dynamically include appropriate sections based on the topic and context. The sections must:
  - Be logical and relevant to the topic.
  - Cover all major aspects and details required for a comprehensive understanding.
  - Include appropriate headings (e.g., #, ##, ###) for organization.

  Here are the key requirements:
  1. **Dynamic Sectioning**: Decide the sections based on the topic. Each of the sections should be very details with appropriate sub-sections, tables if necessary, and bullet points. Please make a detailed report of the topic.

  2. **Full Details**: Include all the necessary details and explanations to make the report comprehensive and informative. Use the context provided to ensure the report is accurate and relevant. Also use your own knowledge and research to enhance the quality of the report.

  3. **References**: Use a separate section at the end to list references cited in the report, using the citation format 'x.'.

  Ensure the report is:
  - Proper Markdown format.
  - Expertly written with a professional tone.
  - Structured for clarity and ease of reading.
  - Comprehensive and avoids repetition.
  - Accurate and only includes information supported by the context.

  If the context does not provide sufficient information for a specific sub-topic or section, explicitly state, "Information is missing on [sub-topic]" in the report.

  Here are the set of contexts:

  <contexts>
  ${finalResults.map((result, index) => `${index}. ${result.fullContent} \n\n`)}
  </contexts>

  Remember, the report must read like a professional document with appropriate Markdown formatting. Use sections and subsections thoughtfully to create a logical flow. Here is the user question:
    `;

  try {
    const payload: TogetherAIStreamPayload = {
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      messages: [
        { role: "system", content: mainAnswerPrompt },
        {
          role: "user",
          content: question,
        },
      ],
      stream: true,
    };

    console.log(
      "[getAnswer] Fetching answer stream from Together API using text and question",
    );
    const stream = await TogetherAIStream(payload);
    // TODO: Need to add error handling here, since a non-200 status code doesn't throw.
    return new Response(stream, {
      headers: new Headers({
        "Cache-Control": "no-cache",
      }),
    });
  } catch (e) {
    // If for some reason streaming fails, we can just call it without streaming
    console.log(
      "[getAnswer] Answer stream failed. Try fetching non-stream answer.",
    );
    let answer = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      messages: [
        { role: "system", content: mainAnswerPrompt },
        {
          role: "user",
          content: question,
        },
      ],
    });

    let parsedAnswer = answer.choices![0].message?.content;
    console.log("Error is: ", e);
    return new Response(parsedAnswer, { status: 202 });
  }
}

const cleanedText = (text: string) => {
  let newText = text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");

  return newText.substring(0, 20000);
};

async function fetchWithTimeout(url: string, options = {}, timeout = 3000) {
  // Create an AbortController
  const controller = new AbortController();
  const { signal } = controller;

  // Set a timeout to abort the fetch
  const fetchTimeout = setTimeout(() => {
    controller.abort();
  }, timeout);

  // Start the fetch request with the abort signal
  return fetch(url, { ...options, signal })
    .then((response) => {
      clearTimeout(fetchTimeout); // Clear the timeout if the fetch completes in time
      return response;
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        throw new Error("Fetch request timed out");
      }
      throw error; // Re-throw other errors
    });
}
