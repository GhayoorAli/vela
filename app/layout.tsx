import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import "./globals.css";
import "./editorial.css";
import "./typography.css";
import "./shopping-studio.css";
import "./catalog.css";

const display = localFont({
  src: [
    {
      path: "../public/fonts/bodoni-moda-variable.ttf",
      weight: "400 900",
      style: "normal",
    },
    {
      path: "../public/fonts/bodoni-moda-italic.ttf",
      weight: "400 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-display",
});

const sans = localFont({
  src: "../public/fonts/manrope-variable.ttf",
  weight: "200 800",
  display: "swap",
  variable: "--font-sans",
});

const APP_NAME = "Vela";
const APP_DESCRIPTION =
  "A more personal way to shop: discover AI outfit suggestions, explore everyday pieces, and try camera-enabled styles on live with AR.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: "%s · Vela",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#301E28",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${sans.variable} ${display.variable} bg-paper font-sans text-ink antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
