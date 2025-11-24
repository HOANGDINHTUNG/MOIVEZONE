// src/components/common/LanguageToggle.tsx
import { useDispatch, useSelector } from "react-redux";
import {
  setLanguage,
  type AppLanguage,
} from "../../../module/movies/store/languageSlice";
import type { RootState } from "../../../stores";

const languages: { code: AppLanguage; label: string }[] = [
  { code: "vi-VN", label: "VI" },
  { code: "en-US", label: "EN" },
];

export default function LanguageToggle() {
  const dispatch = useDispatch();
  const current = useSelector((state: RootState) => state.language.current);

  return (
    <div className="inline-flex items-center rounded-full border border-neutral-300 bg-white p-0.5 text-xs shadow-sm dark:border-neutral-600 dark:bg-neutral-800">
      {languages.map((lang) => {
        const active = current === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => dispatch(setLanguage(lang.code))}
            className={[
              "px-2 py-0.5 rounded-full transition-colors",
              active
                ? "bg-red-600 text-white dark:bg-red-500"
                : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700",
            ].join(" ")}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
