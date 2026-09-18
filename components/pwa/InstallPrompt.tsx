"use client";

import { Share, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "vela-pwa-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem(DISMISS_KEY)) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    if (isIos()) {
      const t = window.setTimeout(() => setIosHint(true), 1800);
      return () => {
        window.removeEventListener("beforeinstallprompt", onPrompt);
        window.clearTimeout(t);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    setOpen(false);
    setIosHint(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setOpen(false);
  }

  if (isStandalone()) return null;
  if (!open && !iosHint) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 px-3 md:bottom-6 md:flex md:justify-center">
      <div className="mx-auto flex w-full max-w-lg items-start gap-3 border border-ink/10 bg-ink px-4 py-3.5 text-paper shadow-2xl">
        <div className="min-w-0 flex-1">
          <p className="font-serif text-xl leading-tight">Install Vela</p>
          {iosHint && !deferred ? (
            <p className="mt-1 font-sans text-[12px] leading-relaxed text-paper/70">
              Tap <Share size={12} className="inline -mt-0.5" /> then{" "}
              <span className="text-paper">Add to Home Screen</span> for the
              full app — try-on, bag, and shop in one tap.
            </p>
          ) : (
            <p className="mt-1 font-sans text-[12px] leading-relaxed text-paper/70">
              Add the house to your home screen. Shop, try on, and check out
              like a native app.
            </p>
          )}
        </div>
        {deferred && (
          <button type="button" onClick={() => void install()} className="btn-light shrink-0 px-4 py-2">
            Install
          </button>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismiss}
          className="mt-0.5 text-paper/50 hover:text-paper"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
