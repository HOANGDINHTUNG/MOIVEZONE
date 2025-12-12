import type { FC, FormEvent } from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/UseCustomeRedux";
import {
  addRestrictedTitle,
  removeRestrictedTitle,
  selectAdminState,
} from "../store/adminSlice";

const AdminRestrictedContentPanel: FC = () => {
  const dispatch = useAppDispatch();
  const { restrictedTitles } = useAppSelector(selectAdminState);

  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [rawId, setRawId] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = Number(rawId.trim());
    if (!id || Number.isNaN(id)) return;

    dispatch(
      addRestrictedTitle({
        id,
        mediaType,
        reason: reason.trim() || undefined,
      })
    );
    setRawId("");
    setReason("");
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
            Chặn truy cập nội dung
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Nhập ID phim hoặc TV show để chặn người dùng vào xem trang chi tiết.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 grid gap-3 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,0.5fr)]"
      >
        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Loại nội dung
          </label>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as "movie" | "tv")}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
          >
            <option value="movie">Movie</option>
            <option value="tv">TV Show</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            ID TMDB
          </label>
          <input
            value={rawId}
            onChange={(e) => setRawId(e.target.value)}
            placeholder="VD: 603, 671, 1396..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
          />
        </div>

        <div className="space-y-1 md:col-span-1">
          <label className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Lý do (tuỳ chọn)
          </label>
          <div className="flex gap-2">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Nội dung giới hạn, yêu cầu tuổi 18+..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black shadow shadow-amber-500/40 hover:brightness-110"
            >
              Thêm
            </button>
          </div>
        </div>
      </form>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
          Danh sách nội dung đang bị chặn
        </p>

        {restrictedTitles.length === 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Chưa có nội dung nào bị chặn.
          </p>
        )}

        <div className="mt-3 space-y-2">
          {restrictedTitles.map((item) => (
            <div
              key={`${item.mediaType}-${item.id}`}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-800 px-2 py-px text-[10px] uppercase tracking-[0.16em] text-slate-300">
                    {item.mediaType === "movie" ? "MOVIE" : "TV"}
                  </span>
                  <span className="font-mono text-slate-100">
                    ID: {item.id}
                  </span>
                </div>
                {item.reason && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Lý do: {item.reason}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    removeRestrictedTitle({
                      id: item.id,
                      mediaType: item.mediaType,
                    })
                  )
                }
                className="text-[11px] text-red-400 hover:text-red-300"
              >
                Gỡ chặn
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRestrictedContentPanel;
