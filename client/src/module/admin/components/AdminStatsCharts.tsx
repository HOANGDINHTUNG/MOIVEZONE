import type { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const activityByDay = [
  { day: "Mon", changes: 4, logins: 32 },
  { day: "Tue", changes: 7, logins: 45 },
  { day: "Wed", changes: 5, logins: 38 },
  { day: "Thu", changes: 9, logins: 52 },
  { day: "Fri", changes: 3, logins: 29 },
  { day: "Sat", changes: 2, logins: 21 },
  { day: "Sun", changes: 1, logins: 15 },
];

const contentStats = [
  { type: "Movies", created: 182 },
  { type: "TV Shows", created: 95 },
  { type: "Events", created: 24 },
];

const featureUsage = [
  { name: "Reviews", value: 68 },
  { name: "Watchlist", value: 82 },
  { name: "Rating", value: 74 },
];

const PIE_COLORS = ["#f59e0b", "#22c55e", "#0ea5e9"];

const AdminStatsCharts: FC = () => {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Biểu đồ line: activity theo ngày */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
              Hoạt động trong tuần
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Số lần admin thay đổi cấu hình & số lượt đăng nhập (demo data).
            </p>
          </div>
        </div>

        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                stroke="#4b5563"
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                stroke="#4b5563"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderRadius: 12,
                  border: "1px solid #334155",
                  fontSize: 11,
                }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#9ca3af" }}
                iconSize={10}
              />
              <Line
                type="monotone"
                dataKey="changes"
                name="Thay đổi admin"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="logins"
                name="Lượt đăng nhập"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ bar + pie: nội dung & feature usage */}
      <div className="space-y-4">
        {/* Bar chart: nội dung tạo ra */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
                Nội dung được tạo (demo)
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Thống kê số lượng Movies / TV Show / Events trong hệ thống.
              </p>
            </div>
          </div>

          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentStats} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="type"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  stroke="#4b5563"
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  stroke="#4b5563"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderRadius: 12,
                    border: "1px solid #334155",
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Bar dataKey="created" name="Số lượng" radius={[6, 6, 0, 0]}>
                  <Cell fill="#f97316" />
                  <Cell fill="#22c55e" />
                  <Cell fill="#38bdf8" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart: usage feature */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
                Mức độ sử dụng tính năng
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Tỉ lệ người dùng sử dụng Reviews, Watchlist, Rating (giá trị
                demo, bạn có thể bind API sau).
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="h-40 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={featureUsage}
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="#020617"
                  >
                    {featureUsage.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderRadius: 12,
                      border: "1px solid #334155",
                      fontSize: 11,
                    }}
                    labelStyle={{ color: "#e5e7eb" }}
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-2 text-xs text-slate-300">
              {featureUsage.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-100">
                    {item.value}%
                  </span>
                </div>
              ))}
              <p className="mt-1 text-[11px] text-slate-500">
                Đây là số liệu minh hoạ. Sau này bạn có thể nối từ API thật vào
                component này.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCharts;
