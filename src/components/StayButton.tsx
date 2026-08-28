import React from "react";
import { useTranslation } from "react-i18next";
import { BedDouble } from "lucide-react";

interface StayButtonProps {
  lat: number;
  lng: number;
  area: string;
  size?: "sm" | "md";
}

export const StayButton: React.FC<StayButtonProps> = ({
  lat,
  lng,
  area,
  size = "md",
}) => {
  const { t } = useTranslation();

  const query = `${area} ${t("stay.query")}`.trim();
  const url = `https://www.google.com/maps/search/${encodeURIComponent(
    query,
  )}@${lat},${lng},13z`;

  if (size === "sm") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        title={t("stay.title")}
        aria-label={t("stay.title")}
        onClick={(e) => e.stopPropagation()}
        className="w-7 h-7 border-2 border-[#161616] bg-[#FFFFFF] flex items-center justify-center text-[#161616] hover:bg-[#7B4DC0] hover:text-white transition-colors flex-shrink-0"
      >
        <BedDouble size={13} />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="btn-solid btn--purple mt-2"
    >
      <BedDouble size={15} />
      {t("stay.title")}
    </a>
  );
};
