import { Navigation } from "@/components/header/Navigation";
import { TopHeader } from "@/components/header/TopHeader";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl supports-backdrop-filter:bg-background/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(248,241,226,0.95))] shadow-[0_10px_40px_rgba(15,17,21,0.04)] dark:bg-[linear-gradient(135deg,rgba(26,29,35,0.96),rgba(15,17,21,0.98))]">
      <TopHeader />
      <Navigation />
    </header>
  );
}
