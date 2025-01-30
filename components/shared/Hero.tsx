import Image from "next/image";
import { FC } from "react";
import InputArea from "./InputArea";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: () => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <a
        className="mb-4 inline-flex h-7 shrink-0 items-center gap-[9px] rounded-[50px] border-[0.5px] border-solid border-[#ff9232] bg-orange-100/20 px-4 py-4 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)]"
        href="https://www.together.ai/"
        target="_blank"
      >
        <span className="text-center text-base font-light leading-[normal] text-[#1B1B16]">
          Together AI, Tavily and more
        </span>
      </a>
      <h2 className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 bg-clip-text text-transparent pb-7 pt-2 opacity-100 saturate-200 text-center text-3xl font-semibold leading-[normal] lg:text-[64px] drop-shadow-2xl">
        Search smarter & faster
      </h2>

      {/* input section */}
      <div className="w-full max-w-[708px] pb-6">
        <InputArea
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleDisplayResult={handleDisplayResult}
        />
      </div>

      {/* Suggestions section */}
      <div className="flex flex-wrap items-center justify-center gap-4 pb-[30px] lg:flex-nowrap lg:justify-normal mt-5">
        {suggestions.map((item) => (
          <div
            className="flex h-[35px] cursor-pointer items-center justify-center gap-[5px] border border-solid border-orange-500 rounded-full bg-orange-200/20 px-4 py-2"
            onClick={() => handleClickSuggestion(item?.name)}
            key={item.id}
          >
            <Image
              unoptimized
              src={item.icon}
              alt={item.name}
              width={18}
              height={16}
              className="w-[18px]"
            />
            <span className="text-sm font-light leading-[normal] text-[#1B1B16]">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Github link section */}
      <p className="text-center text-sm font-light leading-[normal] text-[#1B1B16]">
        Fully open source!{" "}
        <span className="text-sm font-medium underline">
          <a
            href="https://github.com/subhadeeproy3902/swiftseek"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star it on github.
          </a>
        </span>
      </p>
    </div>
  );
};

type suggestionType = {
  id: number;
  name: string;
  icon: string;
};

const suggestions: suggestionType[] = [
  {
    id: 1,
    name: "Photosynthesis process in plants",
    icon: "/img/icon _leaf_.svg",
  },
  {
    id: 2,
    name: "The benefits of weightlifting",
    icon: "/img/icon _dumbell_.svg",
  },
  {
    id: 3,
    name: "Einstein's theory of relativity",
    icon: "/img/icon _atom_.svg",
  },
];

export default Hero;
