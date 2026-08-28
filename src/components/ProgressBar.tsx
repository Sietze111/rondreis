import React from "react";
import { useTranslation } from "react-i18next";

interface ProgressBarProps {
  visitedCount: number;
  totalCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  visitedCount,
  totalCount,
}) => {
  const { t } = useTranslation();
  const percentage = totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-[#E8E2D3] border border-[#B8AD8E] rounded-xl p-4 mb-4 shadow-sm">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[#2B2B23] opacity-75 mb-2">
        {t("progress.title")}
      </div>
      <div className="font-semibold text-lg text-[#2B2B23] mb-2.5">
        {t("progress.count", { visited: visitedCount, total: totalCount })}
      </div>
      <div className="h-2.5 rounded-full bg-[#cfc7b0] overflow-hidden">
        <div
          className="h-full bg-[#8A6D2F] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
