import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  ArrowRight,
  MessageSquare,
  Calendar,
  Users,
  Zap,
} from "lucide-react";
import { MotionPageShell } from "@/animation/components/MotionPageShell";

// Heatmap data
const heatmapData = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  times: [
    { label: "Morning", sublabel: "8am-12pm" },
    { label: "Afternoon", sublabel: "1pm-5pm" },
    { label: "Evening", sublabel: "5pm-8pm" },
  ],
  values: [
    [0.8, 0.4, 0.3, 0.5, 0.7],
    [0.3, 0.5, 0.6, 0.4, 0.8],
    [0.5, 0.3, 0.7, 0.4, 0.3],
  ],
};

// Waste breakdown data
const wasteBreakdown = [
  { label: "No-shows", value: 45, color: "#f97316" },
  { label: "Late Cancels", value: 25, color: "#ef4444" },
  { label: "Idle Equip", value: 15, color: "#eab308" },
  { label: "Overstaffing", value: 15, color: "#6b7280" },
];

// Department data
const departmentData = [
  { name: "Dermatology", doctor: "Dr. Sarah Kline", appts: 420, noShowRate: 18.5, estLoss: 12450, trend: "up" },
  { name: "Orthopedics", doctor: "Dr. Michael Chen", appts: 380, noShowRate: 12.3, estLoss: 8920, trend: "down" },
  { name: "Cardiology", doctor: "Dr. Ana Silva", appts: 290, noShowRate: 8.7, estLoss: 5680, trend: "stable" },
  { name: "Pediatrics", doctor: "Dr. João Santos", appts: 520, noShowRate: 15.2, estLoss: 9840, trend: "up" },
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
  {
    type: "pending",
    title: "Overbooking Applied",
    description: "Added 2 buffer slots in Orthopedics.",
    time: "3h ago",
  },
];

// Heatmap cell component
function HeatmapCell({ value }: { value: number }) {
  const intensity = Math.round(value * 100);
  const bgColor = value > 0.6 
    ? "bg-orange-500" 
    : value > 0.4 
      ? "bg-orange-500/60" 
      : "bg-orange-500/30";
  
  return (
    <div 
      className={cn(
        "h-12 rounded-lg flex items-center justify-center transition-all hover:scale-105 cursor-pointer",
        bgColor
      )}
      title={`${intensity}% no-show rate`}
    >
      <span className="text-xs font-medium text-white/80">{intensity}%</span>
    </div>
  );
}

