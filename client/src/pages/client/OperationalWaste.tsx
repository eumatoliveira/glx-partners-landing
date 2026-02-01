import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  MessageSquare,
  Calendar,
  Bot,
} from "lucide-react";

// Heatmap data - valores de intensidade por dia/hora
const heatmapData = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  times: [
    { label: "Morning", sublabel: "8am-12pm" },
    { label: "Afternoon", sublabel: "1pm-5pm" },
    { label: "Evening", sublabel: "5pm-8pm" },
  ],
  values: [
    [0.85, 0.45, 0.35, 0.55, 0.75], // Morning
    [0.35, 0.50, 0.65, 0.55, 0.90], // Afternoon
    [0.55, 0.30, 0.70, 0.45, 0.35], // Evening
  ],
};

// Waste breakdown data
const wasteBreakdown = [
  { label: "No-shows", value: 45, color: "#f97316" },
  { label: "Late Cancels", value: 25, color: "#ef4444" },
  { label: "Idle Equip", value: 15, color: "#ea580c" },
  { label: "Overstaffing", value: 15, color: "#4b5563" },
];

// Department data
const departmentData = [
  { name: "Dermatology", doctor: "Dr. Sarah Kline", appts: 420, noShowRate: 18.5, estLoss: 12450, trend: "up" },
  { name: "Orthopedics", doctor: "Dr. Michael Chen", appts: 380, noShowRate: 12.3, estLoss: 8920, trend: "down" },
  { name: "Cardiology", doctor: "Dr. Ana Silva", appts: 290, noShowRate: 8.7, estLoss: 5680, trend: "stable" },
];

// Recovery actions
const recoveryActions = [
  {
    type: "success",
    title: "Waitlist Filled",
    description: "Auto-filled 3 slots in Dermatology.",
    time: "2m ago",
    recovered: "+$450 Recovered",
  },
  {
    type: "pending",
    title: "SMS Reminders",
    description: "Sent 142 confirmations for tomorrow.",
    time: "1h ago",
  },
];

// KPI Card com barra de progresso
interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  status?: "high" | "good" | "warning" | "neutral";
  progressColor?: string;
  progressValue?: number;
  icon?: React.ReactNode;
}

function KPICard({ title, value, change, subtitle, status, progressColor, progressValue, icon }: KPICardProps) {
  const getStatusBadge = () => {
    if (!status) return null;
    const styles = {
      high: "bg-red-500/20 text-red-400 border border-red-500/30",
      good: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      warning: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
      neutral: "hidden",
    };
    const labels = {
      high: "High Impact",
      good: "Good",
      warning: "Warning",
      neutral: "",
    };
    return (
      <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5 border border-[#2a2a2a]">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs sm:text-sm font-medium">{title}</span>
          {change !== undefined && (
            <span className={cn(
              "flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold",
              change >= 0 ? "text-red-400" : "text-emerald-400"
            )}>
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change >= 0 ? "+" : ""}{change}%
            </span>
          )}
        </div>
        {getStatusBadge()}
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      
      <div className={cn(
        "text-2xl sm:text-3xl font-bold mb-1",
        status === "high" ? "text-red-500" : 
        status === "good" ? "text-emerald-400" : "text-white"
      )}>
        {value}
      </div>
      
      {subtitle && (
        <p className="text-gray-500 text-[10px] sm:text-xs mb-2">{subtitle}</p>
      )}
      
      {progressValue !== undefined && progressColor && (
        <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mt-2">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${progressValue}%`, 
              backgroundColor: progressColor 
            }}
          />
        </div>
      )}
    </div>
  );
}

// Heatmap Cell
function HeatmapCell({ value }: { value: number }) {
  // Cores baseadas na intensidade - laranja/marrom como na referência
  const getBgColor = () => {
    if (value >= 0.8) return "bg-orange-500";
    if (value >= 0.6) return "bg-orange-600/80";
    if (value >= 0.4) return "bg-amber-700/60";
    return "bg-amber-800/40";
  };
  
  return (
    <div 
      className={cn(
        "h-10 sm:h-12 rounded-lg transition-all hover:scale-105 cursor-pointer",
        getBgColor()
      )}
    />
  );
}

// Donut Chart SVG
function DonutChart({ data, total }: { data: typeof wasteBreakdown; total: string }) {
  const size = 180;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercentage = 0;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = item.value / 100;
          const strokeDasharray = circumference * percentage;
          const strokeDashoffset = -circumference * cumulativePercentage;
          cumulativePercentage += percentage;
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeDasharray} ${circumference - strokeDasharray}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-gray-500 text-xs">Total Waste</span>
        <span className="text-2xl sm:text-3xl font-bold text-white">{total}</span>
      </div>
    </div>
  );
}

