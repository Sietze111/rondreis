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
    <div className="panel rounded-xl p-4 mb-4 relative overflow-hidden">
      {/* subtle topo tint */}
      <div className="absolute inset-0 texture-topo opacity-30 pointer-events-none" aria-hidden />

      <div className="relative flex items-center justify-between mb-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B28A2E] flex items-center gap-1.5">
          <Target size={12} />
          {t("progress.title")}
        </div>
        <div className="font-display text-sm font-semibold text-[#25271E]">
          {t("progress.count", { visited: visitedCount, total: totalCount })}
        </div>
      </div>

      <div className="relative mt-2 h-3 rounded-full bg-[#C6B99A]/50 overflow-hidden border border-[#C6B99A]">
        <div
          className="h-full bg-gradient-to-r from-[#A9832A] to-[#CAA75A] transition-all duration-500 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0 4px, transparent 4px 8px)",
            }}
          />
        </div>
      </div>

      <div className="relative mt-2 flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#6D6855]">
        <span>0</span>
        <span>{Math.round(totalCount / 2)}</span>
        <span>{totalCount}</span>
      </div>
    </div>
  );
};
