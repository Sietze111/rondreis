import React from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "lucide-react";

interface DirectionsButtonProps {
  lat: number;
  lng: number;
  size?: "sm" | "md";
}

export const DirectionsButton: React.FC<DirectionsButtonProps> = ({
  lat,
  lng,
  size = "md",
}) => {
  const { t } = useTranslation();
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  if (size === "sm") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        title={t("directions.go")}
        aria-label={t("directions.go")}
        onClick={(e) => e.stopPropagation()}
        className="w-7 h-7 rounded-full border border-[#25271E]/30 flex items-center justify-center text-[#25271E] hover:bg-[#7C2B2B] hover:border-[#7C2B2B] hover:text-[#F3EDDE] transition-colors press flex-shrink-0"
      >
        <Navigation size={13} />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="press mt-3 flex items-center justify-center gap-2 bg-[#25271E] text-[#F3EDDE] rounded-lg px-4 py-2.5 font-mono text-[11px] tracking-wider font-bold hover:bg-[#7C2B2B] border border-[#B28A2E]/40 transition-colors"
    >
      <Navigation size={15} />
      {t("directions.go")}
    </a>
  );
};
