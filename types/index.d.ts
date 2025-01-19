interface FinalResultResponse {
  name: string;
  url: string;
  image: string;
}

interface SearchResult {
  url: string;
  title: string;
  content: string;
  score: number;
  raw_content: null;
}

interface SearchResponse {
  query: string;
  follow_up_questions: string | null;
  answer: string;
  images: {
    url: string;
    description: string;
  }[];
  results: SearchResult[];
}

interface ImageProps {
  url: string;
  description: string;
}