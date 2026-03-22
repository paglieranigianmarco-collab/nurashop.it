import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NURA | Crea la tua Nura Box",
  description:
    "La prima piattaforma wellness in Italia. Entra nella Founders List e ricevi il 20% di sconto al lancio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${inter.className} antialiased bg-black text-white min-h-screen selection:bg-[#C9A84C]/20 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
