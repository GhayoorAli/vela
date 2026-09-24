export type RenderTier = "normal" | "low" | "safe";

/**
 * Camera Kit render buffer for phones.
 *
 * Always landscape — phone cameras deliver landscape tracks; Snap warns against
 * arbitrary portrait pixel sizes. CSS `object-cover` fills the screen.
 *
 * Garment Transfer is SnapML: without setRenderSize it runs at the camera's
 * native resolution (often 1080p/4K), so each frame takes longer than a screen
 * refresh and the canvas looks frozen.
 */
export function mobileRenderSize(tier: RenderTier) {
  switch (tier) {
    case "safe":
      return { width: 320, height: 240 };
    case "low":
      return { width: 480, height: 360 };
    default:
      return { width: 640, height: 480 };
  }
}

export function mobileFpsLimit(tier: RenderTier) {
  switch (tier) {
    case "safe":
      return 12;
    case "low":
      return 18;
    default:
      return 24;
  }
}

/** Next lower quality step, or null when already at the floor. */
export function nextLowerTier(tier: RenderTier): RenderTier | null {
  if (tier === "normal") return "low";
  if (tier === "low") return "safe";
  return null;
}

/**
 * True when the lens is not producing a watchable live image.
 * Requires enough samples so we don't degrade during warm-up.
 */
export function isFrozenLens(stats: {
  avgFps: number;
  lensFrameProcessingN: number;
  lensFrameProcessingTimeMsMedian: number;
}) {
  if (stats.lensFrameProcessingN < 12) return false;
  if (stats.avgFps > 0 && stats.avgFps < 10) return true;
  if (stats.lensFrameProcessingTimeMsMedian > 70) return true;
  return false;
}
