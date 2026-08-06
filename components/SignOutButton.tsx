import { signOut } from "@/lib/auth-actions";

export function SignOutButton({ redirectTo = "/" }: { redirectTo?: string }) {
  return (
    <form action={signOut.bind(null, redirectTo)}>
      <button
        type="submit"
        className="text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline"
      >
        Sign out
      </button>
    </form>
  );
}
