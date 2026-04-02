import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500">
            <Search className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">검색량 조회</span>
        </div>
      </div>
    </header>
  );
}
