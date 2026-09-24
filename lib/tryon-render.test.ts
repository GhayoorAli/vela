import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isFrozenLens,
  mobileFpsLimit,
  mobileRenderSize,
  nextLowerTier,
} from "./tryon-render";

describe("mobileRenderSize", () => {
  it("keeps landscape buffers for every tier", () => {
    for (const tier of ["normal", "low", "safe"] as const) {
      const { width, height } = mobileRenderSize(tier);
      assert.ok(width >= height, `${tier} should be landscape`);
      assert.equal(width % 2, 0);
      assert.equal(height % 2, 0);
    }
  });

  it("steps down resolution for weaker tiers", () => {
    const normal = mobileRenderSize("normal");
    const low = mobileRenderSize("low");
    const safe = mobileRenderSize("safe");
    assert.ok(normal.width * normal.height > low.width * low.height);
    assert.ok(low.width * low.height > safe.width * safe.height);
  });
});

describe("mobileFpsLimit", () => {
  it("never exceeds 24 on phones", () => {
    assert.ok(mobileFpsLimit("normal") <= 24);
    assert.ok(mobileFpsLimit("low") <= mobileFpsLimit("normal"));
    assert.ok(mobileFpsLimit("safe") <= mobileFpsLimit("low"));
  });
});

describe("nextLowerTier", () => {
  it("walks normal → low → safe → null", () => {
    assert.equal(nextLowerTier("normal"), "low");
    assert.equal(nextLowerTier("low"), "safe");
    assert.equal(nextLowerTier("safe"), null);
  });
});

describe("isFrozenLens", () => {
  it("ignores warm-up (too few frames)", () => {
    assert.equal(
      isFrozenLens({
        avgFps: 2,
        lensFrameProcessingN: 5,
        lensFrameProcessingTimeMsMedian: 120,
      }),
      false,
    );
  });

  it("flags low fps after enough samples", () => {
    assert.equal(
      isFrozenLens({
        avgFps: 6,
        lensFrameProcessingN: 20,
        lensFrameProcessingTimeMsMedian: 40,
      }),
      true,
    );
  });

  it("flags heavy per-frame cost", () => {
    assert.equal(
      isFrozenLens({
        avgFps: 18,
        lensFrameProcessingN: 20,
        lensFrameProcessingTimeMsMedian: 90,
      }),
      true,
    );
  });

  it("passes a healthy feed", () => {
    assert.equal(
      isFrozenLens({
        avgFps: 20,
        lensFrameProcessingN: 30,
        lensFrameProcessingTimeMsMedian: 35,
      }),
      false,
    );
  });
});
