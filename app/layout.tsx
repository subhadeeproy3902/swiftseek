import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import PlausibleProvider from "next-plausible";
import "./globals.css";

const inter = Lexend({ subsets: ["latin"] });

let title = "SwiftSeek – AI Search Engine";
let description =
  "Search smarter and faster with our open source AI search engine";
let url = "https://SwiftSeek.io/";
let ogimage = "https://SwiftSeek.io/og-image.png";
let sitename = "SwiftSeek.io";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="SwiftSeek.io" />
      </head>
      <body
        className={`${inter.className} overflow-x-hidden flex min-h-screen relative flex-col justify-between bg-orange-50`}
      >
        {children}
      </body>
    </html>
  );
}
