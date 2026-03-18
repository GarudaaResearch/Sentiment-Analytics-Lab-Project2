import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentiment Analytics Lab | NLP Practical Course",
  description: "A university-level NLP practical course covering sentiment analysis from VADER to BERT and beyond. Interactive lessons, live Python playground, and more.",
  keywords: ["sentiment analysis", "NLP", "machine learning", "VADER", "BERT", "Python", "tutorial"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
