import { ChartDataItem } from "@/lib/utils/chart-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface StudyChartProps {
  chartData: ChartDataItem[];
  yAxisDomain: [number, number];
  yAxisTicks: number[];
  period: string;
}

export default function StudyChart({
  chartData,
  yAxisDomain,
  yAxisTicks,
  period,
}: StudyChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            label={{
              value:
                period === "year"
                  ? "Month"
                  : period === "month"
                    ? "Day"
                    : "Day of Week",
              position: "insideBottomRight",
              offset: -10,
              fontSize: 12,
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            label={{
              value: "Tasks Completed",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
              fontSize: 12,
            }}
            domain={yAxisDomain}
            ticks={yAxisTicks}
          />
          <Bar
            dataKey="tasks"
            fill="#2C2D84"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
