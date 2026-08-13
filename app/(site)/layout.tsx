import { Header } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
