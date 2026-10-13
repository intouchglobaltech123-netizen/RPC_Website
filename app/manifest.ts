import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RPC Constructions",
    short_name: "RPC",
    description: "Design-and-build construction company in Erode, Tamil Nadu.",
    start_url: "/",
    display: "standalone",
    /* kept in step with color-theme/colors.css: --brand-grey-light and --theme-primary-dark */
    background_color: "#eef0f3",
    theme_color: "#0f4980",
    icons: [{ src: "/logo.png", sizes: "512x512", type: "image/png" }],
  };
}
