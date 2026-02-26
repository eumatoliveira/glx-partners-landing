import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from '../Card';
import { darkChartOptions } from '../../utils/chartOptions';

export function FinanceModule() {
  const revenueData = [
    { name: 'Receita Líquida', type: 'column', data: [85, 92, 105, 110, 108, 125, 140] },
    { name: 'Meta Faturamento', type: 'line', data: [100, 100, 100, 120, 120, 130, 150] }
  ];

  const revenueOpts: any = {
    ...darkChartOptions,
    chart: { type: 'line' },
    stroke: { width: [0, 3], curve: 'smooth' },
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    fill: { type: 'solid', opacity: [1, 1] },
    colors: ['#45a29e', '#c5c6c7'],
    yaxis: { title: { text: 'Milhares (R$)' } }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-6 animate-fade-in">
      <Card className="lg:row-span-2" title="Faturamento D20 & Receita" value="R$ 140.000" badge={{ text: 'Saudável', color: 'green' }} subtitle="Alerta: se < 80% da meta no dia 20">
        <ReactApexChart options={revenueOpts} series={revenueData} type="line" height={350} />
      </Card>
      <Card title="Posição de Caixa Projetada (15 dias)" value="R$ 45.200" subtitle="Sempre manter positivo">
        <ReactApexChart options={{...darkChartOptions, chart: { sparkline: { enabled: true }}, colors: ['#ff5a1f']}} series={[{data: [30, 40, 35, 50, 49, 60, 70, 91, 125]}]} type="area" height={100} />
      </Card>
      <Card title="Ticket Médio" value="R$ 850" trend={{ value: 12, isUp: true }}>
        <ReactApexChart options={{...darkChartOptions, chart: { sparkline: { enabled: true }}, colors: ['#45a29e']}} series={[{data: [800, 810, 805, 820, 830, 840, 850]}]} type="area" height={100} />
      </Card>
    </div>
  );
}
