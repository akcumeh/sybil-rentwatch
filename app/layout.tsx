import type { Metadata } from "next";
import { Zen_Antique, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const zenAntique = Zen_Antique({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zen-antique",
});

const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "RentWatch",
  description: "Mutual accountability and trust platform for Lagos real estate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${zenAntique.variable} ${syne.variable} ${jetbrainsMono.variable} dark`}>
      <body className="antialiased min-h-screen bg-void text-primary font-body">
        {children}
      </body>
    </html>
  );
}
