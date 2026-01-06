import type { Metadata } from "next";
import {
  Architects_Daughter,
  Fira_Code,
  Noto_Sans_Georgian,
} from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const firaCode = Fira_Code({
  variable: "--font-mono",
});

const georgia = Noto_Sans_Georgian({
  variable: "--font-sans",
});

const archDaughter = Architects_Daughter({
  variable: "--font-sans-serif",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Kabootar",
  description: "Mail Sending App",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Kabootar",
    description: "Lightweight email sending webapp.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${georgia.variable} ${firaCode.variable} ${archDaughter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
