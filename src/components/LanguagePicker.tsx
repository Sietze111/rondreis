import { useTranslation } from "react-i18next";

export function LanguagePicker() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="font-mono text-xs font-bold tracking-wider cursor-pointer border-[3px] border-[#161616] bg-[#FFFFFF] px-3 py-2 shadow-[3px_3px_0_#161616] focus:outline-none focus:bg-[#F5C400] text-[#161616] appearance-none text-center min-w-[120px]"
    >
      <option value="nl" className="bg-white">🇳🇱 Nederlands</option>
      <option value="en" className="bg-white">🇬🇧 English</option>
    </select>
  );
}
