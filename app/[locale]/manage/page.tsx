import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartAreaInteractive } from "@/components/ui-custom/chart-area-interactive";

const statsData = [
  {
    title: "Tổng doanh thu",
    value: "$1,250.00",
    badge: "+12.5%",
    icon: <TrendingUpIcon className="size-3" />,
    footerMain: "Tăng trưởng trong tháng này",
    footerIcon: <TrendingUpIcon className="size-4" />,
    footerDesc: "Lượt truy cập trong 6 tháng qua",
    trending: "up",
  },
  {
    title: "Khách hàng mới",
    value: "1,234",
    badge: "-20%",
    icon: <TrendingDownIcon className="size-3" />,
    footerMain: "Giảm 20% trong kỳ này",
    footerIcon: <TrendingDownIcon className="size-4" />,
    footerDesc: "Cần chú ý đến việc thu hút khách",
    trending: "down",
  },
  {
    title: "Tài khoản hoạt động",
    value: "45,678",
    badge: "+12.5%",
    icon: <TrendingUpIcon className="size-3" />,
    footerMain: "Giữ chân người dùng tốt",
    footerIcon: <TrendingUpIcon className="size-4" />,
    footerDesc: "Mức độ tương tác vượt mục tiêu",
    trending: "up",
  },
  {
    title: "Tỷ lệ tăng trưởng",
    value: "4.5%",
    badge: "+4.5%",
    icon: <TrendingUpIcon className="size-3" />,
    footerMain: "Hiệu suất ổn định",
    footerIcon: <TrendingUpIcon className="size-4" />,
    footerDesc: "Đáp ứng chỉ tiêu tăng trưởng",
    trending: "up",
  },
];

export default function DashBoardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 py-2 md:py-4 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((item, idx) => (
          <Card key={idx} className="@container/card">
            <CardHeader className="relative">
              <CardDescription>{item.title}</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {item.value}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {item.icon}
                  {item.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {item.footerMain} {item.footerIcon}
              </div>
              <div className="text-muted-foreground">{item.footerDesc}</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ChartAreaInteractive />
    </div>
  );
}