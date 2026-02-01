import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Moon,
} from "lucide-react";

// KPI Card component - estilo da referência
interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  highlight?: boolean;
  changeType?: "positive" | "negative";
}

function KPICard({ title, value, change, subtitle, highlight, changeType }: KPICardProps) {
  const isPositive = changeType === "positive" || (change !== undefined && change < 0);
  
  return (
    <div className={cn(
      "rounded-xl p-4 sm:p-5 border",
      highlight 
        ? "bg-gradient-to-br from-orange-500/20 to-orange-600/5 border-orange-500/30" 
        : "bg-[#1a1a1a] border-[#2a2a2a]"
    )}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
          {title}
        </span>
        {change !== undefined && (
          <span className={cn(
            "flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded",
            isPositive 
              ? "bg-emerald-500/20 text-emerald-400" 
              : "bg-red-500/20 text-red-400"
          )}>
            {isPositive ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {change > 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
      
      <div className={cn(
        "text-2xl sm:text-3xl font-bold mt-2",
        highlight ? "text-orange-500" : "text-white"
      )}>
        {value}
      </div>
      
      {subtitle && (
        <p className="text-gray-500 text-[10px] sm:text-xs mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// Funnel Stage component - visual idêntico à referência
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
  // Largura progressiva do funil
  const widths = [100, 88, 75, 60];
  const widthPercent = widths[stage - 1] || 100;
  
  return (
    <div className="relative">
      {/* Linha de conversão */}
      {conversion && (
        <div className="flex justify-center mb-1">
          <div className="text-[10px] sm:text-xs text-gray-500 bg-[#242424] px-2 py-0.5 rounded border border-[#2a2a2a]">
            {conversion}% Conversion
          </div>
        </div>
      )}
      
      <div 
        className={cn(
          "relative rounded-lg transition-all mx-auto",
          isLast 
            ? "bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-5" 
            : "bg-[#242424] border border-[#3a3a3a] p-3 sm:p-4"
        )}
        style={{ width: `${widthPercent}%` }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className={cn(
              "text-[10px] sm:text-xs font-semibold uppercase tracking-wider",
              isLast ? "text-orange-200" : "text-gray-500"
            )}>
              Stage {stage}
            </span>
            <h3 className={cn(
              "text-sm sm:text-base lg:text-lg font-bold mt-0.5",
              isLast ? "text-white" : "text-white"
            )}>
              {title}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={cn(
              "text-xl sm:text-2xl lg:text-3xl font-bold",
              isLast ? "text-white" : "text-white"
            )}>
              {value.toLocaleString()}
            </p>
            {change !== undefined && (
              <span className="text-emerald-400 text-xs font-medium">
                +{change}% MoM
              </span>
            )}
            {target && (
              <span className="text-gray-400 text-xs block">
                Target: {target.toLocaleString()}
              </span>
            )}
            {revenue && (
              <span className="text-orange-200 text-xs block">
                Revenue: {revenue}
              </span>
            )}
            {alert && (
              <span className="text-red-400 text-xs flex items-center gap-1 justify-end">
                {alert} <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ROI Chart component - linha com pontos como na referência
function ROIChart() {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const actual = [280, 320, 300, 380, 420, 480];
  const projected = [null, null, null, null, 420, 520];
  
  const maxValue = 550;
  const chartHeight = 120;
  
  // Calcular posições dos pontos
  const getY = (val: number | null) => {
    if (val === null) return null;
    return chartHeight - (val / maxValue) * chartHeight;
  };
  
  return (
    <div className="h-44">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold text-sm">ROI Forecast vs Actual</h4>
        <span className="text-gray-500 text-xs bg-[#242424] px-2 py-1 rounded">6 Months</span>
      </div>
      
      <div className="relative h-28">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-[#2a2a2a]/50" />
          ))}
        </div>
        
        {/* SVG Chart */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Linha projetada (pontilhada) */}
          <path
            d={`M ${(4 / 5) * 100}% ${getY(420)}px L ${(5 / 5) * 100}% ${getY(520)}px`}
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          
          {/* Linha atual */}
          <polyline
            points={actual.slice(0, 6).map((val, i) => 
              val !== null ? `${(i / 5) * 100}%,${getY(val)}` : ''
            ).filter(Boolean).join(' ')}
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {/* Pontos */}
        <div className="absolute inset-0 flex justify-between items-end">
          {months.map((month, i) => {
            const actualY = getY(actual[i]);
            const projectedY = projected[i] !== null ? getY(projected[i]) : null;
            
            return (
              <div key={month} className="relative flex-1 h-full">
                {actualY !== null && (
                  <div 
                    className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-[#1a1a1a] left-1/2 -translate-x-1/2"
                    style={{ top: actualY - 5 }}
                  />
                )}
                {projectedY !== null && (
                  <div 
                    className="absolute w-2.5 h-2.5 bg-gray-500 rounded-full border-2 border-[#1a1a1a] left-1/2 -translate-x-1/2"
                    style={{ top: projectedY - 5 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* X-axis */}
      <div className="flex justify-between mt-2">
        {months.map((month) => (
          <span key={month} className="text-gray-500 text-[10px] sm:text-xs flex-1 text-center">
            {month}
          </span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-gray-400 text-xs">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-500" />
          <span className="text-gray-400 text-xs">Projected</span>
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
    G: "bg-blue-600",
    M: "bg-gradient-to-br from-purple-600 to-pink-500",
    T: "bg-black border border-white/20",
    R: "bg-orange-500",
  };
  
  return (
    <tr className="border-b border-[#2a2a2a]/50 hover:bg-[#242424]/50 transition-colors">
      <td className="py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={cn(
            "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0",
            iconColors[icon] || "bg-gray-600"
          )}>
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs sm:text-sm font-medium truncate">{name}</div>
            <div className="text-gray-500 text-[10px] sm:text-xs truncate">{subtitle}</div>
          </div>
        </div>
      </td>
      <td className="text-center text-gray-300 text-xs sm:text-sm">{spend}</td>
      <td className="text-center text-white font-semibold text-xs sm:text-sm">{leads}</td>
      <td className="text-center text-gray-300 text-xs sm:text-sm">{cpl}</td>
      <td className="text-center">
        <span className={cn(
          "font-semibold text-xs sm:text-sm",
          parseFloat(convRate) > 10 ? "text-emerald-500" : 
          parseFloat(convRate) > 5 ? "text-orange-500" : "text-red-500"
        )}>
          {convRate}
        </span>
      </td>
      <td className="text-center">
        {trend === "up" ? (
          <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto" />
        ) : trend === "down" ? (
          <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />
        ) : null}
      </td>
    </tr>
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
  ];

  return (
    <ClientDashboardLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Growth & Marketing ROI
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Detailed analysis of commercial funnel performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Campaigns Active
            </div>
            <button className="p-2 rounded-lg bg-[#242424] text-gray-400 hover:text-white transition-colors">
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Cards - 4 colunas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KPICard
            title="Total Marketing Spend"
            value="$48,250"
            change={12}
            changeType="negative"
            subtitle="Budget usage at 92%"
          />
          <KPICard
            title="Cost Per Lead (CPL)"
            value="$38.90"
            change={-5.2}
            changeType="positive"
            subtitle="Optimized Ad targeting"
          />
          <KPICard
            title="Acquisition Cost (CAC)"
            value="$268.00"
            change={0.8}
            subtitle="Stable over last quarter"
          />
          <KPICard
            title="Marketing ROI"
            value="428%"
            change={15}
            changeType="positive"
            subtitle="Highest in 6 months"
            highlight
          />
        </div>

        {/* Main Grid - Funnel + ROI Chart + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Commercial Funnel - 2 colunas */}
          <div className="lg:col-span-2 bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-base sm:text-lg">Commercial Funnel Flow</h3>
              <button className="text-orange-500 hover:text-orange-400 text-xs sm:text-sm font-medium transition-colors">
                View Source Data
              </button>
            </div>
            
            <div className="space-y-4 sm:space-y-5">
              {funnelData.map((item, index) => (
                <FunnelStage
                  key={index}
                  stage={item.stage}
                  title={item.title}
                  value={item.value}
                  change={item.change}
                  target={item.target}
                  conversion={item.conversion}
                  revenue={item.revenue}
                  isLast={item.isLast}
                  alert={item.alert}
                />
              ))}
            </div>
          </div>

          {/* Right Column - ROI Chart + Insights */}
          <div className="space-y-4 sm:space-y-5">
            {/* ROI Chart */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5 border border-[#2a2a2a]">
              <ROIChart />
            </div>

            {/* Insights Card */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5 border border-[#2a2a2a]">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className="text-white font-semibold text-sm uppercase tracking-wider">Insights</span>
              </div>
              
              <div className="space-y-4">
                {/* Best Channel */}
                <div>
                  <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-1">
                    Best Performing Channel
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm sm:text-base">Referrals</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded">
                      12.8x ROI
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Conversion rate 3x higher than paid ads.
                  </p>
                </div>
                
                {/* Channel to Optimize */}
                <div>
                  <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-1">
                    Channel to Optimize
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm sm:text-base">Meta Ads</span>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded">
                      Low Conv.
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    CPL is low ($21), but lead quality needs filtering.
                  </p>
                </div>
                
                <button className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors">
                  View Optimization Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Performance Table */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-base sm:text-lg uppercase tracking-wide">
              Channel Performance
            </h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="text-center text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                    Spend
                  </th>
                  <th className="text-center text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="text-center text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                    CPL
                  </th>
                  <th className="text-center text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                    Conv. Rate
                  </th>
                  <th className="text-center text-gray-400 text-[10px] sm:text-xs font-medium pb-3 uppercase tracking-wider">
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                {channelData.map((channel, index) => (
                  <ChannelRow key={index} {...channel} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
