import type { FC } from "react";

interface Props {
  reason?: string;
}

const RestrictedContentBlock: FC<Props> = ({ reason }) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-slate-950 px-4 py-16">
      <div className="max-w-md rounded-3xl border border-red-600/60 bg-linear-to-br from-slate-950 via-slate-900 to-black p-6 text-center shadow-[0_0_80px_-40px_rgba(248,113,113,0.8)]">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <span className="text-xl">!</span>
        </div>
        <h1 className="text-lg font-semibold text-slate-50">
          Nội dung này đã bị hạn chế truy cập
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Admin đã khoá quyền xem chi tiết cho nội dung này. Vui lòng quay lại
          sau hoặc liên hệ quản trị viên nếu bạn nghĩ đây là nhầm lẫn.
        </p>
        {reason && (
          <p className="mt-3 text-xs text-red-300">
            Lý do: <span className="font-medium">{reason}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default RestrictedContentBlock;
