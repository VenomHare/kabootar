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
  metadataBase: new URL("https://kabootar.draftmymail.com"),
  title: {
    default: "Kabootar — Lightweight Email Sending Webapp",
    template: "%s | Kabootar",
  },
  description:
    "Kabootar is a sleek, minimal, open-source email sending app built with Next.js 13+, Tailwind CSS, and Supabase. Send and browse outgoing emails with a blazingly fast UI.",
  applicationName: "Kabootar",
  keywords: [
    "kabootar",
    "email",
    "mail",
    "next.js",
    "supabase",
    "tailwind",
    "webapp",
    "outbox",
    "nodemailer",
    "open source",
    "mailer"
  ],
  authors: [
    { name: "Kabootar Authors", url: "https://github.com/venomhare/kabootar" }
  ],
  creator: "Kabootar Authors",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: [
      { rel: "mask-icon", url: "/logo.png" }
    ],
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
    { media: "(prefers-color-scheme: light)", color: "#38bdf8" }
  ],
  colorScheme: "light dark",
  openGraph: {
    type: "website",
    url: "https://kabootar.draftmymail.com",
    title: "Kabootar — Lightweight Email Sending Webapp",
    description:
      "Sleek, minimal, open-source email sending app built with Next.js, Tailwind CSS, and Supabase. Send and browse outgoing emails with a blazingly fast UI.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Kabootar Logo"
      }
    ],
    siteName: "Kabootar",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kabootar",
    title: "Kabootar — Lightweight Email Sending Webapp",
    description:
      "Sleek, minimal, open-source email sending app built with Next.js, Tailwind CSS, and Supabase.",
    images: ["/logo.png"],
  },
  category: "productivity",
  robots: {
    index: false,
    follow: false,
    nocache: false,
    googleBot: {
      index: false,
      follow: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  other: {
    "msapplication-TileColor": "#38bdf8",
    "google-site-verification": "", // Fill this if needed
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
