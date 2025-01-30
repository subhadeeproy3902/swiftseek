import { useToast } from "@/hooks/use-toast";
import Markdown from "react-markdown";
import { Copy, Info } from "lucide-react";
import remarkGfm from "remark-gfm";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Answer({ answer }: { answer: string }) {
  const { toast } = useToast();

  const downloadPDF = () => {
    if (!answer.trim()) return;

    const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
    pdf.setFont("Montserrat");

    const marginX = 15; // Fixed Page Margin
    const maxWidth = 180;
    let y = 20; // Initial Y position

    const lines = answer.split("\n");
    let tableRendered = false;
    let inCodeBlock = false; // Flag to track if we're inside a code block

    lines.forEach((line, index) => {
      line = line.replace(/\*\*/g, "").replace(/__/g, "")
      if (line.startsWith("# ")) {
        pdf.setFontSize(24).setFont("Montserrat", "bold");
        const headerText = line.replace("# ", "");
        const wrappedText = pdf.splitTextToSize(headerText, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 9; // Adjusting margin after h1 (40px in CSS)
      } else if (line.startsWith("## ")) {
        pdf.setFontSize(20).setFont("Montserrat", "bold");
        const headerText = line.replace("## ", "");
        const wrappedText = pdf.splitTextToSize(headerText, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 8; // Adjusting margin after h2 (32px in CSS)
      } else if (line.startsWith("### ")) {
        pdf.setFontSize(16).setFont("Montserrat", "bold");
        const headerText = line.replace("### ", "");
        const wrappedText = pdf.splitTextToSize(headerText, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 7; // Adjusting margin after h3 (28px in CSS)
      } else if (line.startsWith("#### ")) {
        pdf.setFontSize(14).setFont("Montserrat", "bold");
        const headerText = line.replace("#### ", "");
        const wrappedText = pdf.splitTextToSize(headerText, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 6; // Adjusting margin after h4 (24px in CSS)
      } else if (line.startsWith("##### ")) {
        pdf.setFontSize(12).setFont("Montserrat", "bold");
        const headerText = line.replace("##### ", "");
        const wrappedText = pdf.splitTextToSize(headerText, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 6; // Adjusting margin after h5 (20px in CSS)
      } else if (line.startsWith("###### ")) {
        pdf.setFontSize(10).setFont("Montserrat", "bold");
        const headerText = line.replace("###### ", "");
        const wrappedText = pdf.splitTextToSize(headerText, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 6; // Adjusting margin after h6 (16px in CSS)
      } else if (line.startsWith("|")) {
        if (!tableRendered) {
          const tableRows = lines
            .filter((l) => l.startsWith("|"))
            .map((row) => row.split("|").filter((col) => col.trim()));

          autoTable(pdf, {
            startY: y + 5,
            head: [tableRows[0]],
            body: tableRows.slice(1),
            styles: { fontSize: 10, cellPadding: 3 },
            theme: "grid",
            margin: { left: marginX, right: marginX },
          });

          // @ts-ignore
          y = pdf.lastAutoTable.finalY + 10;
          tableRendered = true;
        }
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        pdf.setFontSize(12).setFont("Montserrat", "normal");
        pdf.setTextColor(0);
        const listItem = line.slice(2).trim(); // Remove the bullet (either - or *)
        const wrappedText = pdf.splitTextToSize(`• ${listItem}`, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 6; // Adjusting margin for list items
      } else if (line.match(/^\d+\./)) {
        pdf.setFontSize(12).setFont("Montserrat", "normal");
        pdf.setTextColor(0);
        const listItem = line.slice(line.indexOf(".") + 1).trim(); // Remove the number
        const wrappedText = pdf.splitTextToSize(
          `${line[0]}. ${listItem}`,
          maxWidth
        );
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 6; // Adjusting margin for list items
      } else if (line.includes("**")) {
        pdf.setFontSize(12).setFont("Montserrat", "bold");
        pdf.setTextColor(0);
        const boldText = line.replace(/\*\*/g, "").replace(/__/g, "");
        const wrappedText = pdf.splitTextToSize(boldText, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 6;
      } else if (line.startsWith("```")) {
        // top padding
        y += 6;
        // Check if it's the start or end of a code block
        if (inCodeBlock) {
          inCodeBlock = false; // End of code block
        } else {
          inCodeBlock = true; // Start of code block
        }
      } else if (inCodeBlock) {
        // Inside a code block
        const formattedText = line.replace(/```/g, "");
        pdf.setFontSize(12).setFont("Courier", "normal");
        pdf.setTextColor(0);
        const wrappedText = pdf.splitTextToSize(formattedText, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 5;
      } else {
        pdf.setFontSize(12).setFont("Montserrat", "normal");
        pdf.setTextColor(0);
        const wrappedText = pdf.splitTextToSize(line, maxWidth);
        pdf.text(wrappedText, marginX, y);
        y += wrappedText.length * 6;
      }

      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
    });

    pdf.save("swiftseek-report.pdf");
  };

  return (
    <div className="container flex h-auto w-full shrink-0 gap-4 rounded-lg border border-solid border-[#ffe5c1] bg-white p-5 lg:p-10">
      <div className="w-full">
        <div className="flex items-center justify-between pb-3">
          <div className="flex gap-4">
            <Info size={24} />
            <h3 className="text-base font-bold uppercase text-black">
              Answer:
            </h3>
          </div>
          {answer && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(answer.trim());
                  toast({ description: "Answer copied to clipboard" });
                }}
              >
                <Copy size={24} />
              </button>
            </div>
          )}
        </div>
        <div className="w-full text-base font-light leading-[152.5%] text-black">
          {answer ? (
            <>
              <div className="markdown text-wrap p-4 md:p-8 w-full">
                <Markdown className="report" remarkPlugins={[remarkGfm]}>
                  {answer.trim()}
                </Markdown>
              </div>
              <button
                className="mt-4 rounded-lg bg-[#FFD700] px-4 py-2 text-xs font-bold uppercase text-black"
                onClick={downloadPDF}
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
  );
}
