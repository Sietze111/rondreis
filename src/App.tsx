import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Stop } from "./components/StopList";
import { STOPS } from "./data/stops";
import { ProgressBar } from "./components/ProgressBar";
import { StopList } from "./components/StopList";
import { RouteMap } from "./components/Map";
import { COLORS } from "./components/StampSvg";
import { LanguagePicker } from "./components/LanguagePicker";
import { Map as MapIcon, List as ListIcon, Download, Search } from "lucide-react";

const CATEGORY_IDS = [
  "all",
  "battlefield",
  "bunker",
  "battery",
  "fort",
  "museum",
  "memorial",
  "cemetery",
  "bridge",
  "beach",
] as const;

const CATEGORY_COLORS: Record<(typeof CATEGORY_IDS)[number], string> = {
  all: "#161616",
  battlefield: "#E33D2E",
  bunker: "#5C6B3F",
  battery: "#E89B1F",
  fort: "#4C86C6",
  museum: "#B3271B",
  memorial: "#7B4DC0",
  cemetery: "#4A4A48",
  bridge: "#2E6BD6",
  beach: "#E8A33D",
};

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const STORAGE_KEY = "visitedStops";

function App() {
  const { t } = useTranslation();
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeWar, setActiveWar] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // Listen to beforeinstallprompt event for PWA installation
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  // Load visited from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setVisited(new Set(JSON.parse(raw)));
      }
    } catch (e) {
      console.error("Failed to load visited stops", e);
    }
  }, []);

  // Save visited to localStorage
  const saveVisited = (newVisited: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...newVisited]));
    } catch (e) {
      console.error("Failed to save visited stops", e);
    }
  };

  const handleToggleVisited = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newVisited = new Set(visited);
    if (newVisited.has(id)) {
      newVisited.delete(id);
    } else {
      newVisited.add(id);
    }
    setVisited(newVisited);
    saveVisited(newVisited);
  };

  const handleStopClick = (stop: Stop) => {
    setSelectedStop(stop);
    if (window.innerWidth < 768) {
      setMobileView("map");
    }
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-[#F4EFE2] text-[#161616] font-sans antialiased">
      {/* Header / Masthead (compact) */}
      <header className="shrink-0 bg-[#F4EFE2] border-b-4 border-[#161616]">
        <div className="h-1.5 bg-[#F5C400] border-b-2 border-[#161616]" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 md:py-3">
          {/* Brand row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="sticker bg-[#E33D2E] text-white font-display text-sm px-2 py-1 hidden sm:inline-block">
                1944
              </span>
              <div className="min-w-0">
                <h1 className="font-display text-[22px] md:text-3xl uppercase leading-[1.02] tracking-tight text-[#161616] whitespace-nowrap">
                  <span className="bg-[#F5C400] px-1">France</span> War Trails
                </h1>
                <p className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B6453] truncate">
                  {t("subtitle")} · Dunkirk → Normandy · Iepe &amp; Sietze
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <LanguagePicker />
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="brutal-btn bg-[#E33D2E] text-white px-3 py-1.5 md:px-4 font-mono text-[11px] md:text-[12px] font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">{t("install")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-1.5 flex-nowrap md:flex-wrap mt-2 overflow-x-auto md:overflow-visible pb-0.5 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
            {CATEGORY_IDS.map((categoryId) => {
              const active = activeCategory === categoryId;
              const color =
                categoryId === "all"
                  ? "#161616"
                  : CATEGORY_COLORS[categoryId];

              return (
                <button
                  key={categoryId}
                  onClick={() => setActiveCategory(categoryId)}
                  className="brutal-btn font-mono text-[11px] font-bold tracking-wide px-2 py-1 flex items-center gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: active ? color : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#161616",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: active
                        ? "#FFFFFF"
                        : categoryId === "all"
                          ? "#161616"
                          : COLORS[categoryId as keyof typeof COLORS],
                    }}
                  />
                  {t(`categories.${categoryId}`)}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Sidebar Container */}
        <aside
          className={`w-full md:w-[380px] md:flex-none md:border-r-4 md:border-[#161616] flex-1 min-h-0 flex-col bg-[#F4EFE2] ${
            mobileView === "list" ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="overflow-y-auto flex-1 min-h-0 px-4 py-4 md:px-6 space-y-4">
            {/* War era toggle */}
            <div className="flex items-center gap-1 border-[3px] border-[#161616] bg-[#FFFFFF] p-1 shadow-[3px_3px_0_#161616]">
              {(["all", "ww1", "ww2"] as const).map((war) => {
                const active = activeWar === war;
                return (
                  <button
                    key={war}
                    onClick={() => setActiveWar(war)}
                    className={`flex-1 py-1.5 font-mono text-[11px] md:text-[12px] font-bold tracking-wider uppercase cursor-pointer border-2 transition-colors ${
                      active
                        ? "bg-[#161616] text-[#F5C400] border-[#161616]"
                        : "bg-transparent text-[#161616] border-transparent hover:bg-[#F4EFE2]"
                    }`}
                  >
                    {t(`war.${war}`)}
                  </button>
                );
              })}
            </div>

            <p className="font-sans text-[12.5px] font-medium leading-relaxed text-[#161616] bg-[#FFFFFF] border-[2px] border-[#161616] p-2.5 shadow-[2px_2px_0_#161616]">
              {t("description")}
            </p>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#161616]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full pl-9 pr-3 py-2.5 border-[3px] border-[#161616] shadow-[3px_3px_0_#161616] bg-[#FFFFFF] text-[14px] font-medium text-[#161616] placeholder-[#6B6453] focus:outline-none focus:bg-[#F5C400]"
              />
            </div>

            <ProgressBar
              visitedCount={visited.size}
              totalCount={STOPS.length}
            />

            <StopList
              stops={STOPS}
              visited={visited}
              onToggleVisited={handleToggleVisited}
              onStopClick={handleStopClick}
              activeCategory={activeCategory}
              activeWar={activeWar}
              search={search}
            />
          </div>
        </aside>

        {/* Map Container */}
        <main
          className={`flex-1 flex flex-col min-h-0 relative ${
            mobileView === "map" ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="absolute inset-0 w-full h-full">
            <RouteMap
              stops={STOPS}
              activeCategory={activeCategory}
              activeWar={activeWar}
              selectedStop={selectedStop}
              onClearSelectedStop={() => setSelectedStop(null)}
            />
          </div>
        </main>

        {/* Mobile View Toggle Tabs */}
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#FFFFFF] border-[3px] border-[#161616] shadow-[4px_4px_0_#161616] flex items-center p-1 z-[9999]">
          <button
            onClick={() => setMobileView("map")}
            className={`flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-bold tracking-wider transition-colors ${
              mobileView === "map" ? "bg-[#161616] text-[#F5C400]" : "text-[#161616]"
            }`}
          >
            <MapIcon size={14} />
            {t("mobile.map")}
          </button>
          <button
            onClick={() => setMobileView("list")}
            className={`flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-bold tracking-wider transition-colors ${
              mobileView === "list" ? "bg-[#161616] text-[#F5C400]" : "text-[#161616]"
            }`}
          >
            <ListIcon size={14} />
            {t("mobile.list")}
          </button>
        </div>
      </div>

      {/* Footer (slim) */}
      <footer className="shrink-0 font-mono text-[10px] font-bold text-[#161616] px-4 md:px-6 py-1.5 border-t-2 border-[#161616] bg-[#F4EFE2] z-10 flex flex-col sm:flex-row sm:justify-between gap-1">
        <span className="truncate">{t("footer.tiles")}</span>
        <span>{t("footer.built")}</span>
      </footer>
    </div>
  );
}

export default App;
