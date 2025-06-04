import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatisticCardProps = {
  title: string;
  value: string;
  icon: string;
  iconColor: "primary" | "secondary" | "warning" | "destructive";
  trend: string;
  trendDirection: "up" | "down";
  trendText: string;
  trendType?: "positive" | "negative";
};

const getIconBgColor = (color: StatisticCardProps["iconColor"]) => {
  switch (color) {
    case "primary":
      return "bg-primary/10 text-primary";
    case "secondary":
      return "bg-secondary/10 text-secondary";
    case "warning":
      return "bg-yellow-100 text-yellow-600";
    case "destructive":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-primary/10 text-primary";
  }
};

const getTrendColor = (direction: StatisticCardProps["trendDirection"], type?: StatisticCardProps["trendType"]) => {
  // If trend type is specified, use that
  if (type === "positive") return "text-green-500";
  if (type === "negative") return "text-destructive";
  
  // Otherwise use direction
  return direction === "up" ? "text-green-500" : "text-destructive";
};

export default function StatisticCard({
  title,
  value,
  icon,
  iconColor,
  trend,
  trendDirection,
  trendText,
  trendType
}: StatisticCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <h3 className="mt-1 text-2xl font-bold text-neutral-900">{value}</h3>
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-xl", getIconBgColor(iconColor))}>
            <i className={icon}></i>
          </div>
        </div>
        <div className="mt-3 flex items-center text-sm">
          <span className={cn("flex items-center font-medium", getTrendColor(trendDirection, trendType))}>
            <i className={`fas fa-arrow-${trendDirection} mr-1 text-xs`}></i>
            {trend}
          </span>
          <span className="text-neutral-500 ml-2">{trendText}</span>
        </div>
      </CardContent>
    </Card>
  );
}
