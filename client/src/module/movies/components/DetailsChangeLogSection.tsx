import React from "react";
import moment from "moment";

interface MediaChangeSummary {
  key: string;
  action: string;
  time: string;
}

interface DetailsChangeLogSectionProps {
  changeLog: MediaChangeSummary[];
}

const humanizeKey = (key: string) => {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const DetailsChangeLogSection: React.FC<DetailsChangeLogSectionProps> = ({
  changeLog,
}) => {
  if (!changeLog.length) return null;

  return (
    <section
      aria-label="Change log"
      className="rounded-xl bg-neutral-900/60 p-4"
    >
      <h2 className="mb-3 border-b border-neutral-800 pb-2 text-sm font-semibold uppercase tracking-wide text-neutral-200">
        Change log
      </h2>

      <ul className="space-y-2 text-xs text-neutral-300">
        {changeLog.map((c, idx) => (
          <li key={`${c.key}-${c.time}-${idx}`} className="flex gap-2">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-semibold">
                  {humanizeKey(c.key)} &middot; {c.action}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {moment(c.time).fromNow()}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DetailsChangeLogSection;
