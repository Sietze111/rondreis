import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import type { Stop } from "./StopList";
import { StampSvg, COLORS } from "./StampSvg";
import { DirectionsButton } from "./DirectionsButton";
import { renderToString } from "react-dom/server";
import { Clock } from "lucide-react";

interface MapProps {
  stops: Stop[];
  activeCategory: string;
  selectedStop: Stop | null;
  onClearSelectedStop: () => void;
}

export const RouteMap: React.FC<MapProps> = ({
  stops,
  activeCategory,
  selectedStop,
  onClearSelectedStop,
}) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<globalThis.Map<string, L.Marker>>(
    new globalThis.Map(),
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = L.map(mapContainerRef.current, {
      scrollWheelZoom: true,
    }).setView([49.6, 0.6], 8);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    mapRef.current = mapInstance;

    return () => {
      mapInstance.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync Markers
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    markersRef.current.forEach((marker) => {
      mapInstance.removeLayer(marker);
    });
    markersRef.current.clear();

    stops.forEach((stop, index) => {
      const show = activeCategory === "all" || stop.cat === activeCategory;
      if (!show) return;

      const rotIcon = ((index * 37) % 13) - 6;
      const rotPopup = ((index * 53) % 9) - 4;

      const stampHtml = renderToString(
        <div style={{ transform: `rotate(${rotIcon}deg)` }}>
          <StampSvg cat={stop.cat} glyph={stop.glyph} size={40} />
        </div>,
      );

      const icon = L.divIcon({
        html: stampHtml,
        className: "stamp-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -14],
      });

      const hoursKey = `stops.${stop.id}.hours`;
      const hours = i18n.t(hoursKey);

      const popupHtml = renderToString(
        <div className="popup-card w-[252px] font-sans text-[#25271E]">
          {/* Header */}
          <div
            className="px-3 pt-3 pb-2 flex gap-2.5 items-center relative"
            style={{
              background: `linear-gradient(180deg, ${COLORS[stop.cat]}18, transparent)`,
              borderBottom: `1px solid ${COLORS[stop.cat]}55`,
            }}
          >
            <div className="flex-shrink-0" style={{ transform: `rotate(${rotPopup}deg)` }}>
              <StampSvg cat={stop.cat} glyph={stop.glyph} size={56} />
            </div>
            <div className="min-w-0">
              <p className="font-serif font-bold text-[16px] leading-[1.1] text-[#25271E]">
                {i18n.t(`stops.${stop.id}.name`)}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span
                  className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full inline-block"
                  style={{
                    backgroundColor: COLORS[stop.cat],
                    color: "#fff",
                  }}
                >
                  {i18n.t(`categories.${stop.cat}`)}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full inline-block bg-[#20241B] text-[#D8D0B8] border border-[#B28A2E]/50">
                  {i18n.t(`stops.${stop.id}.date`)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-3 py-2.5">
            <p className="text-[13px] leading-relaxed text-[#25271E] mb-2">
              {i18n.t(`stops.${stop.id}.blurb`)}
            </p>
            <div className="text-[12.5px] leading-relaxed bg-[#20241B]/[0.05] border border-[#20241B]/15 p-2.5 rounded text-[#25271E]">
              <b className="font-mono text-[10px] uppercase tracking-wider text-[#7C2B2B] block mb-0.5">
                {i18n.t("popup.history")}
              </b>
              {i18n.t(`stops.${stop.id}.context`)}
            </div>
            {hours !== hoursKey && (
              <div className="text-[12.5px] leading-relaxed mt-2 flex items-start gap-2 bg-[#7C2B2B]/[0.07] border border-[#7C2B2B]/20 p-2.5 rounded text-[#25271E]">
                <Clock size={13} className="flex-shrink-0 mt-0.5 text-[#7C2B2B]" />
                <span>{hours}</span>
              </div>
            )}
            <div
              className="text-[12.5px] leading-relaxed p-2.5 rounded mt-2 text-[#3A3C2E]"
              style={{
                background: "rgba(178,138,46,0.10)",
                borderLeft: "3px solid #B28A2E",
              }}
            >
              <b className="font-mono text-[10px] uppercase tracking-wider text-[#8a6c1f] block mb-0.5">
                {i18n.t("popup.goodToKnow")}
              </b>
              {i18n.t(`stops.${stop.id}.tip`)}
            </div>
            <DirectionsButton lat={stop.lat} lng={stop.lng} />
          </div>
        </div>,
      );

      const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(
        mapInstance,
      );
      marker.bindPopup(popupHtml);

      markersRef.current.set(stop.id, marker);
    });
    // re-run when language changes so popups (rendered as static HTML) update too
  }, [stops, activeCategory, t, i18n.resolvedLanguage]);

  // Handle flying to selected stop
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance || !selectedStop) return;

    mapInstance.flyTo([selectedStop.lat, selectedStop.lng], 15, {
      duration: 0.8,
    });

    const marker = markersRef.current.get(selectedStop.id);
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
        onClearSelectedStop();
      }, 700);
    } else {
      onClearSelectedStop();
    }
  }, [selectedStop, onClearSelectedStop]);

  return (
    <div className="relative w-full h-full min-h-[40vh] md:min-h-0 bg-[#DFD6BD]">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: "inherit" }}
      />
    </div>
  );
};
