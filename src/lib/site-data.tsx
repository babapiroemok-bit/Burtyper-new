import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSiteStatus, trackVisit, DEFAULT_STATE, type SiteState } from "@/lib/admin-store";

const SiteDataContext = createContext<SiteState>(DEFAULT_STATE);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SiteState>(DEFAULT_STATE);

  useEffect(() => {
    let cancelled = false;
    getSiteStatus()
      .then((s) => {
        if (!cancelled) setState(s);
      })
      .catch(() => {});

    if (typeof window !== "undefined") {
      const key = "burtyper_visited";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        trackVisit().catch(() => {});
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteDataContext.Provider value={state}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
