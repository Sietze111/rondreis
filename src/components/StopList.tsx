import React from "react";
import { useTranslation } from "react-i18next";
import { StampSvg, COLORS } from "./StampSvg";
import { DirectionsButton } from "./DirectionsButton";
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
}

interface StopListProps {
  stops: Stop[];
  visited: Set<string>;
  onToggleVisited: (id: string, e: React.MouseEvent) => void;
  onStopClick: (stop: Stop) => void;
  activeCategory: string;
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
  search,
}) => {
  const { t } = useTranslation();
  const query = search.trim().toLowerCase();

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
          (s) => s.cat === cat && matchesSearch(s),
        );
        if (catStops.length === 0) {
          return null;
        }

        return (
          <div key={cat} className="mt-1">
            <div className="flex items-center gap-2 pb-2 mb-1">
              <span
                className="w-3 h-3 rotate-45 border border-[#25271E]/60"
                style={{ backgroundColor: COLORS[cat] }}
              />
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-[#25271E]">
                {t(`categories.${cat}`)}
              </h3>
              <span className="h-px flex-1 bg-[#C6B99A]" />
              <span className="font-mono text-[10px] text-[#6D6855]">
                {catStops.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {catStops.map((stop) => {
                const isVisited = visited.has(stop.id);

                return (
                  <div
                    key={stop.id}
                    onClick={() => onStopClick(stop)}
                    className="flex gap-3 items-start p-2.5 rounded-lg cursor-pointer border border-transparent transition-all duration-150 hover:border-[#C6B99A] hover:bg-[#F3EDDE] hover:shadow-[0_4px_14px_-4px_rgba(32,36,27,0.35)]"
                  >
                    <div className="w-9 h-9 flex-shrink-0 mt-0.5">
                      <StampSvg cat={stop.cat} glyph={stop.glyph} size={36} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-serif font-bold text-[15.5px] leading-tight text-[#25271E] ${
                          isVisited ? "opacity-40 line-through" : ""
                        }`}
                      >
                        {t(`stops.${stop.id}.name`)}
                      </p>
                      <p
                        className={`mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-[#6D6855] ${
                          isVisited ? "opacity-40" : ""
                        }`}
                      >
                        {stop.area}
                      </p>
                      {t(`stops.${stop.id}.hours`) &&
                        t(`stops.${stop.id}.hours`) !== `stops.${stop.id}.hours` && (
                          <p
                            className={`mt-1 text-[11px] text-[#3A3C2E]/80 flex items-center gap-1 ${
                              isVisited ? "opacity-40" : ""
                            }`}
                          >
                            <Clock size={11} className="text-[#B28A2E]" />
                            {t(`stops.${stop.id}.hours`)}
                          </p>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                      <DirectionsButton lat={stop.lat} lng={stop.lng} size="sm" />
                      <button
                        type="button"
                        title={t("stopList.markVisited")}
                        onClick={(e) => onToggleVisited(stop.id, e)}
                        className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center transition-all press ${
                          isVisited
                            ? "bg-[#7C2B2B] border-[#7C2B2B] text-[#F3EDDE]"
                            : "border-[#25271E]/60 hover:bg-[#25271E]/10"
                        }`}
                      >
                        {isVisited && (
                          <span className="text-[10px] leading-none font-bold">
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
