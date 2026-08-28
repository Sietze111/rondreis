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
        <div className="popup-card w-[252px] font-sans text-[#161616]">
          {/* Header */}
          <div
            className="px-3 pt-3 pb-2 flex gap-2.5 items-center relative border-b-[3px] border-[#161616]"
            style={{ backgroundColor: `${COLORS[stop.cat]}` }}
          >
            <div
              className="flex-shrink-0 bg-white border-2 border-[#161616] p-0.5"
              style={{ boxShadow: "3px 3px 0 #161616", transform: `rotate(${rotPopup}deg)` }}
            >
              <StampSvg cat={stop.cat} glyph={stop.glyph} size={48} />
            </div>
            <div className="min-w-0">
              <p className="font-sans font-bold text-[16px] leading-[1.05] text-white">
                {i18n.t(`stops.${stop.id}.name`)}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 inline-block bg-white text-[#161616] border-2 border-[#161616]">
                  {i18n.t(`categories.${stop.cat}`)}
                </span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 inline-block bg-[#F5C400] text-[#161616] border-2 border-[#161616]">
                  {i18n.t(`stops.${stop.id}.date`)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-3 py-2.5">
            <p className="text-[13px] font-medium leading-relaxed mb-2">
              {i18n.t(`stops.${stop.id}.blurb`)}
            </p>
            <div className="text-[12.5px] leading-relaxed bg-[#F4EFE2] border-2 border-[#161616] p-2.5">
              <b className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E33D2E] block mb-0.5">
                {i18n.t("popup.history")}
              </b>
              {i18n.t(`stops.${stop.id}.context`)}
            </div>
            {hours !== hoursKey && (
              <div className="text-[12.5px] leading-relaxed mt-2 flex items-start gap-2 bg-[#E8A33D]/30 border-2 border-[#161616] p-2.5">
                <Clock size={13} className="flex-shrink-0 mt-0.5 text-[#161616]" />
                <span>{hours}</span>
              </div>
            )}
            <div className="text-[12.5px] leading-relaxed bg-[#7B4DC0] text-white p-2.5 mt-2 border-2 border-[#161616]">
              <b className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#F5C400] block mb-0.5">
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
    <div className="relative w-full h-full min-h-[40vh] md:min-h-0 bg-[#F4EFE2]">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: "inherit" }}
      />
    </div>
  );
};
