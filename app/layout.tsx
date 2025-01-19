import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwiftSeek",
  description: "SwiftSeek is a search engine for Swift documentation.",
  metadataBase: new URL("https://swiftseek.vercel.app"),
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-x-hidden flex min-h-screen relative flex-col justify-between bg-orange-50`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
