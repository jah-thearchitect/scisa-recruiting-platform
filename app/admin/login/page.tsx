import { adminSignIn, adminSignUp } from "./actions";
import { BrandHeader } from "@/components/BrandHeader";
import { AuthBackdrop } from "@/components/AuthBackdrop";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;

  return (
    <AuthBackdrop image="/gallery/baseball-championship.jpg">
      <BrandHeader />
      <h1 className="mt-8 text-2xl font-semibold text-slate-900">School Admin</h1>
      <p className="mt-2 text-sm text-slate-600">
        For coaches and athletic directors. Roster, verification queue, and
        guardian consent status.
      </p>

      {notice && (
        <p className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800">
          {notice}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <div className="mt-2 flex gap-3">
          <button
            formAction={adminSignUp}
            className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Create account
          </button>
          <button
            formAction={adminSignIn}
            className="flex-1 rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark"
          >
            Sign in
          </button>
        </div>
      </form>
    </AuthBackdrop>
  );
}
