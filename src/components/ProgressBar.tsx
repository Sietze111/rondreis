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
    <div className="bg-[#FBF6E9] border border-[#D8C9A0] rounded-xl p-4 mb-4 shadow-sm">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[#1B2A4A] opacity-75 mb-2">
        {t("progress.title")}
      </div>
      <div className="font-semibold text-lg text-[#1B2A4A] mb-2.5">
        {t("progress.count", { visited: visitedCount, total: totalCount })}
      </div>
      <div className="h-2.5 rounded-full bg-[#e4dcc8] overflow-hidden">
        <div
          className="h-full bg-[#A8842C] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
