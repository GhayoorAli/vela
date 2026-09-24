"use client";

import {
  Camera,
  Check,
  Download,
  Loader2,
  RefreshCcw,
  Share2,
  ShoppingBag,
  SwitchCamera,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { TryOnProduct } from "@/lib/types";

/* ------------------------------------------------------------------------ */
/* Camera Kit plumbing                                                       */
/* ------------------------------------------------------------------------ */

type CameraKitModule = typeof import("@snap/camera-kit");
type CameraKit = import("@snap/camera-kit").CameraKit;
type CameraKitSession = import("@snap/camera-kit").CameraKitSession;
type Lens = import("@snap/camera-kit").Lens;
type Facing = "user" | "environment";

let sdkPromise: Promise<CameraKitModule> | null = null;
let kitPromise: Promise<CameraKit> | null = null;
let kitToken: string | null = null;

/** The SDK downloads a WASM runtime on bootstrap — do it once per page life. */
async function getCameraKit(apiToken: string) {
  sdkPromise ??= import("@snap/camera-kit");
  const sdk = await sdkPromise;
  if (!kitPromise || kitToken !== apiToken) {
    kitToken = apiToken;
    kitPromise = sdk.bootstrapCameraKit({ apiToken, logger: "noop" });
  }
  return { sdk, kit: await kitPromise };
}

function isSupported() {
  if (typeof window === "undefined") return false;
  if (!navigator.mediaDevices?.getUserMedia) return false;
  if (typeof WebAssembly === "undefined") return false;
  const probe = document.createElement("canvas");
  return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
}

function isMobileClient() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }
  if ((navigator.maxTouchPoints ?? 0) > 1 && window.matchMedia("(max-width: 1024px)").matches) {
    return true;
  }
  return window.matchMedia("(max-width: 900px) and (pointer: coarse)").matches;
}

type RenderBudget = {
  fps: number;
  /** Canvas drawing-buffer size (Camera Kit writes into this). */
  canvasW: number;
  canvasH: number;
};

/** Mobile gets a tiny buffer + low FPS — Garment Transfer is SnapML-heavy on web. */
function renderBudget(): RenderBudget {
  if (isMobileClient()) {
    return { fps: 12, canvasW: 480, canvasH: 360 };
  }
  return { fps: 30, canvasW: 960, canvasH: 540 };
}

/**
 * Snap: request standard *landscape* ideals (never window/portrait pixel sizes).
 * Phones orient the buffer themselves.
 */
function cameraConstraints(facing: Facing, budget: RenderBudget): MediaStreamConstraints {
  return {
    audio: false,
    video: {
      facingMode: facing === "user" ? "user" : { ideal: "environment" },
      width: { ideal: budget.canvasW },
      height: { ideal: budget.canvasH },
      frameRate: { ideal: budget.fps, max: budget.fps + 6 },
    },
  };
}

async function openCamera(facing: Facing) {
  const budget = renderBudget();
  const attempts: MediaStreamConstraints[] = [
    cameraConstraints(facing, budget),
    // iOS often rejects frameRate
    {
      audio: false,
      video: {
        facingMode: facing === "user" ? "user" : { ideal: "environment" },
        width: { ideal: budget.canvasW },
        height: { ideal: budget.canvasH },
      },
    },
    {
      audio: false,
      video: {
        facingMode: facing === "user" ? "user" : { ideal: "environment" },
      },
    },
  ];

  let lastErr: unknown;
  for (const constraints of attempts) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const track = stream.getVideoTracks()[0];
      if (track) {
        try {
          // Prefer throughput over still-image sharpness when the UA supports it.
          (track as MediaStreamTrack & { contentHint?: string }).contentHint = "motion";
        } catch {
          /* ignore */
        }
      }
      return stream;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Could not open the camera.");
}

/**
 * Pin the canvas *bitmap* to our budget. CSS still scales it full-screen —
 * that scaling is cheap; rendering full retina buffers is what freezes phones.
 */
