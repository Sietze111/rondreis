import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Stop } from "./components/StopList";
import { STOPS } from "./data/stops";
import confetti from "canvas-confetti";
import { ProgressBar } from "./components/ProgressBar";
import { StopList } from "./components/StopList";
import { BernMap } from "./components/Map";
import { COLORS } from "./components/StampSvg";
import { LanguagePicker } from "./components/LanguagePicker";
import { Map as MapIcon, List as ListIcon, Download } from "lucide-react";

const CATEGORY_IDS = [
  "all",
  "history",
  "nature",
  "culture",
  "water",
  "viewpoint",
] as const;

const CATEGORY_COLORS: Record<(typeof CATEGORY_IDS)[number], string> = {
  all: "#1B2A4A",
  history: "#A8842C",
  nature: "#3E7C59",
  culture: "#8E44AD",
  water: "#2E86C1",
  viewpoint: "#E67E22",
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
      // Trigger confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#A8842C", "#B6332B", "#3E5C3A", "#6B4E71", "#1B2A4A"],
      });
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
    <div className="flex flex-col min-h-screen bg-[#F3ECD9] text-[#1B2A4A] font-sans antialiased">
      {/* Header / Masthead */}
      <header className="px-5 py-6 md:px-8 md:py-7 bg-[#F3ECD9] border-b-2 border-[#1B2A4A] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <div>
              <p className="font-mono text-[10px] md:text-xs tracking-[0.14em] uppercase text-[#B6332B] font-semibold mb-1.5">
                {t("subtitle")}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight">
                {t("title")}
              </h1>
            </div>
            <div className="flex items-center gap-3 self-start">
              <LanguagePicker />
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="bg-[#B6332B] text-white border-[1.5px] border-[#B6332B] hover:bg-[#FBF6E9] hover:text-[#B6332B] rounded-full px-5 py-2 font-mono text-[11px] tracking-wider transition-all duration-150 flex items-center gap-2 font-bold shadow-sm hover:-translate-y-0.5 cursor-pointer"
                >
                  <Download size={14} />
                  {t("install")}
                </button>
              )}
            </div>
          </div>
          <p className="max-w-2xl text-sm md:text-[15px] leading-relaxed text-[#46506b] mb-5">
            {t("description")}
          </p>

          {/* Filter Chips */}
          <div className="flex gap-2.5 flex-wrap">
            {CATEGORY_IDS.map((categoryId) => {
              const active = activeCategory === categoryId;
              const color = CATEGORY_COLORS[categoryId];

              return (
                <button
                  key={categoryId}
                  onClick={() => setActiveCategory(categoryId)}
                  className="border-[1.5px] rounded-full px-4 py-1.5 font-mono text-[11px] tracking-wider transition-all duration-150 flex items-center gap-2 hover:-translate-y-0.5"
                  style={{
                    borderColor: active ? color : "#1B2A4A",
                    backgroundColor: active ? color : "#FBF6E9",
                    color: active ? "#fff" : "#1B2A4A",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: active
                        ? "#fff"
                        : categoryId === "all"
                          ? "#1B2A4A"
                          : COLORS[categoryId as keyof typeof COLORS],
                    }}
                  />
                  {t(`categories.${categoryId}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Decorative bottom line */}
        <div className="absolute left-5 right-5 bottom-1.5 h-[1px] bg-repeating-dots opacity-40" />
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Sidebar Container */}
        <aside
          className={`w-full md:w-[380px] md:border-r-2 md:border-[#1B2A4A] flex-shrink-0 flex flex-col bg-[#F3ECD9] ${
            mobileView === "list" ? "block" : "hidden md:flex"
          }`}
        >
          <div className="overflow-y-auto flex-1 px-4 py-5 md:px-6 md:py-5 max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-188px)] space-y-4">
            <div className="text-[13px] leading-relaxed text-[#46506b] bg-[#FBF6E9] border border-[#D8C9A0] rounded-xl p-3.5 shadow-sm">
              <strong className="text-[#1B2A4A]">{t("howToTitle")}</strong>{" "}
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
            <BernMap
              stops={STOPS}
              activeCategory={activeCategory}
              selectedStop={selectedStop}
              onClearSelectedStop={() => setSelectedStop(null)}
            />
          </div>
        </main>

        {/* Mobile View Toggle Tabs */}
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1B2A4A] text-[#F3ECD9] rounded-full shadow-lg border border-[#D8C9A0]/20 flex items-center p-1 z-[9999]">
          <button
            onClick={() => setMobileView("map")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all ${
              mobileView === "map"
                ? "bg-[#F3ECD9] text-[#1B2A4A] font-bold"
                : "text-[#F3ECD9]/80"
            }`}
          >
            <MapIcon size={14} />
            {t("mobile.map")}
          </button>
          <button
            onClick={() => setMobileView("list")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all ${
              mobileView === "list"
                ? "bg-[#F3ECD9] text-[#1B2A4A] font-bold"
                : "text-[#F3ECD9]/80"
            }`}
          >
            <ListIcon size={14} />
            {t("mobile.list")}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="font-mono text-[10px] text-[#46506b] px-5 py-4 md:px-8 border-t border-[#D8C9A0] bg-[#F3ECD9] z-10 flex flex-col md:flex-row md:justify-between gap-2">
        <div>{t("footer.tiles")}</div>
        <div>{t("footer.built")}</div>
      </footer>
    </div>
  );
}

export default App;
