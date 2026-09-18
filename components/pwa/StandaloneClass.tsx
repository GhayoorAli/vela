"use client";

import { useEffect } from "react";

export function StandaloneClass() {
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    document.documentElement.classList.toggle("standalone", standalone);
  }, []);
  return null;
}
