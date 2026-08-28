import React from "react";

export const GLYPHS: Record<string, string> = {
  castle: `<path d="M18 44V20h4v4h4v-6h4v6h4v-6h4v6h4v-4h4v24"/><line x1="16" y1="44" x2="48" y2="44"/>`,

  tower: `<rect x="26" y="16" width="12" height="28"/><path d="M22 16h20l-3-6h-14z"/>`,

  cathedral: `<path d="M28 44V18l4-6 4 6v26"/><line x1="20" y1="44" x2="44" y2="44"/><line x1="32" y1="12" x2="32" y2="18"/>`,

  ruins: `<path d="M18 44V28l6-6v6h6v-8h6v10h8v14"/><line x1="16" y1="44" x2="48" y2="44"/>`,

  bridge: `<path d="M16 38a16 16 0 0 1 32 0"/><line x1="16" y1="38" x2="48" y2="38"/><line x1="24" y1="38" x2="24" y2="44"/><line x1="40" y1="38" x2="40" y2="44"/>`,

  tree: `<line x1="32" y1="28" x2="32" y2="44"/><circle cx="32" cy="22" r="8"/>`,

  mountain: `<path d="M16 44L28 24l6 10 6-8 8 18z"/>`,

  flower: `<circle cx="32" cy="24" r="3"/><circle cx="27" cy="20" r="3"/><circle cx="37" cy="20" r="3"/><circle cx="27" cy="28" r="3"/><circle cx="37" cy="28" r="3"/><line x1="32" y1="27" x2="32" y2="44"/>`,

  bear: `<circle cx="32" cy="34" r="10"/><circle cx="24" cy="24" r="4"/><circle cx="40" cy="24" r="4"/>`,

  telescope: `<line x1="22" y1="22" x2="42" y2="18"/><line x1="28" y1="26" x2="24" y2="44"/><line x1="36" y1="24" x2="40" y2="44"/>`,

  fountain: `<path d="M32 18v18"/><path d="M24 30c2 4 6 6 8 6s6-2 8-6"/>`,

  museum: `<rect x="18" y="18" width="28" height="26"/><path d="M18 18L32 12l14 6"/>`,

  fort: `<rect x="18" y="24" width="28" height="20"/><path d="M18 24l4-6h20l4 6"/>`,

  plane: `<path d="M14 32h36"/><path d="M28 24l8 8-8 8"/><line x1="22" y1="28" x2="18" y2="20"/><line x1="22" y1="36" x2="18" y2="44"/>`,

  ferry: `<path d="M18 38h28l-4 6H22z"/><line x1="32" y1="38" x2="32" y2="20"/>`,

  dam: `<line x1="24" y1="18" x2="24" y2="44"/><path d="M24 20c8 2 12 6 12 12s-4 10-12 12"/>`,

  binoculars: `<circle cx="26" cy="30" r="6"/><circle cx="38" cy="30" r="6"/><line x1="32" y1="26" x2="32" y2="34"/>`,

  rose: `<circle cx="32" cy="24" r="8"/><path d="M32 32v12"/>`,

  train: `<rect x="20" y="22" width="24" height="18" rx="3"/><circle cx="26" cy="42" r="2"/><circle cx="38" cy="42" r="2"/>`,

  water: `<path d="M16 28 C20 24 24 24 28 28 C32 32 36 32 40 28 C44 24 48 24 48 28"/> <path d="M16 36 C20 32 24 32 28 36 C32 40 36 40 40 36 C44 32 48 32 48 36"/>`,
};

export const COLORS = {
  history: "#A8842C",
  nature: "#B6332B",
  region: "#3E5C3A",
  water: "#6B4E71",
  culture: "#D87C2C",
  viewpoint: "#2A4A6B",
};

export const CAT_LABEL = {
  history: "History",
  nature: "Nature",
  region: "Region",
  water: "Water",
  culture: "Culture",
  viewpoint: "Viewpoint",
};

interface StampSvgProps {
  cat: keyof typeof COLORS;
  glyph: string;
  size: number;
}

export const StampSvg: React.FC<StampSvgProps> = ({ cat, glyph, size }) => {
  const color = COLORS[cat];
  const glyphMarkup = GLYPHS[glyph] || "";

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="select-none">
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="#FBF6E9"
        stroke="#1B2A4A"
        strokeWidth="2.5"
      />
      <g
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="32" cy="32" r="23.5" strokeDasharray="2.2 3.4" />
        <circle cx="32" cy="32" r="19" />
        <g dangerouslySetInnerHTML={{ __html: glyphMarkup }} />
      </g>
    </svg>
  );
};