// Donut chart component
function DonutChart({ data, total }: { data: typeof wasteBreakdown; total: string }) {
  const radius = 80;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {data.map((item, index) => {
          const percentage = item.value / 100;
          const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
          const strokeDashoffset = -currentOffset;
          currentOffset += circumference * percentage;
          
          return (
            <circle
              key={index}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all hover:opacity-80"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-gray-400 text-xs">Total Waste</span>
        <span className="text-3xl font-bold text-white">{total}</span>
      </div>
    </div>
  );
}

// KPI Card component
interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: "high" | "good" | "warning";
}

function KPICard({ title, value, change, changeLabel, subtitle, icon, status }: KPICardProps) {
  const statusColors = {
    high: "text-red-500 bg-red-500/10",
    good: "text-green-500 bg-green-500/10",
    warning: "text-orange-500 bg-orange-500/10",
  };
  
  return (
    <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-xs sm:text-sm">{title}</p>
              {change !== undefined && (
                <span className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  change >= 0 ? "text-red-500" : "text-green-500"
                )}>
                  {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {change >= 0 ? "+" : ""}{change}%
                </span>
              )}
            </div>
            <p className={cn(
              "text-2xl sm:text-3xl font-bold",
              status === "high" ? "text-red-500" : status === "good" ? "text-green-500" : "text-white"
            )}>
              {value}
            </p>
            {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
          </div>
          {status && (
            <span className={cn(
              "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium hidden sm:block",
              statusColors[status]
            )}>
              {status === "high" ? "High Impact" : status === "good" ? "Good" : "Warning"}
            </span>
          )}
          {icon && (
            <div className="p-2 rounded-lg bg-[#2a2a2a]">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function OperationalWaste() {
  return (
    <ClientDashboardLayout>
      <MotionPageShell className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">No-show & Operational Waste</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-500 font-medium">Live Data</span>
              </div>
              <span className="text-gray-500 text-sm">• Last updated 12 mins ago</span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="No-show Rate %"
            value="12.5%"
            change={1.2}
            subtitle="vs 11.3% prev. period"
          />
          <KPICard
            title="Financial Loss (Est.)"
            value="$42,500"
            subtitle="~ $1,416 daily avg."
            status="high"
          />
          <KPICard
            title="Idle Capacity"
            value="145 Hrs"
            subtitle="Across 3 departments"
            icon={<Clock className="w-5 h-5 text-gray-400" />}
          />
          <KPICard
            title="Efficiency Score"
            value="84/100"
            subtitle="Top 15% of peers"
            status="good"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heatmap */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1E1E1E] border-[#2a2a2a] h-full">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
                <div>
                  <CardTitle className="text-white text-base sm:text-lg">No-show Frequency</CardTitle>
                  <p className="text-gray-400 text-xs sm:text-sm">Heatmap by Day & Time</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-orange-500/30" />
                    <span className="text-gray-400">Low</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-orange-500" />
                    <span className="text-gray-400">High</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="w-20 sm:w-28"></th>
                        {heatmapData.days.map((day) => (
                          <th key={day} className="text-center text-gray-400 text-xs sm:text-sm font-medium pb-2 sm:pb-3 px-1 sm:px-2">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {heatmapData.times.map((time, rowIndex) => (
                        <tr key={time.label}>
                          <td className="py-1 sm:py-2 pr-2 sm:pr-4">
                            <div className="text-white text-xs sm:text-sm font-medium">{time.label}</div>
                            <div className="text-gray-500 text-[10px] sm:text-xs">{time.sublabel}</div>
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
              </CardContent>
            </Card>
          </div>

          {/* Waste Breakdown */}
          <div>
            <Card className="bg-[#1E1E1E] border-[#2a2a2a] h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Waste Breakdown</CardTitle>
                <p className="text-gray-400 text-sm">Monetary Value Distribution</p>
              </CardHeader>
              <CardContent>
                <DonutChart data={wasteBreakdown} total="$58.2k" />
                <div className="mt-6 space-y-3">
                  {wasteBreakdown.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-300 text-sm">{item.label}</span>
                      </div>
                      <span className="text-white font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Department Impact & Recovery Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Impact Table */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-white text-lg">Department Impact</CardTitle>
                  <p className="text-gray-400 text-sm">Ranked by revenue loss</p>
                </div>
                <Button variant="ghost" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
                  View Full Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Department</th>
                        <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Appts</th>
                        <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">No-show Rate</th>
                        <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Est. Loss</th>
                        <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData.map((dept, index) => (
                        <tr key={index} className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
                          <td className="py-4">
                            <div className="text-white font-medium">{dept.name}</div>
                            <div className="text-gray-500 text-xs">{dept.doctor}</div>
                          </td>
                          <td className="text-center text-gray-300">{dept.appts}</td>
                          <td className="text-center">
                            <span className={cn(
                              "font-medium",
                              dept.noShowRate > 15 ? "text-red-500" : dept.noShowRate > 10 ? "text-orange-500" : "text-green-500"
                            )}>
                              {dept.noShowRate}%
                            </span>
                          </td>
                          <td className="text-center text-white font-medium">${dept.estLoss.toLocaleString()}</td>
                          <td className="text-center">
                            {dept.trend === "up" ? (
                              <TrendingUp className="w-4 h-4 text-red-500 mx-auto" />
                            ) : dept.trend === "down" ? (
                              <TrendingDown className="w-4 h-4 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recovery Actions */}
          <div>
            <Card className="bg-[#1E1E1E] border-[#2a2a2a] h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-white text-lg">Recovery Actions</CardTitle>
                  <p className="text-gray-400 text-sm">Automated interventions</p>
                </div>
                <Zap className="w-5 h-5 text-orange-500" />
              </CardHeader>
              <CardContent className="space-y-4">
                {recoveryActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      action.type === "success" ? "bg-green-500/20" : "bg-gray-500/20"
                    )}>
                      {action.type === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{action.title}</span>
                        <span className="text-gray-500 text-xs">{action.time}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">{action.description}</p>
                      {action.recovered && (
                        <span className="inline-block mt-1 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                          {action.recovered}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </MotionPageShell>
    </ClientDashboardLayout>
  );
}


