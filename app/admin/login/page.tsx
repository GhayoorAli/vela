import { loginAdmin } from "@/lib/actions";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-paper px-4">
      <form action={loginAdmin} className="w-full max-w-md bg-mist p-10">
        <p className="eyebrow">Vela</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">Admin</h1>
        <p className="mt-3 font-sans text-sm text-ink/50">
          Default password for local: <code className="text-ink">vela-admin</code>
        </p>
        {error && <p className="mt-4 font-sans text-sm text-rust">Wrong password.</p>}
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="field mt-8"
        />
        <button type="submit" className="btn-solid mt-8 w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}
