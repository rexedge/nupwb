import { AboutTeaser } from "@/components/site/AboutTeaser";
import { AkwateBand } from "@/components/site/AkwateBand";
import { Hero } from "@/components/site/Hero";
import { PalmWineFeature } from "@/components/site/PalmWineFeature";
import { QuickLinks } from "@/components/site/QuickLinks";
import { SignatureDishes } from "@/components/site/SignatureDishes";
import { VisitAndShare } from "@/components/site/VisitAndShare";

// Pulls live menu/venue data from the DB — must not be frozen at build time, or admin edits
// (prices, availability, settings) would silently not appear until the next deploy.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <QuickLinks />
      <AkwateBand />
      <PalmWineFeature />
      <AkwateBand />
      <AboutTeaser />
      <SignatureDishes />
      <AkwateBand />
      <VisitAndShare />
    </div>
  );
}
