import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const loadBrandFonts = async () => {
  await Promise.all([
    loadFont({
      family: "Clash Display",
      url: staticFile("fonts/ClashDisplay-Medium.woff2"),
      weight: "500",
    }),
    loadFont({
      family: "Clash Display",
      url: staticFile("fonts/ClashDisplay-Semibold.woff2"),
      weight: "600",
    }),
    loadFont({
      family: "Clash Display",
      url: staticFile("fonts/ClashDisplay-Bold.woff2"),
      weight: "700",
    }),
    loadFont({
      family: "General Sans",
      url: staticFile("fonts/GeneralSans-Regular.woff2"),
      weight: "400",
    }),
    loadFont({
      family: "General Sans",
      url: staticFile("fonts/GeneralSans-Medium.woff2"),
      weight: "500",
    }),
  ]);
};

loadBrandFonts();
