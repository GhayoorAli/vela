import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <WifiOff size={28} strokeWidth={1.5} className="text-ink/40" />
      <p className="eyebrow mt-6">Vela</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight">You’re offline</h1>
      <p className="mt-4 font-sans text-sm font-light leading-relaxed text-ink/55">
        The house will be here when you’re back on the network. Pages you’ve
        already opened may still load.
      </p>
      <Link href="/" className="btn-solid mt-10">
        Try home
      </Link>
    </main>
  );
}
