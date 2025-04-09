import { BarChatDemo } from "@/components/BarChatDemo";
import { BarChatDemo2 } from "@/components/BarChatDemo2";

const stats = [
  {
    icon: "📈",
    bgColor: "bg-blue-500",
    label: "Total Sales",
    value: "$12,450",
  },
  { icon: "👤", bgColor: "bg-green-500", label: "New Users", value: "1,230" },
  { icon: "🛒", bgColor: "bg-yellow-500", label: "Orders", value: "320" },
  { icon: "💰", bgColor: "bg-red-500", label: "Revenue", value: "$8,750" },
];

export default function DashBoardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 py-2 md:py-4 px-4">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center py-5 px-4 bg-white rounded-xl shadow border"
          >
            <div className={`p-3 ${stat.bgColor} text-white rounded-lg`}>
              {stat.icon}
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2 lg:gap-4">
        <BarChatDemo />
        <BarChatDemo2 />
      </div>
    </div>
  );
}
