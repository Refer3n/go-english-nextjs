export type ChartDataItem = {
  month: string;
  tasks: number;
  date: Date;
};

export type ApiDataItem = {
  tasksCompleted: number;
  startDate: Date;
  timeSpentInMinutes: number;
};

export const calculateYAxisProps = (chartData: ChartDataItem[]) => {
  const maxTasks = Math.max(...chartData.map((item) => item.tasks), 10);
  const roundedMax = Math.ceil(maxTasks / 10) * 10 + 10;

  const yAxisDomain: [number, number] = [0, roundedMax];

  const yAxisTicks = [];
  for (let i = 0; i <= roundedMax; i += 10) {
    yAxisTicks.push(i);
  }

  return { yAxisDomain, yAxisTicks };
};
