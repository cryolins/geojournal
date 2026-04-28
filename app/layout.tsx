import type { Metadata } from "next";
import { Inter, Public_Sans, Coming_Soon, Dangrek } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { StorageListener } from "@/components/event-listeners";
import { ImageKitProvider } from "@imagekit/next";
import Image from "next/image";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})
export const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const comingSoon = Coming_Soon({
  weight: "400",
  variable: "--font-coming-soon",
  subsets: ["latin"],
});

export const dangrek = Dangrek({
  weight: "400",
  variable: "--font-dangrek",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "geojournal!",
  description: "geojournal!: write down notes on a map!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative">
        <SessionProvider>
          <ImageKitProvider urlEndpoint="https://ik.imagekit.io/icepei1397">
            <StorageListener/>
            <div className="fixed inset-0 -z-10">
              <Image src="/journal-images/cover-background.png" alt="scrapbook background" 
              fill className="object-cover"/>
            </div>
            {children}
            <div id="modal-root"></div>
          </ImageKitProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
