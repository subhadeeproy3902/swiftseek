import { useToast } from "@/hooks/use-toast";
import Markdown from "react-markdown";
import { Margin, usePDF } from "react-to-pdf";
import { Copy, Info } from "lucide-react";
import remarkGfm from 'remark-gfm';

export default function Answer({ answer }: { answer: string }) {
  const { toPDF, targetRef } = usePDF({
    filename: "report.pdf",
    page: {
      margin: Margin.MEDIUM,
      format: "letter",
    },
  });

  const { toast } = useToast();

  return (
    <div className="container flex h-auto w-full shrink-0 gap-4 rounded-lg border border-solid border-[#ffe5c1] bg-white p-5 lg:p-10">
      <div className="w-full">
        <div className="flex items-center justify-between pb-3">
          <div className="flex gap-4">
            <Info size={24} />
            <h3 className="text-base font-bold uppercase text-black">
              Answer:{" "}
            </h3>
          </div>
          {answer && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(answer.trim());
                  toast({
                    description: "Answer copied to clipboard",
                  });
                }}
              >
                <Copy size={24} />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap content-center items-center gap-[15px]">
          <div className="w-full text-base font-light leading-[152.5%] text-black">
            {answer ? (
              <>
                <div
                  ref={targetRef}
                  className="markdown text-wrap p-4 md:p-8"
                >
                  <Markdown className="report" remarkPlugins={[remarkGfm]}>{answer.trim()}</Markdown>
                </div>
                <button
                  className="rounded-lg bg-[#FFD700] px-4 py-2 text-xs font-bold uppercase text-black"
                  onClick={() => toPDF()}
                >
                  Download Report
                </button>
              </>
            ) : (
              <div className="flex w-full flex-col gap-2">
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
