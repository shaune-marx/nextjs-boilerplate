import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "playdate",
    short_name: "playdate",
    description:
      "we’ll send you one fun question every day, addressed to a friend you want to talk to more often.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [
      {
        src: "/icon.png", // you added this (512x512)
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png", // 180x180
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
