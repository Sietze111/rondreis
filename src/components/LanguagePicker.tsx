import { useTranslation } from "react-i18next";

export function LanguagePicker() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="rounded-full border border-[#B28A2E]/50 bg-[#2A2E22] px-3 py-2 text-sm text-[#D8D0B8] font-mono text-xs tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B28A2E]/50 appearance-none text-center min-w-[110px]"
    >
      <option value="nl" className="bg-[#20241B]">🇳🇱 Nederlands</option>
      <option value="en" className="bg-[#20241B]">🇬🇧 English</option>
    </select>
  );
}
