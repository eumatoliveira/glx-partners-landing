import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  ArrowRight,
  Lightbulb,
  ExternalLink,
  BarChart3,
  Activity,
} from "lucide-react";

// KPI Card component
interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  highlight?: boolean;
}

function KPICard({ title, value, change, changeLabel, subtitle, highlight }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <Card className={cn(
      "border-[#2a2a2a]",
      highlight ? "bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30" : "bg-[#1E1E1E]"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{title}</p>
              {change !== undefined && (
                <span className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded flex items-center gap-1",
                  isPositive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                )}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPositive ? "+" : ""}{change}%
                </span>
              )}
            </div>
            <p className={cn(
              "text-3xl font-bold",
              highlight ? "text-orange-500" : "text-white"
            )}>
              {value}
            </p>
            {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Funnel Stage component
interface FunnelStageProps {
  stage: number;
  title: string;
  value: number;
  change?: number;
  target?: number;
  conversion?: number;
  revenue?: string;
  isLast?: boolean;
  alert?: string;
}

function FunnelStage({ stage, title, value, change, target, conversion, revenue, isLast, alert }: FunnelStageProps) {
  const widthPercent = isLast ? 60 : 100 - (stage - 1) * 12;
  
  return (
    <div className="relative">
      {/* Conversion rate connector */}
      {conversion && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 bg-[#2a2a2a] px-2 py-0.5 rounded">
          {conversion}% Conversion
        </div>
      )}
      
      <div 
        className={cn(
          "relative rounded-lg p-4 transition-all",
          isLast 
            ? "bg-gradient-to-r from-orange-500 to-orange-600" 
            : "bg-[#2a2a2a] border border-[#3a3a3a]"
        )}
        style={{ width: `${widthPercent}%`, marginLeft: `${(100 - widthPercent) / 2}%` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className={cn(
              "text-xs font-medium uppercase tracking-wide",
              isLast ? "text-orange-200" : "text-gray-400"
            )}>
              Stage {stage}
            </span>
            <h3 className={cn(
              "text-lg font-semibold mt-1",
              isLast ? "text-white" : "text-white"
            )}>
              {title}
            </h3>
          </div>
          <div className="text-right">
            <p className={cn(
              "text-2xl font-bold",
              isLast ? "text-white" : "text-white"
            )}>
              {value.toLocaleString()}
            </p>
            {change !== undefined && (
              <span className={cn(
                "text-xs font-medium",
                change >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {change >= 0 ? "+" : ""}{change}% MoM
              </span>
            )}
            {target && (
              <span className="text-xs text-gray-400 block">
                Target: {target.toLocaleString()}
              </span>
            )}
            {revenue && (
              <span className="text-xs text-orange-200 block">
                Revenue: {revenue}
              </span>
            )}
            {alert && (
              <span className="text-xs text-red-400 flex items-center gap-1 justify-end mt-1">
                {alert} <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Channel row component
interface ChannelRowProps {
  icon: string;
  name: string;
  subtitle: string;
  spend: string;
  leads: number;
  cpl: string;
  convRate: string;
  trend?: "up" | "down";
}

function ChannelRow({ icon, name, subtitle, spend, leads, cpl, convRate, trend }: ChannelRowProps) {
  const iconColors: Record<string, string> = {
    G: "bg-blue-500",
    M: "bg-gradient-to-br from-purple-500 to-pink-500",
    T: "bg-black",
    R: "bg-orange-500",
  };
  
  return (
    <tr className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors">
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold",
            iconColors[icon] || "bg-gray-500"
          )}>
            {icon}
          </div>
          <div>
            <div className="text-white font-medium">{name}</div>
            <div className="text-gray-500 text-xs">{subtitle}</div>
          </div>
        </div>
      </td>
      <td className="text-center text-gray-300">{spend}</td>
      <td className="text-center text-white font-medium">{leads}</td>
      <td className="text-center text-gray-300">{cpl}</td>
      <td className="text-center">
        <span className={cn(
          "font-medium",
          parseFloat(convRate) > 10 ? "text-green-500" : parseFloat(convRate) > 5 ? "text-orange-500" : "text-red-500"
        )}>
          {convRate}
        </span>
      </td>
      <td className="text-center">
        {trend === "up" ? (
          <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />
        ) : trend === "down" ? (
          <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </td>
    </tr>
  );
}

// ROI Chart component
function ROIChart() {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const actual = [320, 380, 350, 420, 450, null];
  const projected = [null, null, null, null, 450, 480];
  
  const maxValue = 500;
  
  return (
    <div className="h-48 flex flex-col">
      <div className="flex-1 flex items-end gap-1 pb-2">
        {months.map((month, index) => {
          const actualValue = actual[index];
          const projectedValue = projected[index];
          
          return (
            <div key={month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full h-32 flex items-end justify-center relative">
                {actualValue && (
                  <div 
                    className="w-2 bg-orange-500 rounded-t absolute bottom-0"
                    style={{ height: `${(actualValue / maxValue) * 100}%` }}
                  />
                )}
                {projectedValue && (
                  <div 
                    className="w-2 bg-gray-500 rounded-t absolute bottom-0 opacity-50"
                    style={{ height: `${(projectedValue / maxValue) * 100}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* X-axis labels */}
      <div className="flex gap-1">
        {months.map((month) => (
          <div key={month} className="flex-1 text-center text-xs text-gray-500">
            {month}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-gray-400">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-500" />
          <span className="text-gray-400">Projected</span>
        </div>
      </div>
    </div>
  );
}

export default function GrowthEngine() {
  const funnelData = [
    { stage: 1, title: "Leads Generated", value: 1240, change: 8 },
    { stage: 2, title: "Qualified Leads", value: 850, target: 800, conversion: 68 },
    { stage: 3, title: "Scheduled Consults", value: 420, conversion: 49, alert: "High Drop-off" },
    { stage: 4, title: "Converted (Sales)", value: 180, revenue: "$225k", conversion: 42, isLast: true },
  ];

  const channelData = [
    { icon: "G", name: "Google Ads", subtitle: "Search Network", spend: "$18,450", leads: 420, cpl: "$43.92", convRate: "12.4%", trend: "up" as const },
    { icon: "M", name: "Meta Ads", subtitle: "Facebook/Instagram", spend: "$12,200", leads: 580, cpl: "$21.03", convRate: "4.8%", trend: "down" as const },
    { icon: "T", name: "TikTok Ads", subtitle: "Video Campaigns", spend: "$8,500", leads: 320, cpl: "$26.56", convRate: "6.2%", trend: "up" as const },
    { icon: "R", name: "Referrals", subtitle: "Partner Network", spend: "$2,100", leads: 180, cpl: "$11.67", convRate: "18.5%", trend: "up" as const },
  ];

  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Growth & Marketing ROI</h1>
            <p className="text-gray-400 mt-1">Detailed analysis of commercial funnel performance.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-500 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Campaigns Active
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Marketing Spend"
            value="$48,250"
            change={12}
            subtitle="Budget usage at 92%"
          />
          <KPICard
            title="Cost Per Lead (CPL)"
            value="$38.90"
            change={-5.2}
            subtitle="Optimized Ad targeting"
          />
          <KPICard
            title="Acquisition Cost (CAC)"
            value="$268.00"
            changeLabel="0.8%"
            subtitle="Stable over last quarter"
          />
          <KPICard
            title="Marketing ROI"
            value="428%"
            change={15}
            subtitle="Highest in 6 months"
            highlight
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Commercial Funnel */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1E1E1E] border-[#2a2a2a] h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">Commercial Funnel Flow</CardTitle>
                <Button variant="ghost" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 text-sm">
                  View Source Data
                </Button>
              </CardHeader>
              <CardContent className="space-y-8 pt-4">
                {funnelData.map((item, index) => (
                  <FunnelStage key={index} {...item} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ROI Forecast & Insights */}
          <div className="space-y-6">
            {/* ROI Forecast */}
            <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">ROI Forecast vs Actual</CardTitle>
                <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-1 rounded">6 Months</span>
              </CardHeader>
              <CardContent>
                <ROIChart />
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-white text-lg">INSIGHTS</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Best Performing Channel</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white font-semibold text-lg">Referrals</span>
                    <span className="text-green-500 text-sm font-medium bg-green-500/20 px-2 py-0.5 rounded">12.8x ROI</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Conversion rate 3x higher than paid ads.</p>
                </div>
                
                <div className="border-t border-orange-500/20 pt-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Channel to Optimize</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white font-semibold text-lg">Meta Ads</span>
                    <span className="text-red-500 text-sm font-medium bg-red-500/20 px-2 py-0.5 rounded">Low Conv.</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">CPL is low ($21), but lead quality needs filtering.</p>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2">
                  View Optimization Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Channel Performance Table */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg">CHANNEL PERFORMANCE</CardTitle>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <BarChart3 className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Channel</th>
                    <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Spend</th>
                    <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Leads</th>
                    <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">CPL</th>
                    <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Conv. Rate</th>
                    <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData.map((channel, index) => (
                    <ChannelRow key={index} {...channel} />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardLayout>
  );
}
