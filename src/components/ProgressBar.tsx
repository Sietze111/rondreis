import React from "react";
import { useTranslation } from "react-i18next";
import { Target } from "lucide-react";

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
    <div className="brutal-card p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#161616] flex items-center gap-2">
          <span className="w-5 h-5 bg-[#161616] text-[#F5C400] flex items-center justify-center">
            <Target size={13} />
          </span>
          {t("progress.title")}
        </div>
        <div className="font-display text-xl leading-none text-[#E33D2E]">
          {t("progress.count", { visited: visitedCount, total: totalCount })}
        </div>
      </div>

      <div className="h-6 border-[3px] border-[#161616] bg-[#E4DCC8] relative">
        <div
          className="h-full bg-[#F5C400] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* step ticks */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <span
            key={i}
            className="absolute top-0 bottom-0 w-[3px] bg-[#161616]/40"
            style={{ left: `${i * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
};
