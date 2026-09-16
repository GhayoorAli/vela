import { loginAdmin } from "@/lib/actions";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form action={loginAdmin} className="w-full max-w-sm border border-ink/10 bg-paper p-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink/45">Vela</p>
        <h1 className="mt-2 font-serif text-4xl">Admin</h1>
        <p className="mt-2 font-sans text-sm text-ink/55">
          Default password for local: <code>vela-admin</code>
        </p>
        {error && <p className="mt-4 font-sans text-sm text-rust">Wrong password.</p>}
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="mt-6 w-full border border-ink/15 bg-transparent px-3 py-3 font-sans text-sm"
        />
        <button type="submit" className="mt-4 w-full bg-ink py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-paper">
          Sign in
        </button>
      </form>
    </div>
  );
}
