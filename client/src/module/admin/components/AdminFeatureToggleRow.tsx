import type { FC } from "react";
import type { AdminFeature } from "../store/adminSlice";

interface Props {
  feature: AdminFeature;
  onToggle: () => void;
}

const AdminFeatureToggleRow: FC<Props> = ({ feature, onToggle }) => {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 hover:border-amber-400/70 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-50">
            {feature.label}
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">
            {feature.group}
          </span>
        </div>
        {feature.description && (
          <p className="mt-1 text-xs text-slate-400">
            {feature.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
          feature.value
            ? "border-emerald-500 bg-emerald-500/20"
            : "border-slate-600 bg-slate-800"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            feature.value ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default AdminFeatureToggleRow;
