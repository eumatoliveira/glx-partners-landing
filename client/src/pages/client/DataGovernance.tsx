import { useState } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Database,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Server,
  FileCheck,
  Lock,
  Eye,
} from "lucide-react";

// Data Quality Score
function DataQualityScore({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (val: number) => {
    if (val >= 90) return "#22c55e";
    if (val >= 70) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}%</span>
          <span className="text-xs text-gray-400">Data Quality</span>
        </div>
      </div>
    </div>
  );
}

// Quality Dimensions
function QualityDimensions() {
  const dimensions = [
    { name: "Completude", score: 94, description: "Campos preenchidos" },
    { name: "Precisão", score: 88, description: "Dados corretos" },
    { name: "Consistência", score: 92, description: "Sem duplicatas" },
    { name: "Atualidade", score: 85, description: "Dados atualizados" },
    { name: "Validade", score: 96, description: "Formato correto" },
  ];

  return (
    <div className="space-y-4">
      {dimensions.map((dim) => (
        <div key={dim.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-medium">{dim.name}</span>
              <span className="text-gray-500 text-xs ml-2">({dim.description})</span>
            </div>
            <span className={cn(
              "font-bold",
              dim.score >= 90 ? "text-green-500" : dim.score >= 80 ? "text-orange-500" : "text-red-500"
            )}>
              {dim.score}%
            </span>
          </div>
          <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                dim.score >= 90 ? "bg-green-500" : dim.score >= 80 ? "bg-orange-500" : "bg-red-500"
              )}
              style={{ width: `${dim.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Integration Status
function IntegrationStatus() {
  const integrations = [
    { name: "ERP Principal", status: "connected", lastSync: "2 min atrás", records: "12,450" },
    { name: "CRM", status: "connected", lastSync: "5 min atrás", records: "8,230" },
    { name: "Sistema Financeiro", status: "warning", lastSync: "45 min atrás", records: "3,120" },
    { name: "Agenda Online", status: "connected", lastSync: "1 min atrás", records: "5,680" },
    { name: "Marketing Automation", status: "error", lastSync: "2h atrás", records: "2,450" },
  ];

  const statusConfig = {
    connected: { color: "text-green-500", bg: "bg-green-500", icon: CheckCircle },
    warning: { color: "text-orange-500", bg: "bg-orange-500", icon: AlertTriangle },
    error: { color: "text-red-500", bg: "bg-red-500", icon: AlertTriangle },
  };

  return (
    <div className="space-y-3">
      {integrations.map((int) => {
        const config = statusConfig[int.status as keyof typeof statusConfig];
        const Icon = config.icon;
        
        return (
          <div key={int.name} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", `${config.bg}/10`)}>
                <Server className={cn("w-4 h-4", config.color)} />
              </div>
              <div>
                <div className="text-white font-medium">{int.name}</div>
                <div className="text-gray-500 text-xs">{int.records} registros</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Icon className={cn("w-3 h-3", config.color)} />
                  <span className={cn("text-xs font-medium", config.color)}>
                    {int.status === "connected" ? "Conectado" : int.status === "warning" ? "Atrasado" : "Erro"}
                  </span>
                </div>
                <div className="text-gray-500 text-xs">{int.lastSync}</div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Data Issues Table
function DataIssues() {
  const issues = [
    { table: "Pacientes", field: "CPF", issue: "Duplicados", count: 23, severity: "high" },
    { table: "Agendamentos", field: "Data", issue: "Formato inválido", count: 12, severity: "medium" },
    { table: "Financeiro", field: "Valor", issue: "Nulos", count: 45, severity: "high" },
    { table: "Prontuários", field: "CID", issue: "Não preenchido", count: 8, severity: "low" },
  ];

  const severityConfig = {
    high: { color: "text-red-500", bg: "bg-red-500/10" },
    medium: { color: "text-orange-500", bg: "bg-orange-500/10" },
    low: { color: "text-yellow-500", bg: "bg-yellow-500/10" },
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a2a]">
            <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Tabela</th>
            <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Campo</th>
            <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Problema</th>
            <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Qtd</th>
            <th className="text-center text-gray-400 text-xs font-medium uppercase tracking-wide py-3">Severidade</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, index) => {
            const config = severityConfig[issue.severity as keyof typeof severityConfig];
            return (
              <tr key={index} className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50">
                <td className="py-3 text-white">{issue.table}</td>
                <td className="py-3 text-gray-300">{issue.field}</td>
                <td className="py-3 text-gray-300">{issue.issue}</td>
                <td className="py-3 text-center text-white font-medium">{issue.count}</td>
                <td className="py-3 text-center">
                  <span className={cn("px-2 py-1 rounded text-xs font-medium", config.bg, config.color)}>
                    {issue.severity === "high" ? "Alta" : issue.severity === "medium" ? "Média" : "Baixa"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function DataGovernance() {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Data Governance</h1>
            <p className="text-gray-400 mt-1">Qualidade de Dados, Integrações e Conformidade</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Database className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Registros Totais</p>
                  <p className="text-2xl font-bold text-white">31.9K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-500/10">
                  <FileCheck className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data Quality Score</p>
                  <p className="text-2xl font-bold text-orange-500">91%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">LGPD Compliance</p>
                  <p className="text-2xl font-bold text-green-500">98%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Issues Pendentes</p>
                  <p className="text-2xl font-bold text-red-500">88</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Quality Score */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Data Quality Score</CardTitle>
              <p className="text-gray-400 text-sm">Índice geral de qualidade</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <DataQualityScore score={91} />
              <div className="mt-4 text-center">
                <p className="text-green-500 font-medium">Bom</p>
                <p className="text-gray-500 text-xs">Meta: 95%</p>
              </div>
            </CardContent>
          </Card>

          {/* Quality Dimensions */}
          <Card className="bg-[#1E1E1E] border-[#2a2a2a] lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Dimensões de Qualidade</CardTitle>
              <p className="text-gray-400 text-sm">Breakdown por critério</p>
            </CardHeader>
            <CardContent>
              <QualityDimensions />
            </CardContent>
          </Card>
        </div>

        {/* Integration Status */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white text-lg">Status das Integrações</CardTitle>
              <p className="text-gray-400 text-sm">Conexões com sistemas externos</p>
            </div>
            <Button variant="ghost" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
              Sincronizar Todos
            </Button>
          </CardHeader>
          <CardContent>
            <IntegrationStatus />
          </CardContent>
        </Card>

        {/* Data Issues */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white text-lg">Problemas de Dados</CardTitle>
              <p className="text-gray-400 text-sm">Issues identificados para correção</p>
            </div>
            <Button variant="ghost" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
              Exportar Relatório
            </Button>
          </CardHeader>
          <CardContent>
            <DataIssues />
          </CardContent>
        </Card>

        {/* Security & Compliance */}
        <Card className="bg-[#1E1E1E] border-[#2a2a2a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Segurança & Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#2a2a2a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">Criptografia</span>
                </div>
                <p className="text-2xl font-bold text-green-500">100%</p>
                <p className="text-gray-500 text-xs mt-1">Dados sensíveis criptografados</p>
              </div>
              <div className="p-4 bg-[#2a2a2a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-5 h-5 text-orange-500" />
                  <span className="text-white font-medium">Audit Trail</span>
                </div>
                <p className="text-2xl font-bold text-white">2,450</p>
                <p className="text-gray-500 text-xs mt-1">Eventos registrados (30d)</p>
              </div>
              <div className="p-4 bg-[#2a2a2a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">Backup</span>
                </div>
                <p className="text-2xl font-bold text-green-500">OK</p>
                <p className="text-gray-500 text-xs mt-1">Último: há 4 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardLayout>
  );
}