function pinCanvasBuffer(canvas: HTMLCanvasElement, budget: RenderBudget) {
  if (canvas.width !== budget.canvasW) canvas.width = budget.canvasW;
  if (canvas.height !== budget.canvasH) canvas.height = budget.canvasH;
}

/** Force Camera Kit's render resolution to match the pinned canvas buffer. */
async function syncRenderSize(
  source: { setRenderSize: (w: number, h: number) => Promise<void> },
  budget: RenderBudget,
) {
  // Wait on mobile — track/orientation settle; then lock to the small buffer.
  if (isMobileClient()) {
    await new Promise((r) => window.setTimeout(r, 300));
  }
  await source.setRenderSize(budget.canvasW, budget.canvasH);
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop());
}

/** Turn Camera Kit's raw lens-loading errors into something a person can act on. */
function describeLensError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  if (/\[16\]|UNAUTHENTICATED|401/i.test(msg)) {
    return "Camera Kit rejected the API token. Check CAMERA_KIT_API_TOKEN.";
  }
  if (/\[7\]|PERMISSION_DENIED|403/i.test(msg)) {
    return "This lens isn't available to this app. Check the lens group in the Camera Kit portal.";
  }
  if (/\[5\]|NOT_FOUND|404|not found/i.test(msg)) {
    return "Lens not found. Check the product's Lens ID and Lens Group ID.";
  }
  if (/network|fetch|offline|\[14\]|UNAVAILABLE/i.test(msg)) {
    return "Network problem while loading the lens. Check your connection and retry.";
  }
  return "Couldn't load this piece right now.";
}

/* ------------------------------------------------------------------------ */
/* Component                                                                 */
/* ------------------------------------------------------------------------ */

type Phase =
  | "intro"
  | "starting"
  | "live"
  | "denied"
  | "unsupported"
  | "error";

