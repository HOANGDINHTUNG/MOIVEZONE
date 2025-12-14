import type { FC } from "react";
import type { AdminSectionConfig } from "../store/adminSlice";

interface Props {
  section: AdminSectionConfig;
  isFirst: boolean;
  isLast: boolean;
  onToggleVisible: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const AdminSectionRow: FC<Props> = ({
  section,
  isFirst,
  isLast,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 hover:border-amber-400/70 transition-colors">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">
            #{section.order.toString().padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold text-slate-50">
            {section.title}
          </span>
        </div>
        {section.description && (
          <p className="mt-1 text-xs text-slate-400">{section.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 text-xs hover:border-amber-400 hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 text-xs hover:border-amber-400 hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Move down"
        >
          ↓
        </button>

        <button
          type="button"
          onClick={onToggleVisible}
          className={`ml-1 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
            section.visible
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/70"
              : "bg-slate-800 text-slate-300 border border-slate-600 hover:border-amber-400 hover:text-amber-300"
          }`}
        >
          {section.visible ? "Đang hiển thị" : "Đang ẩn"}
        </button>
      </div>
    </div>
  );
};

export default AdminSectionRow;
