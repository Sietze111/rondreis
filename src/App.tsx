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
  all: "#2B2B23",
  battlefield: "#7A4232",
  bunker: "#5A6042",
  battery: "#A0721F",
  fort: "#4C5A56",
  museum: "#8A3434",
  memorial: "#5E4A6E",
  cemetery: "#5C5750",
  bridge: "#3B5A6E",
  beach: "#B08D3E",
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
    <div className="flex flex-col min-h-screen texture-paper text-[#25271E] font-sans antialiased">
      {/* Header / Masthead */}
      <header className="relative overflow-hidden bg-[#20241B] text-[#EAE3D0]">
        {/* texture + glow layers */}
        <div
          className="absolute inset-0 texture-topo opacity-70"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(60% 100% at 12% 0%, rgba(124,43,43,0.42), transparent 70%), radial-gradient(55% 120% at 92% 10%, rgba(178,138,46,0.22), transparent 70%)",
          }}
        />
        {/* brass top accent */}
        <div className="relative h-[3px] bg-gradient-to-r from-[#7C2B2B] via-[#B28A2E] to-[#7C2B2B]" />

        <div className="relative max-w-7xl mx-auto px-5 py-8 md:px-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-[#CAA75A] font-semibold">
                  {t("subtitle")}
                </span>
                <span className="hidden sm:block w-16 h-px bg-[#B28A2E]/50" />
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#F3EDDE] [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
                {t("title")}
              </h1>

              <div className="mt-4 rule-brass w-28 md:w-40" />

              <p className="mt-4 max-w-2xl font-serif italic text-[15px] md:text-[17px] leading-relaxed text-[#D8D0B8]">
                {t("description")}
              </p>
            </div>

            {/* Right cluster: seal + controls */}
            <div className="flex flex-col items-start md:items-end gap-4">
              {/* Regimental seal */}
              <div className="hidden md:flex items-center gap-4">
                <div className="reveal w-16 h-16 rounded-full border-2 border-[#B28A2E]/70 flex items-center justify-center rotate-[-6deg] bg-[#2A2E22]/80 shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                  <span className="font-display text-[11px] leading-tight text-center text-[#CAA75A] uppercase px-1">
                    44<br />Remember
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-[#D8D0B8]">
                    Dunkirk · Normandy
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#B28A2E] mt-1">
                    Iepe &amp; Sietze
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start md:self-auto">
                <LanguagePicker />
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="press bg-[#7C2B2B] text-[#F3EDDE] border border-[#B28A2E]/60 hover:bg-[#8F3333] rounded-full px-5 py-2 font-mono text-[11px] tracking-wider transition-all duration-150 flex items-center gap-2 font-bold cursor-pointer shadow-[0_6px_16px_rgba(0,0,0,0.35)]"
                  >
                    <Download size={14} />
                    {t("install")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 flex-wrap mt-7">
            {CATEGORY_IDS.map((categoryId) => {
              const active = activeCategory === categoryId;
              const color =
                categoryId === "all" ? "#B28A2E" : CATEGORY_COLORS[categoryId];

              return (
                <button
                  key={categoryId}
                  onClick={() => setActiveCategory(categoryId)}
                  className="press border rounded-full pl-2.5 pr-4 py-1.5 font-mono text-[11px] tracking-wider transition-all duration-150 flex items-center gap-2 text-[#D8D0B8] hover:-translate-y-0.5 cursor-pointer"
                  style={{
                    borderColor: active ? color : "rgba(216,208,184,0.35)",
                    backgroundColor: active
                      ? color
                      : "rgba(234,227,208,0.06)",
                    color: active ? "#fff" : "#D8D0B8",
                    boxShadow: active
                      ? "0 6px 16px -4px rgba(0,0,0,0.5)"
                      : "none",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: active
                        ? "#fff"
                        : categoryId === "all"
                          ? "#D8D0B8"
                          : COLORS[categoryId as keyof typeof COLORS],
                    }}
                  />
                  {t(`categories.${categoryId}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* notched bottom divider */}
        <div className="relative h-[3px] ticks opacity-70" />
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Sidebar Container */}
        <aside
          className={`w-full md:w-[380px] md:border-r md:border-[#C6B99A] flex-shrink-0 flex flex-col bg-[#EAE3D0]/60 ${
            mobileView === "list" ? "block" : "hidden md:flex"
          }`}
        >
          <div className="overflow-y-auto flex-1 px-4 py-5 md:px-6 md:py-5 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-200px)] space-y-4">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6D6855]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full pl-9 pr-3 py-2.5 panel rounded-xl text-[13px] text-[#25271E] placeholder-[#6D6855]/70 focus:outline-none focus:ring-2 focus:ring-[#B28A2E]/50 transition-shadow"
              />
            </div>

            <div className="text-[13px] leading-relaxed text-[#3A3C2E] panel rounded-xl p-3.5 border-l-4 border-l-[#B28A2E]">
              <strong className="text-[#25271E] font-semibold">
                {t("howToTitle")}
              </strong>{" "}
              {t("howTo")}
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
              search={search}
            />
          </div>
        </aside>

        {/* Map Container */}
        <main
          className={`flex-1 flex flex-col min-h-[50vh] md:min-h-0 relative ${
            mobileView === "map" ? "block" : "hidden md:block"
          }`}
        >
          <div className="absolute inset-0 w-full h-full">
            <RouteMap
              stops={STOPS}
              activeCategory={activeCategory}
              selectedStop={selectedStop}
              onClearSelectedStop={() => setSelectedStop(null)}
            />
          </div>
        </main>

        {/* Mobile View Toggle Tabs */}
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#20241B] text-[#EAE3D0] rounded-full shadow-lg border border-[#C6B99A]/25 flex items-center p-1 z-[9999]">
          <button
            onClick={() => setMobileView("map")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all ${
              mobileView === "map"
                ? "bg-[#B28A2E] text-[#20241B] font-bold"
                : "text-[#EAE3D0]/80 hover:text-[#EAE3D0]"
            }`}
          >
            <MapIcon size={14} />
            {t("mobile.map")}
          </button>
          <button
            onClick={() => setMobileView("list")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all ${
              mobileView === "list"
                ? "bg-[#B28A2E] text-[#20241B] font-bold"
                : "text-[#EAE3D0]/80 hover:text-[#EAE3D0]"
            }`}
          >
            <ListIcon size={14} />
            {t("mobile.list")}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="font-mono text-[10px] text-[#6D6855] px-5 py-4 md:px-8 border-t border-[#C6B99A] texture-paper z-10 flex flex-col md:flex-row md:justify-between gap-2">
        <div>{t("footer.tiles")}</div>
        <div>{t("footer.built")}</div>
      </footer>
    </div>
  );
}

export default App;
