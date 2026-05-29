import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 shadow-sm shadow-purple-200">
            <Search className="h-5 w-5 text-white" strokeWidth={2.5} />
            <Sparkles className="absolute right-1.5 top-1.5 h-3 w-3 text-purple-100" strokeWidth={2.4} />
          </div>
          <span className="text-xl font-bold tracking-tight">Keyword Pick</span>
        </Link>
        <nav className="flex items-center">
          <Link
            href="/guide"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-purple-50 hover:text-purple-700"
          >
            사용방법
          </Link>
        </nav>
      </div>
    </header>
  );
}
