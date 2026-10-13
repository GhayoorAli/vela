import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Vela",
    short_name: "Vela",
    description:
      "Find your look with AI styling and see camera-enabled pieces on yourself with live AR try-on.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#EEEAE2",
    theme_color: "#301E28",
    lang: "en",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "AI personal stylist",
        short_name: "AI stylist",
        url: "/stylist",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Shop the collection",
        short_name: "Shop",
        url: "/shop",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Live try-on",
        short_name: "Try on",
        url: "/try-on",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Your bag",
        short_name: "Bag",
        url: "/cart",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
