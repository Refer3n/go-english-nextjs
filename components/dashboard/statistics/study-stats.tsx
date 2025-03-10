import { Card, CardContent } from "@/components/ui/card";
import { Clock, RotateCw } from "lucide-react";

interface StudyStatsProps {
  totalTasks: number;
  totalTimeSpent: number;
}

export default function StudyStats({
  totalTasks,
  totalTimeSpent,
}: StudyStatsProps) {
  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="bg-white border-none shadow-none">
        <CardContent className="p-4 flex items-center gap-4 border-none">
          <div className="flex items-center justify-center">
            <RotateCw className="h-10 w-10 text-light-300" />
          </div>
          <div>
            <div className="text-2xl font-bold text-light-300">
              {totalTasks}
            </div>
            <div className="font-semibold text-light-300">Tasks Completed</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-none shadow-none">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex items-center justify-center">
            <Clock className="h-10 w-10 text-light-300" />
          </div>
          <div>
            <div className="text-2xl font-bold text-light-300">
              {formatTimeSpent(totalTimeSpent)}
            </div>
            <div className="font-semibold text-light-300">
              Time Spent Studying
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
