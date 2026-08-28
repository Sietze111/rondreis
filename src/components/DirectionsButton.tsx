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
        className="w-7 h-7 border-2 border-[#161616] bg-[#FFFFFF] flex items-center justify-center text-[#161616] hover:bg-[#F5C400] transition-colors press flex-shrink-0"
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
      className="btn-solid btn--dark mt-3"
    >
      <Navigation size={15} />
      {t("directions.go")}
    </a>
  );
};
