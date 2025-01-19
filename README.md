# SwiftSeek - Search Smarter & Faster

**SwiftSeek** is an intelligent search platform that leverages advanced AI models and APIs to help you search smarter and faster. It provides sources, images, YouTube videos, and a detailed report on any topic you search. Additionally, it offers similar questions and topics, making your search experience more comprehensive.

## Features

- **AI-powered Search:** SwiftSeek utilizes advanced AI models (Together AI, Groq) to provide faster and smarter search results.
- **Comprehensive Search Results:** Get relevant sources, images, and YouTube videos related to your search query.
- **Detailed Reports:** The platform prepares an in-depth report about your topic, gathering data from multiple reliable sources.
- **Topic Recommendations:** Receive similar questions and topics based on your search query to help you explore related areas of interest.
- **User-friendly Interface:** Built with Next.js, TypeScript, and Tailwind CSS for a fast and responsive UI.

## Tech Stack

- **Frontend:**  
  - [Next.js](https://nextjs.org/)  
  - [TypeScript](https://www.typescriptlang.org/)  
  - [Tailwind CSS](https://tailwindcss.com/)  

- **AI Models:**  
  - [Together AI](https://www.together.xyz/)  
  - [Groq](https://www.groq.com/)

- **APIs:**
  - [Google YouTube API](https://developers.google.com/youtube/v3)  
  - [Tavily API](https://tavily.com/)

## Installation

1. Clone the repository:

  ```bash
   git clone https://github.com/subhadeeproy3902/swiftseek.git
   cd swiftseek
  ```

2. Install the dependencies:

  ```bash
  npm install
  ```

3. Set up environment variables:

  - Create a `.env` file in the root directory and add the following keys: 

  ```makefile
  TAVILY_API_KEY=
  NEXT_PUBLIC_YOUTUBE_API_KEY=
  GROQ_API_KEY=
  HELICONE_API_KEY=
  TOGETHER_API_KEY=
  ```

4. Run the application:

  ```bash
  npm run dev
  ```

5. Visit `http://localhost:3000` to start using SwiftSeek.

## Usage

1. Go to the homepage of SwiftSeek.
2. Enter your search query into the search bar provided.
3. SwiftSeek will display:
   - **Relevant Sources:** Links to articles and webpages related to your search term.
   - **Images:** A collection of images sourced from reliable platforms.
   - **YouTube Videos:** Embedded video content relevant to your query.
   - **Detailed Report:** A comprehensive report summarizing the key points and insights about your topic.
   - **Similar Questions and Topics:** Suggestions to explore related subjects or queries for deeper understanding.
4. Use the interactive interface to navigate and refine your search as needed.

## License

This project is licensed under the [Apache License](./LICENSE)

---

Made with ❤️ by the [Subhadeep Roy](git.new/Subha)