export function TryOnRoom({
  apiToken,
  products,
  initialSlug,
  backHref,
}: {
  apiToken: string;
  products: TryOnProduct[];
  initialSlug?: string;
  backHref: string;
}) {
  const router = useRouter();
  const { addItem, count } = useCart();

  // Phones: one garment at a time. Carousel + Garment Transfer thrash the GPU.
  const roomProducts = useMemo(() => {
    if (typeof window === "undefined" || !isMobileClient()) return products;
    if (!initialSlug) return products.slice(0, 1);
    const hit = products.find((p) => p.slug === initialSlug);
    return hit ? [hit] : products.slice(0, 1);
  }, [products, initialSlug]);

  const startIndex = Math.max(
    0,
    roomProducts.findIndex((p) => p.slug === initialSlug),
  );
  const [index, setIndex] = useState(startIndex);
  const active = roomProducts[index] ?? roomProducts[0];

  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fitting, setFitting] = useState(false);
  const [facing, setFacing] = useState<Facing>("user");
  const [canFlip, setCanFlip] = useState(false);
  const [shot, setShot] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [size, setSize] = useState(
    () => active?.sizes[Math.floor((active?.sizes.length ?? 1) / 2)] ?? "",
  );
  const [color, setColor] = useState(active?.colors[0]);
  const [added, setAdded] = useState(false);
  /** Mobile shows a native <video> until AR is ready — Canvas Kit freezes if started hidden. */
  const [feed, setFeed] = useState<"native" | "ar">("ar");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const kitRef = useRef<CameraKit | null>(null);
  const sessionRef = useRef<CameraKitSession | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lensCache = useRef(new Map<string, Lens>());
  const brokenLenses = useRef(new Set<string>());
  const runRef = useRef(0);
  const applySeq = useRef(0);
  const facingRef = useRef<Facing>("user");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const attachNativePreview = useCallback(async (stream: MediaStream, facing: Facing) => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.style.transform = facing === "user" ? "scaleX(-1)" : "none";
    try {
      await video.play();
    } catch {
      /* autoplay quirks — playsInline + muted usually ok */
    }
  }, []);

  const clearNativePreview = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.srcObject = null;
  }, []);

  /* --------------------------------------------------------------------- */
  /* Lens application                                                       */
  /* --------------------------------------------------------------------- */

  const loadLens = useCallback(async (product: TryOnProduct) => {
    const kit = kitRef.current;
    if (!kit) throw new Error("Camera Kit is not ready.");
    const cached = lensCache.current.get(product.lensId);
    if (cached) return cached;
    const lens = await kit.lensRepository.loadLens(
      product.lensId,
      product.lensGroupId,
    );
    lensCache.current.set(product.lensId, lens);
    return lens;
  }, []);

  const wear = useCallback(
    async (product: TryOnProduct) => {
      const session = sessionRef.current;
      if (!session) return;
      const seq = ++applySeq.current;
      setFitting(true);
      try {
        const lens = await loadLens(product);
        if (seq !== applySeq.current) return;
        await session.applyLens(lens);
      } catch (err) {
        if (seq !== applySeq.current) return;
        brokenLenses.current.add(product.lensId);
        showToast(describeLensError(err));
      } finally {
        if (seq === applySeq.current) setFitting(false);
      }
    },
    [loadLens, showToast],
  );

  /** Warm nearby lenses so switching feels instant without thrashing mobile. */
  const prefetch = useCallback(async () => {
    // Garment Transfer assets are huge — never warm them on phones.
    if (isMobileClient()) return;
    const kit = kitRef.current;
    if (!kit) return;
    try {
      const targets = roomProducts.filter((p) => p.lensId !== active?.lensId);
      const lenses: Lens[] = [];
      for (const p of targets) {
        try {
          lenses.push(await loadLens(p));
        } catch {
          /* missing lens — surfaced when the user selects it */
        }
      }
      if (lenses.length) await kit.lensRepository.cacheLensContent(lenses);
    } catch {
      /* best-effort */
    }
  }, [roomProducts, active?.lensId, loadLens]);

  /* --------------------------------------------------------------------- */
  /* Session lifecycle                                                      */
  /* --------------------------------------------------------------------- */

  const teardown = useCallback(async () => {
    runRef.current += 1;
    const session = sessionRef.current;
    sessionRef.current = null;
    clearNativePreview();
    stopStream(streamRef.current);
    streamRef.current = null;
    if (session) {
      try {
        await session.pause();
        await session.destroy();
      } catch {
        /* already gone */
      }
    }
  }, [clearNativePreview]);

  const start = useCallback(async () => {
    if (!active) return;
    const run = ++runRef.current;
    setError(null);

    if (!isSupported()) {
      setPhase("unsupported");
      return;
    }

    setPhase("starting");
    setStep("Opening camera…");

    let stream: MediaStream;
    try {
      stream = await openCamera(facingRef.current);
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setPhase("denied");
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setPhase("error");
        setError("No camera was found on this device.");
      } else {
        setPhase("error");
        setError(
          err instanceof Error ? err.message : "Could not open the camera.",
        );
      }
      return;
    }
    if (run !== runRef.current) {
      stopStream(stream);
      return;
    }
    streamRef.current = stream;

    const mobile = isMobileClient();

    try {
      // Phones: show native camera IMMEDIATELY. Camera Kit WebGL often freezes
      // if play() starts while the canvas is covered/hidden (opacity-0 overlay).
      if (mobile) {
        await attachNativePreview(stream, facingRef.current);
        setFeed("native");
        setPhase("live");
        setStep("Preparing AR…");
      }

      navigator.mediaDevices
        .enumerateDevices()
        .then((list) =>
          setCanFlip(list.filter((d) => d.kind === "videoinput").length > 1),
        )
        .catch(() => setCanFlip(false));

      if (!mobile) setStep("Loading AR engine…");
      const { sdk, kit } = await getCameraKit(apiToken);
      if (run !== runRef.current) return;
      kitRef.current = kit;

      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Render surface missing.");
      const budget = renderBudget();
      pinCanvasBuffer(canvas, budget);

      // Prefetch the lens while the native preview is still rolling.
      let readyLens: Lens | null = null;
      if (mobile && active) {
        try {
          readyLens = await loadLens(active);
        } catch (err) {
          brokenLenses.current.add(active.lensId);
          showToast(describeLensError(err));
        }
      }

      if (run !== runRef.current) return;

      const session = await kit.createSession({ liveRenderTarget: canvas });
      if (run !== runRef.current) {
        await session.destroy();
        return;
      }
      sessionRef.current = session;

      session.events.addEventListener("error", ({ detail }) => {
        const { error: e, lens } = detail;
        if (e.name === "LensExecutionError") {
          brokenLenses.current.add(lens.id);
          showToast("This piece stopped rendering. Pick another one.");
        } else if (e.name === "LensAbortError") {
          setPhase("error");
          setError("The AR engine stopped. Reload the page to try again.");
        }
      });

      const source = sdk.createMediaStreamSource(stream, {
        cameraType: facingRef.current,
        transform:
          facingRef.current === "user"
            ? sdk.Transform2D.MirrorX
            : sdk.Transform2D.Identity,
        disableSourceAudio: true,
        fpsLimit: budget.fps,
      });
      await session.setSource(source);
      await session.setFPSLimit(budget.fps);

      // Reveal WebGL canvas, then play — never call play() while opacity-0.
      if (mobile) {
        setFeed("ar");
        setFitting(true);
        await new Promise((r) => requestAnimationFrame(() => r(undefined)));
        clearNativePreview();
      } else {
        setPhase("live");
        setFeed("ar");
      }

      await session.play("live");
      if (!mobile) {
        try {
          await syncRenderSize(source, budget);
        } catch {
          /* best-effort */
        }
      }
      if (run !== runRef.current) return;

      setStep(`Fitting ${active.name}…`);
      if (mobile && readyLens) {
        const seq = ++applySeq.current;
        try {
          await session.applyLens(readyLens);
        } catch (err) {
          brokenLenses.current.add(active.lensId);
          showToast(describeLensError(err));
        } finally {
          if (seq === applySeq.current) setFitting(false);
        }
      } else {
        await wear(active);
      }
      if (run !== runRef.current) return;

      if (!mobile) {
        window.setTimeout(() => {
          if (run === runRef.current) void prefetch();
        }, 800);
      }
    } catch (err) {
      if (run !== runRef.current) return;
      const name = err instanceof Error ? err.name : "";
      setPhase("error");
      setFeed("ar");
      setError(
        name === "BootstrapError"
          ? "The AR engine could not start. Check the Camera Kit API token and your network, then retry."
          : name === "PlatformNotSupportedError" || name === "WebGLError"
            ? "This browser can't run the AR engine. Try the latest Chrome or Safari."
            : err instanceof Error
              ? err.message
              : "Something went wrong while starting the fitting room.",
      );
      clearNativePreview();
      stopStream(streamRef.current);
      streamRef.current = null;
    }
  }, [
    active,
    apiToken,
    attachNativePreview,
    clearNativePreview,
    loadLens,
    prefetch,
    showToast,
    wear,
  ]);

  const flip = useCallback(async () => {
    const session = sessionRef.current;
    const kit = kitRef.current;
    if (!session || !kit || fitting) return;
    const next: Facing = facingRef.current === "user" ? "environment" : "user";
    try {
      const { sdk } = await getCameraKit(apiToken);
      const stream = await openCamera(next);
      stopStream(streamRef.current);
      streamRef.current = stream;
      facingRef.current = next;
      setFacing(next);
      if (feed === "native") {
        await attachNativePreview(stream, next);
      }
      const budget = renderBudget();
      const canvas = canvasRef.current;
      if (canvas) pinCanvasBuffer(canvas, budget);
      const source = sdk.createMediaStreamSource(stream, {
        cameraType: next,
        transform:
          next === "user" ? sdk.Transform2D.MirrorX : sdk.Transform2D.Identity,
        disableSourceAudio: true,
        fpsLimit: budget.fps,
      });
      await session.setSource(source);
      await session.setFPSLimit(budget.fps);
      if (!isMobileClient()) {
        try {
          await syncRenderSize(source, budget);
        } catch {
          /* ignore */
        }
      }
    } catch {
      showToast("Couldn't switch cameras.");
    }
  }, [apiToken, attachNativePreview, feed, fitting, showToast]);

  const capture = useCallback(async () => {
    const session = sessionRef.current;
    if (!session) return;
    try {
      await session.play("capture");
      // let the capture target render a couple of frames
      await new Promise((r) => setTimeout(r, 160));
      let url = session.output.capture.toDataURL("image/jpeg", 0.92);
      if (url.length < 2000) {
        url = session.output.live.toDataURL("image/jpeg", 0.92);
      }
      await session.pause("capture");
      setShot(url);
    } catch {
      showToast("Couldn't take the photo.");
    }
  }, [showToast]);

  /* Change garment */
  const select = useCallback(
    (i: number) => {
      const product = roomProducts[i];
      if (!product || i === index) return;
      setIndex(i);
      setSize(product.sizes[Math.floor(product.sizes.length / 2)] ?? "");
      setColor(product.colors[0]);
      setSizeOpen(false);
      if (phase === "live") void wear(product);
    },
    [index, phase, roomProducts, wear],
  );

  /* Add the active piece to the bag */
  const addToBag = useCallback(() => {
    if (!active || !color) return;
    addItem({
      productId: active.id,
      slug: active.slug,
      name: active.name,
      price: active.price,
      image: active.image,
      size,
      color: color.name,
      colorHex: color.hex,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }, [active, addItem, color, size]);

  /* Pause rendering when the tab is hidden; resume when back. */
  useEffect(() => {
    const onVis = () => {
      const s = sessionRef.current;
      if (!s) return;
      if (document.hidden) void s.pause("live");
      else void s.play("live");
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    return () => {
      void teardown();
    };
  }, [teardown]);

  const close = useCallback(() => {
    void teardown();
    router.push(backHref);
  }, [backHref, router, teardown]);

  const activeBroken = active ? brokenLenses.current.has(active.lensId) : false;

  const saveShot = useCallback(() => {
    if (!shot || !active) return;
    const a = document.createElement("a");
    a.href = shot;
    a.download = `${active.slug}-try-on.jpg`;
    a.click();
  }, [active, shot]);

  const canShare = useMemo(
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    [],
  );

  const shareShot = useCallback(async () => {
    if (!shot || !active) return;
    try {
      const blob = await (await fetch(shot)).blob();
      const file = new File([blob], `${active.slug}-try-on.jpg`, {
        type: "image/jpeg",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: active.name });
      } else {
        await navigator.share({ title: active.name, url: window.location.href });
      }
    } catch {
      /* user cancelled */
    }
  }, [active, shot]);

  if (!active) return null;

  /* --------------------------------------------------------------------- */
  /* Render                                                                 */
  /* --------------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black text-white">
      {/* Native camera — phones only, until AR canvas is ready. Never opacity-0 the WebGL canvas while playing. */}
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        className={`absolute inset-0 h-full w-full object-cover ${
          feed === "native" && phase === "live"
            ? "z-[1] opacity-100"
            : "pointer-events-none z-0 opacity-0"
        }`}
      />
      <canvas
        ref={canvasRef}
        width={480}
        height={360}
        data-tryon-phase={phase}
        className={`absolute inset-0 h-full w-full object-cover opacity-100 ${
          feed === "ar" ? "z-[1]" : "z-0"
        }`}
      />

      {/* Top chrome */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/60 to-transparent px-4 pb-14 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between gap-4">
          <div className="pointer-events-auto min-w-0">
            <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-white/60">
              Live try-on
            </p>
            <p className="truncate font-serif text-2xl leading-tight">
              {active.name}
            </p>
            <p className="font-sans text-xs text-white/80">
              {formatPrice(active.price)}
              {active.compareAt && active.compareAt > active.price ? (
                <span className="ml-2 text-white/45 line-through">
                  {formatPrice(active.compareAt)}
                </span>
              ) : null}
            </p>
          </div>
          <div className="pointer-events-auto flex flex-col items-center gap-3">
            <RoundButton label="Close" onClick={close}>
              <X size={18} />
            </RoundButton>
            {phase === "live" && canFlip && (
              <RoundButton
                label={
                  facing === "user" ? "Use back camera" : "Use front camera"
                }
                onClick={() => void flip()}
              >
                <SwitchCamera size={18} />
              </RoundButton>
            )}
          </div>
        </div>
      </div>

      {/* Fitting / preparing indicator */}
      {phase === "live" && (fitting || feed === "native") && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-center">
          <div className="flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 font-sans text-xs uppercase tracking-[0.18em] backdrop-blur">
            <Loader2 size={14} className="animate-spin" />{" "}
            {feed === "native" ? "Preparing AR…" : "Fitting…"}
          </div>
        </div>
      )}
      {phase === "live" && !fitting && feed === "ar" && activeBroken && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-center px-6">
          <div className="max-w-xs rounded-2xl bg-black/60 px-5 py-4 text-center font-sans text-sm backdrop-blur">
            {roomProducts.length > 1
              ? "This piece couldn't be loaded. Pick another one below."
              : "This piece couldn't be loaded right now."}
          </div>
        </div>
      )}

      {/* Bottom chrome */}
      {phase === "live" && (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-16">
          {roomProducts.length > 1 && (
            <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
              {roomProducts.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`Try on ${p.name}`}
                  aria-pressed={i === index}
                  className={`relative h-[68px] w-[54px] shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === index
                      ? "border-white"
                      : "border-white/20 opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                  {brokenLenses.current.has(p.lensId) && (
                    <span className="absolute inset-0 bg-black/60" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 items-center">
            {/* Size */}
            <div className="relative flex justify-start">
              <button
                type="button"
                onClick={() => setSizeOpen((v) => !v)}
                className="rounded-full border border-white/35 bg-black/35 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.18em] backdrop-blur"
              >
                Size {size}
              </button>
              {sizeOpen && (
                <div className="absolute bottom-12 left-0 flex flex-wrap gap-1.5 rounded-2xl bg-black/75 p-2 backdrop-blur">
                  {active.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s);
                        setSizeOpen(false);
                      }}
                      className={`min-w-10 rounded-full px-3 py-1.5 font-sans text-[11px] uppercase tracking-wider ${
                        s === size ? "bg-white text-black" : "text-white/85"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  {active.colors.length > 1 && (
                    <div className="mt-1 flex w-full gap-1.5 border-t border-white/15 pt-2">
                      {active.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          aria-label={`Color ${c.name}`}
                          onClick={() => setColor(c)}
                          className={`h-7 w-7 rounded-full border-2 ${
                            color?.name === c.name
                              ? "border-white"
                              : "border-white/25"
                          }`}
                          style={{ background: c.hex }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shutter */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => void capture()}
                aria-label="Take a photo"
                className="group flex h-[74px] w-[74px] items-center justify-center rounded-full border-[3px] border-white/90 bg-white/10 backdrop-blur transition active:scale-95"
              >
                <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white text-black transition group-active:scale-90">
                  <Camera size={22} />
                </span>
              </button>
            </div>

            {/* Bag */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addToBag}
                disabled={!active.inStock}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] transition disabled:opacity-40 ${
                  added ? "bg-emerald-400 text-black" : "bg-white text-black"
                }`}
              >
                {added ? <Check size={14} /> : <ShoppingBag size={14} />}
                <span className="hidden sm:inline">
                  {added ? "Added" : active.inStock ? "Add to bag" : "Sold out"}
                </span>
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rust px-1 font-sans text-[10px] text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {count > 0 && (
            <div className="mt-3 flex justify-end">
              <Link
                href="/cart"
                className="font-sans text-[10px] uppercase tracking-[0.18em] text-white/70 underline-offset-4 hover:underline"
              >
                View bag
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[38%] z-30 flex justify-center px-6">
          <div className="rounded-full bg-black/75 px-4 py-2 font-sans text-xs backdrop-blur">
            {toast}
          </div>
        </div>
      )}

      {/* Intro / status overlay */}
      {phase !== "live" && (
        <div className="absolute inset-0 z-30 flex flex-col bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.image}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-xl"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />
          <div className="relative flex flex-1 flex-col items-center justify-end px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-24 text-center">
            <div className="mb-8 h-[220px] w-[170px] overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.image}
                alt={active.name}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-white/60">
              Live AR fitting room
            </p>
            <h1 className="mt-3 max-w-sm font-serif text-4xl leading-tight">
              {phase === "denied"
                ? "Camera access is blocked"
                : phase === "unsupported"
                  ? "This browser can't run AR"
                  : phase === "error"
                    ? "Couldn't start the fitting room"
                    : `See yourself in the ${active.name}`}
            </h1>
            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-white/75">
              {phase === "denied"
                ? "Allow camera access for this site in your browser settings, then try again."
                : phase === "unsupported"
                  ? "Open this page in the latest Chrome, Safari, or Edge on a device with a camera."
                  : phase === "error"
                    ? error
                    : "The piece is rendered onto your body in real time as you move. Stand about two metres from the camera with your upper body in frame."}
            </p>

            {phase === "starting" ? (
              <div className="mt-8 flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] text-white/80">
                <Loader2 size={16} className="animate-spin" /> {step}
              </div>
            ) : (
              <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
                {phase !== "unsupported" && (
                  <button
                    type="button"
                    onClick={() => void start()}
                    className="flex items-center justify-center gap-2 rounded-full bg-white py-3.5 font-sans text-[11px] uppercase tracking-[0.22em] text-black"
                  >
                    {phase === "intro" ? (
                      <Camera size={14} />
                    ) : (
                      <RefreshCcw size={14} />
                    )}
                    {phase === "intro" ? "Open camera" : "Try again"}
                  </button>
                )}
                <Link
                  href={backHref}
                  className="rounded-full border border-white/30 py-3.5 font-sans text-[11px] uppercase tracking-[0.22em] text-white/85"
                >
                  Back to product
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Captured photo */}
      {shot && (
        <div className="absolute inset-0 z-40 flex flex-col bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot}
            alt={`You wearing the ${active.name}`}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div className="absolute inset-x-0 top-0 flex justify-end bg-gradient-to-b from-black/60 to-transparent px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))]">
            <RoundButton label="Retake" onClick={() => setShot(null)}>
              <X size={18} />
            </RoundButton>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-14">
            <p className="mb-4 text-center font-serif text-xl">
              {active.name} · {formatPrice(active.price)}
            </p>
            <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
              <button
                type="button"
                onClick={saveShot}
                className="flex items-center justify-center gap-2 rounded-full border border-white/35 py-3 font-sans text-[11px] uppercase tracking-[0.16em]"
              >
                <Download size={14} /> Save
              </button>
              {canShare ? (
                <button
                  type="button"
                  onClick={() => void shareShot()}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/35 py-3 font-sans text-[11px] uppercase tracking-[0.16em]"
                >
                  <Share2 size={14} /> Share
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShot(null)}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/35 py-3 font-sans text-[11px] uppercase tracking-[0.16em]"
                >
                  <RefreshCcw size={14} /> Retake
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  addToBag();
                  setShot(null);
                }}
                disabled={!active.inStock}
                className="flex items-center justify-center gap-2 rounded-full bg-white py-3 font-sans text-[11px] uppercase tracking-[0.16em] text-black disabled:opacity-40"
              >
                <ShoppingBag size={14} /> Bag · {size}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoundButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition active:scale-95"
    >
      {children}
    </button>
  );
}
