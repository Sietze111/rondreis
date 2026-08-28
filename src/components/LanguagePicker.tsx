import { useTranslation } from "react-i18next";

export function LanguagePicker() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="rounded-full border border-[#1B2A4A] bg-[#FBF6E9] px-3 py-2 text-sm"
    >
      <option value="en">🇬🇧 English</option>
      <option value="ru">🇷🇺 Русский</option>
    </select>
  );
}
