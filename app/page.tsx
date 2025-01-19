"use client";

import Answer from "@/components/shared/Answer";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import Hero from "@/components/shared/Hero";
import InputArea from "@/components/shared/InputArea";
import SimilarTopics from "@/components/shared/SimilarTopics";
import Sources from "@/components/shared/Sources";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { ImageCarousel } from "@/components/shared/ImageArea";
import { CircleHelp } from "lucide-react";
import { VideoArea } from "@/components/shared/VideoArea";

export default function Home() {
  const [promptValue, setPromptValue] = useState("");
  const [question, setQuestion] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sources, setSources] = useState<SearchResult[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [answer, setAnswer] = useState("");
  const [similarQuestions, setSimilarQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [ytVideos, setYtVideos] = useState<FinalResultResponse[]>([]);
  const [images, setImages] = useState<ImageProps[]>([]);

  const handleDisplayResult = async (newQuestion?: string) => {
    newQuestion = newQuestion || promptValue;

    setShowResult(true);
    setLoading(true);
    setQuestion(newQuestion);
    setPromptValue("");

    await Promise.all([
      handleSourcesAndAnswer(newQuestion),
      handleSimilarQuestions(newQuestion),
      handleYoutubeVideos(newQuestion),
    ]);

    setLoading(false);
  };

  async function handleSourcesAndAnswer(question: string) {
    setIsLoadingSources(true);
    let sourcesResponse = await fetch("/api/getSources", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    if (sourcesResponse.ok) {
      let sources: SearchResponse = await sourcesResponse.json();
      setImages(sources.images);
      setSources(sources.results);
    } else {
      setSources([]);
    }
    setIsLoadingSources(false);

    const response = await fetch("/api/getAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, sources }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (response.status === 202) {
      const fullAnswer = await response.text();
      setAnswer(fullAnswer);
      return;
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          setAnswer((prev) => prev + text);
        } catch (e) {
          throw new Error(`Failed to parse JSON: ${e}`);
        }
      }
    };

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
  }

  async function handleSimilarQuestions(question: string) {
    let res = await fetch("/api/getSimilarQuestions", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    let questions = await res.json();
    const { similarTopics } = questions;
    setSimilarQuestions(similarTopics as string[]);
  }

  async function handleYoutubeVideos(question: string) {
    let res = await fetch("/api/getYt", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    let videos: FinalResultResponse[] = await res.json();
    setYtVideos(videos);
  }

  const reset = () => {
    setShowResult(false);
    setPromptValue("");
    setQuestion("");
    setAnswer("");
    setSources([]);
    setSimilarQuestions([]);
    setYtVideos([]);
  };

  console.log(similarQuestions);

  return (
    <>
      <div className="absolute h-screen w-full overflow-hidden">
        <div className="relative h-screen w-full overflow-hidden">
          <div className="animate-blob absolute -left-4 top-0 h-72 w-72 rounded-full bg-orange-300 opacity-30 mix-blend-multiply blur-3xl filter"></div>
          <div className="animate-blob animation-delay-2000 absolute -right-4 top-0 h-72 w-72 rounded-full bg-yellow-300 opacity-30 mix-blend-multiply blur-3xl filter"></div>
          <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-1/2 h-72 w-72 -translate-x-1/2 transform rounded-full bg-pink-300 opacity-30 mix-blend-multiply blur-3xl filter"></div>
        </div>
      </div>

      <div className="flex h-screen w-full flex-col items-center justify-between max-w-5xl mx-auto">
        <main className="z-50 h-full px-4 pb-4 w-full">
          {!showResult && (
            <>
              <Header />
              <Hero
                promptValue={promptValue}
                setPromptValue={setPromptValue}
                handleDisplayResult={handleDisplayResult}
              />
            </>
          )}

          {showResult && (
            <div className="flex h-full min-h-[68vh] w-full grow flex-col justify-between mt-12">
              <div className="container w-full space-y-2">
                <div className="container space-y-2">
                  <div className="container flex w-full items-start gap-3 px-5 pt-2 lg:px-10">
                    <div className="flex w-fit items-center gap-4">
                      <CircleHelp size={24} />
                      <p className="pr-5 font-bold uppercase leading-[152%] text-black">
                        Question:
                      </p>
                    </div>
                    <div className="grow">&quot;{question}&quot;</div>
                  </div>
                  <>
                    <Sources sources={sources} isLoading={isLoadingSources} />
                    <ImageCarousel
                      items={images}
                      isLoading={isLoadingSources}
                    />
                    <VideoArea videos={ytVideos} isLoading={isLoadingSources} />
                    <Answer answer={answer} />
                    <SimilarTopics
                      similarQuestions={similarQuestions}
                      handleDisplayResult={handleDisplayResult}
                      reset={reset}
                    />
                  </>
                </div>

                <div className="pt-1 sm:pt-2" ref={chatContainerRef}></div>
              </div>
              <div className="container px-4 lg:px-0 pb-8">
                <InputArea
                  promptValue={promptValue}
                  setPromptValue={setPromptValue}
                  handleDisplayResult={handleDisplayResult}
                  disabled={loading}
                  reset={reset}
                />
              </div>
            </div>
          )}
        </main>
        {!showResult && <Footer />}
      </div>
    </>
  );
}
