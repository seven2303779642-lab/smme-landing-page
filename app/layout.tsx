import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bebasNeue = localFont({
  src: "./fonts/Bebas-Neue-400.ttf",
  weight: "400",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "SMM Entertainment",
  description: "Premium cinematic entertainment production",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${bebasNeue.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
