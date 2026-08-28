import React from "react";
import { useTranslation } from "react-i18next";
import { StampSvg, COLORS } from "./StampSvg";
import { DirectionsButton } from "./DirectionsButton";
import { StayButton } from "./StayButton";
import { Clock } from "lucide-react";

export interface Stop {
  id: string;
  area: string;
  cat:
    | "battlefield"
    | "bunker"
    | "museum"
    | "battery"
    | "fort"
    | "bridge"
    | "beach"
    | "cemetery"
    | "memorial";
  lat: number;
  lng: number;
  glyph: string;
  war?: "ww1" | "ww2";
}

interface StopListProps {
  stops: Stop[];
  visited: Set<string>;
  onToggleVisited: (id: string, e: React.MouseEvent) => void;
  onStopClick: (stop: Stop) => void;
  activeCategory: string;
  activeWar: string;
  search: string;
}

const CAT_ORDER: Array<Stop["cat"]> = [
  "battlefield",
  "bunker",
  "battery",
  "fort",
  "museum",
  "memorial",
  "cemetery",
  "bridge",
  "beach",
];

export const StopList: React.FC<StopListProps> = ({
  stops,
  visited,
  onToggleVisited,
  onStopClick,
  activeCategory,
  activeWar,
  search,
}) => {
  const { t } = useTranslation();
  const query = search.trim().toLowerCase();

  const matchesWar = (stop: Stop) => {
    if (activeWar === "all") return true;
    return (stop.war ?? "ww2") === activeWar;
  };

  const matchesSearch = (stop: Stop) => {
    if (!query) return true;
    const haystack = [
      t(`stops.${stop.id}.name`),
      t(`stops.${stop.id}.context`),
      stop.area,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  };

  return (
    <div className="space-y-6">
      {CAT_ORDER.map((cat) => {
        if (activeCategory !== "all" && activeCategory !== cat) {
          return null;
        }

        const catStops = stops.filter(
          (s) => s.cat === cat && matchesWar(s) && matchesSearch(s),
        );
        if (catStops.length === 0) {
          return null;
        }

        return (
          <div key={cat} className="mt-1">
            <div className="flex items-center gap-2 pb-2 mb-2">
              <span
                className="w-4 h-4 border-2 border-[#161616] rotate-[-8deg]"
                style={{ backgroundColor: COLORS[cat], boxShadow: "2px 2px 0 #161616" }}
              />
              <h3 className="font-display text-base font-bold uppercase tracking-wide text-[#161616]">
                {t(`categories.${cat}`)}
              </h3>
              <span className="font-mono text-xs font-bold text-[#161616] bg-[#F5C400] border-2 border-[#161616] px-1.5 leading-tight">
                {catStops.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {catStops.map((stop) => {
                const isVisited = visited.has(stop.id);

                return (
                  <div
                    key={stop.id}
                    onClick={() => onStopClick(stop)}
                    className="flex gap-3 items-start border-[3px] border-[#161616] bg-[#FFFFFF] cursor-pointer transition-all duration-100 hover:shadow-[4px_4px_0_#161616] p-2.5"
                    style={{
                      opacity: isVisited ? 0.65 : 1,
                    }}
                  >
                    <div className="w-10 h-10 flex-shrink-0 mt-0.5">
                      <StampSvg cat={stop.cat} glyph={stop.glyph} size={40} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-sans font-bold text-[15px] leading-tight text-[#161616] ${
                          isVisited ? "line-through decoration-[#E33D2E] decoration-2" : ""
                        }`}
                      >
                        {t(`stops.${stop.id}.name`)}
                      </p>
                      <p className="mt-0.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#6B6453]">
                        {stop.area}
                      </p>
                      {t(`stops.${stop.id}.hours`) &&
                        t(`stops.${stop.id}.hours`) !== `stops.${stop.id}.hours` && (
                          <p className="mt-1 text-[11.5px] font-medium text-[#161616] flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-[#E89B1F] border border-[#161616] flex items-center justify-center">
                              <Clock size={9} className="text-white" />
                            </span>
                            {t(`stops.${stop.id}.hours`)}
                          </p>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                      <StayButton lat={stop.lat} lng={stop.lng} area={stop.area} size="sm" />
                      <DirectionsButton lat={stop.lat} lng={stop.lng} size="sm" />
                      <button
                        type="button"
                        title={t("stopList.markVisited")}
                        onClick={(e) => onToggleVisited(stop.id, e)}
                        className="w-6 h-6 border-[3px] border-[#161616] flex items-center justify-center transition-colors press cursor-pointer"
                        style={{
                          backgroundColor: isVisited ? "#2E9E4F" : "#FFFFFF",
                        }}
                      >
                        {isVisited && (
                          <span className="text-white text-sm leading-none font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
