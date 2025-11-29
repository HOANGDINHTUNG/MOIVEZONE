import { useState } from "react";
import type { TMDBJobDepartment } from "../database/interface/configuration";

interface JobsSectionProps {
  jobs: TMDBJobDepartment[];
}

export const JobsSection = ({ jobs }: JobsSectionProps) => {
  const [openDepartment, setOpenDepartment] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {jobs.map((d) => {
        const isOpen = openDepartment === d.department;
        return (
          <div
            key={d.department}
            className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/80 shadow-sm transition hover:border-rose-500/50 dark:bg-slate-900/70 dark:border-slate-700/70 dark:hover:border-rose-500/60"
          >
            <button
              type="button"
              onClick={() => setOpenDepartment(isOpen ? null : d.department)}
              className="flex w-full items-center justify-between px-4 py-2 text-left"
            >
              <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {d.department}
              </span>
              <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{d.jobs.length} jobs</span>
                <span
                  className={
                    "inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-600 dark:border-slate-600 dark:text-slate-200 transition-transform " +
                    (isOpen ? "rotate-180" : "")
                  }
                >
                  ▼
                </span>
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-slate-200/80 px-4 py-3 text-xs dark:border-slate-700/80">
                <div className="flex flex-wrap gap-1.5">
                  {d.jobs.map((job,index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {job}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {jobs.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Không có dữ liệu jobs.
        </p>
      )}
    </div>
  );
};
