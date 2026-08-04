export function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 px-6 py-8 text-center">
      <p className="text-sm font-medium italic text-bl-gold-dark">
        To God be the Glory
      </p>
      <p className="mx-auto mt-2 max-w-md text-xs italic text-slate-400">
        &quot;Whatever you do, work heartily, as for the Lord and not for
        men.&quot; — Colossians 3:23
      </p>
      <p className="mt-3 text-xs text-slate-400">
        © {new Date().getFullYear()} Ben Lippen Athletics
      </p>
    </footer>
  );
}
