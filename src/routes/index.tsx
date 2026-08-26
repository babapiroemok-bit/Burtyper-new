import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsTicker } from "@/components/StatsTicker";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { Features } from "@/components/Features";
import { PaymentMethods } from "@/components/PaymentMethods";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { Footer } from "@/components/Footer";
import { SiteDataProvider, useSiteData } from "@/lib/site-data";

const title = "Burtyper — Discord Bot Satış Sitesi";
const description =
  "Discord sipariş botumuzla dakikalar içinde sipariş ver. Şifre istenmez, 7/24 destek, şeffaf süreç ve anlık teslimat.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function MaintenanceScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/15 text-destructive">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">
          Site şu anda bakımda
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Kısa süre içinde tekrar yayındayız. Lütfen birazdan tekrar kontrol et.
        </p>
      </div>
    </div>
  );
}

function ProtectionScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/15 text-amber-500">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">
          Site koruma altında
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Anormal trafik tespit edildi ve site geçici olarak DDoS korumasına alındı. Lütfen birazdan
          tekrar dene.
        </p>
      </div>
    </div>
  );
}

function Index() {
  return (
    <SiteDataProvider>
      <SiteContent />
    </SiteDataProvider>
  );
}

function SiteContent() {
  const { siteLocked, ddosProtection } = useSiteData();

  if (siteLocked) return <MaintenanceScreen />;
  if (ddosProtection) return <ProtectionScreen />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <StatsTicker />
        <HowItWorks />
        <Pricing />
        <Features />
        <PaymentMethods />
        <Testimonials />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
