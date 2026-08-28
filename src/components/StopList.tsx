import React from "react";
import { useTranslation } from "react-i18next";
import { StampSvg, COLORS } from "./StampSvg";

export interface Stop {
  id: string;
  area: string;
  cat: "history" | "nature" | "region" | "water" | "culture" | "viewpoint";
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
}

const CAT_ORDER: Array<Stop["cat"]> = [
  "history",
  "nature",
  "region",
  "water",
  "culture",
  "viewpoint",
];

export const StopList: React.FC<StopListProps> = ({
  stops,
  visited,
  onToggleVisited,
  onStopClick,
  activeCategory,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {CAT_ORDER.map((cat) => {
        const catStops = stops.filter((s) => s.cat === cat);
        if (activeCategory !== "all" && activeCategory !== cat) {
          return null;
        }

        return (
          <div key={cat} className="mt-1">
            <div className="font-mono text-[11px] uppercase tracking-wider pb-1.5 mb-2 border-b border-[#D8C9A0] flex items-center gap-2 text-[#1B2A4A] font-semibold">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[cat] }}
              />
              {t(`categories.${cat}`)}
            </div>

            <div className="space-y-1">
              {catStops.map((stop) => {
                const isVisited = visited.has(stop.id);

                return (
                  <div
                    key={stop.id}
                    onClick={() => onStopClick(stop)}
                    className="flex gap-3.5 items-start p-2 rounded-lg cursor-pointer hover:bg-[#FBF6E9] transition-colors"
                  >
                    <div className="w-8 h-8 flex-shrink-0">
                      <StampSvg cat={stop.cat} glyph={stop.glyph} size={32} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-serif font-bold text-[15px] leading-tight text-[#1B2A4A] ${
                          isVisited ? "opacity-40 line-through" : ""
                        }`}
                      >
                        {t(`stops.${stop.id}.name`)}
                      </p>
                      <p
                        className={`text-[12px] text-[#46506b] ${
                          isVisited ? "opacity-40" : ""
                        }`}
                      >
                        {stop.area}
                      </p>
                    </div>

                    <button
                      type="button"
                      title={t("stopList.markVisited")}
                      onClick={(e) => onToggleVisited(stop.id, e)}
                      className={`w-[19px] h-[19px] rounded-full border border-[#1B2A4A] flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        isVisited ? "bg-[#1B2A4A]" : "hover:bg-[#1B2A4A]/5"
                      }`}
                    >
                      {isVisited && (
                        <span className="text-[#F3ECD9] text-[10px] leading-none font-bold">
                          ✓
                        </span>
                      )}
                    </button>
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
