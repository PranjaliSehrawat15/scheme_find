import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-warm-paper">
      <div className="fixed left-4 top-4 z-40 rounded-xl bg-white/90 px-3 py-2 shadow-sm ring-1 ring-ink-navy/10 backdrop-blur sm:left-6 sm:top-6">
        <Logo href="/" size="sm" />
      </div>
      {children}
    </div>
  );
}
