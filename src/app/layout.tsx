import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import NavigationLoader from "../components/NavigationLoader";

import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UtilsKit - Essential Developer Tools Collection",
  description:
    "A comprehensive collection of essential developer tools including JSON formatters, regex testers, encoders, web generators, and more. All tools work locally in your browser.",
  keywords:
    "utilskit, developer tools, json formatter, regex tester, base64 encoder, jwt decoder, og meta generator, manifest generator, cron parser, semver, curl to code",
  authors: [{ name: "UtilsKit" }],
  creator: "UtilsKit",
  publisher: "UtilsKit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://utilskit.com"),
  alternates: {
    canonical: "https://utilskit.com",
  },
  openGraph: {
    title: "UtilsKit - Essential Developer Tools Collection",
    description:
      "A comprehensive collection of essential developer tools including JSON formatters, regex testers, encoders, web generators, and more.",
    url: "https://utilskit.com",
    siteName: "UtilsKit",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UtilsKit - Essential Developer Tools Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UtilsKit - Essential Developer Tools Collection",
    description:
      "A comprehensive collection of essential developer tools including JSON formatters, regex testers, encoders, web generators, and more.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-ZKBPEJ1Z84" />
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="UtilsKit" />
        <meta name="application-name" content="UtilsKit" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NavigationLoader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
