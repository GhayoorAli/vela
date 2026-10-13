import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ShoppingStudio } from "@/components/store/ShoppingStudio";

export const metadata = {
  title: "AI personal stylist",
  description:
    "Describe your next look and get personal outfit suggestions from the Vela collection. Try supported pieces on live with AR.",
};

export default async function StylistPage({
  searchParams,
}: {
  searchParams: Promise<{ look?: string | string[] }>;
}) {
  const params = await searchParams;
  const look = Array.isArray(params.look) ? params.look[0] : params.look;
  const initialBrief = look?.trim().slice(0, 200) ?? "";
  return (
    <main className="ai-stylist-page">
      <section className="ai-page-intro">
        <p className="atelier-label">
          <Sparkles size={16} /> AI stylist
        </p>
        <h1>
          Get help
          <br />
          <em>choosing an outfit.</em>
        </h1>
        <div>
          <p>Describe your next look. We’ll find the pieces.</p>
          <Link href="/shop">
            Browse the collection <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <ShoppingStudio variant="standalone" initialBrief={initialBrief} />
    </main>
  );
}
