import type { Metadata } from "next";
import { Geist, Geist_Mono, Tiny5 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tiny5 = Tiny5({
  variable: "--font-tiny5",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
    title: "Japan's Vision of Empire in Manchuria",
    description: "A visual exploration of Japan's vision of empire in Manchuria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tiny5.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