export default function OperationalWaste() {
  return (
    <ClientDashboardLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              No-show & Operational Waste
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-500 text-xs sm:text-sm font-medium">Live Data</span>
              <span className="text-gray-500 text-xs sm:text-sm">• Last updated 12 mins ago</span>
            </div>
          </div>
        </div>

        {/* KPI Cards - 4 colunas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KPICard
            title="No-show Rate %"
            value="12.5%"
            change={1.2}
            subtitle="vs 11.3% prev. period"
            progressColor="#f97316"
            progressValue={65}
          />
          <KPICard
            title="Financial Loss (Est.)"
            value="$42,500"
            subtitle="~ $1,416 daily avg."
            status="high"
            progressColor="#ef4444"
            progressValue={85}
          />
          <KPICard
            title="Idle Capacity"
            value="145 Hrs"
            subtitle="Across 3 departments"
            icon={<Clock className="w-5 h-5" />}
            progressColor="#6b7280"
            progressValue={45}
          />
          <KPICard
            title="Efficiency Score"
            value="84/100"
            subtitle="Top 15% of peers"
            status="good"
            progressColor="#10b981"
            progressValue={84}
          />
        </div>

        {/* Main Grid - Heatmap + Waste Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Heatmap - 2 colunas */}
          <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-[#2a2a2a]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg">No-show Frequency</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Heatmap by Day & Time</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-800/40" />
                  <span className="text-gray-400">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500" />
                  <span className="text-gray-400">High</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr>
                    <th className="w-24 sm:w-32"></th>
                    {heatmapData.days.map((day) => (
                      <th key={day} className="text-center text-gray-400 text-xs sm:text-sm font-medium pb-3 px-1.5">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.times.map((time, rowIndex) => (
                    <tr key={time.label}>
                      <td className="py-1.5 pr-3">
                        <div className="text-white text-xs sm:text-sm font-medium">{time.label}</div>
                        <div className="text-gray-600 text-[10px] sm:text-xs">{time.sublabel}</div>
                      </td>
                      {heatmapData.values[rowIndex].map((value, colIndex) => (
                        <td key={colIndex} className="p-1">
                          <HeatmapCell value={value} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Waste Breakdown - 1 coluna */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-[#2a2a2a]">
            <div className="mb-4">
              <h3 className="text-white font-semibold text-base sm:text-lg">Waste Breakdown</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Monetary Value Distribution</p>
            </div>
            
            <div className="flex justify-center mb-5">
              <DonutChart data={wasteBreakdown} total="$58.2k" />
            </div>
            
            <div className="space-y-2.5">
              {wasteBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300 text-xs sm:text-sm">{item.label}</span>
                  </div>
                  <span className="text-white font-semibold text-xs sm:text-sm">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Impact + Recovery Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Department Impact - 2 colunas */}
          <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg">Department Impact</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Ranked by revenue loss</p>
              </div>
              <button className="text-orange-500 hover:text-orange-400 text-xs sm:text-sm font-medium transition-colors">
                View Full Report
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="text-center text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                      Appts
                    </th>
                    <th className="text-center text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                      No-Show Rate
                    </th>
                    <th className="text-center text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                      Est. Loss
                    </th>
                    <th className="text-center text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr key={index} className="border-b border-[#2a2a2a]/50 last:border-0">
                      <td className="py-3 sm:py-4">
                        <div className="text-white text-xs sm:text-sm font-medium">{dept.name}</div>
                        <div className="text-gray-500 text-[10px] sm:text-xs">{dept.doctor}</div>
                      </td>
                      <td className="text-center text-gray-300 text-xs sm:text-sm">{dept.appts}</td>
                      <td className="text-center">
                        <span className={cn(
                          "text-xs sm:text-sm font-semibold",
                          dept.noShowRate > 15 ? "text-red-500" : 
                          dept.noShowRate > 10 ? "text-orange-500" : "text-emerald-500"
                        )}>
                          {dept.noShowRate}%
                        </span>
                      </td>
                      <td className="text-center text-gray-300 text-xs sm:text-sm">
                        ${dept.estLoss.toLocaleString()}
                      </td>
                      <td className="text-center">
                        {dept.trend === "up" && <TrendingUp className="w-4 h-4 text-red-500 mx-auto" />}
                        {dept.trend === "down" && <TrendingDown className="w-4 h-4 text-emerald-500 mx-auto" />}
                        {dept.trend === "stable" && <span className="text-gray-500">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recovery Actions - 1 coluna */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg">Recovery Actions</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Automated interventions</p>
              </div>
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Bot className="w-4 h-4 text-orange-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              {recoveryActions.map((action, index) => (
                <div 
                  key={index} 
                  className="bg-[#242424] rounded-lg p-3 sm:p-4 border border-[#2a2a2a]"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      action.type === "success" ? "bg-emerald-500/20" : "bg-gray-500/20"
                    )}>
                      {action.type === "success" ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white text-xs sm:text-sm font-medium">{action.title}</span>
                        <span className="text-gray-500 text-[10px] sm:text-xs flex-shrink-0">{action.time}</span>
                      </div>
                      <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">{action.description}</p>
                      {action.recovered && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-medium rounded">
                          {action.recovered}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
