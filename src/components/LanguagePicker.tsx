import { useTranslation } from "react-i18next";

export function LanguagePicker() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="rounded-full border border-[#2B2B23] bg-[#E8E2D3] px-3 py-2 text-sm"
    >
      <option value="nl">🇳🇱 Nederlands</option>
      <option value="en">🇬🇧 English</option>
    </select>
  );
}
