import "@/styles/globals.css";
import "highlight.js/styles/magula.min.css";

import { Inter } from "next/font/google";
import { Providers } from "./providers";

export const metadata = {
  title: "Bamboo",
  description:
    "Bamboo is an AI-powered documentation tool that helps you create, manage, and share your project documentation with ease.",
  keywords:
    "AI documentation tool, project documentation, AI-powered docs, documentation management, Bamboo docs",
  authors: [{ name: "Bamboo", url: "https://bamboo-docs.com" }],
  openGraph: {
    title: "Bamboo - AI Powered Documentation Tool",
    description:
      "Bamboo is an AI-powered documentation tool that helps you create, manage, and share your project documentation with ease.",
    url: "https://bamboo-docs.com",
    siteName: "Bamboo",
    images: [
      {
        url: "https://bamboo-docs.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bamboo - AI Powered Documentation Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bamboo - AI Powered Documentation Tool",
    description:
      "Bamboo is an AI-powered documentation tool that helps you create, manage, and share your project documentation with ease.",
    images: ["https://bamboo-docs.com/og-image.png"],
    creator: "@bamboo_docs",
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
