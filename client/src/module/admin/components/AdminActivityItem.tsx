import type { FC } from "react";
import type { AdminActivity } from "../store/adminSlice";

interface Props {
  item: AdminActivity;
}

const typeColors: Record<string, string> = {
  "feature-toggle": "bg-amber-500/20 text-amber-300 border-amber-500/60",
  "section-visibility": "bg-sky-500/15 text-sky-300 border-sky-500/60",
  "section-order": "bg-violet-500/15 text-violet-300 border-violet-500/60",
  notice: "bg-slate-700/40 text-slate-200 border-slate-500/60",
};

const AdminActivityItem: FC<Props> = ({ item }) => {
  const date = new Date(item.createdAt);
  const timeLabel = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateLabel = date.toLocaleDateString("vi-VN");

  const badgeClass =
    typeColors[item.type] ??
    "bg-slate-700/40 text-slate-200 border-slate-500/60";

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
      <div
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${badgeClass}`}
      >
        {item.type === "feature-toggle" && "FEATURE"}
        {item.type === "section-visibility" && "VISIBILITY"}
        {item.type === "section-order" && "LAYOUT"}
        {item.type === "notice" && "NOTICE"}
      </div>
      <p className="mt-2 text-xs text-slate-100">{item.message}</p>
      <p className="mt-1 text-[11px] text-slate-500">
        {timeLabel} · {dateLabel}
      </p>
    </div>
  );
};

export default AdminActivityItem;
