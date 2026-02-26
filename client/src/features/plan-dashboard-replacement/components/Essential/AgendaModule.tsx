import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from '../Card';
import { darkChartOptions } from '../../utils/chartOptions';

export function AgendaModule() {
  const lineChartData = [{ name: 'Taxa (%)', data: [8, 9, 11, 14, 16, 12, 11] }];
  const lineChartOpts: any = {
    ...darkChartOptions,
    chart: { ...darkChartOptions.chart, type: 'area' },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 90, 100] }
    },
    annotations: {
      yAxis: [{
        y: 15,
        borderColor: '#ef4444',
        label: {
          style: { color: '#fff', background: '#ef4444' },
          text: 'Risco (>15%)'
        }
      }, {
        y: 10,
        borderColor: '#22c55e',
        label: {
          style: { color: '#fff', background: '#22c55e' },
          text: 'Meta (<10%)'
        }
      }]
    },
    xaxis: { categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], ...darkChartOptions.xaxis },
  };

  const bulletData = [{
    name: "Ocupação",
    data: [{
      x: "Ocupação Semanal",
      y: 78,
      goals: [{ name: 'Meta', value: 75, strokeWidth: 5, strokeHeight: 15, strokeColor: '#22c55e' }]
    }]
  }];

  const bulletOpts: any = {
    ...darkChartOptions,
    chart: { type: 'bar' },
    plotOptions: {
      bar: { horizontal: true, barHeight: '40%' }
    },
    colors: ['#ff5a1f'],
    dataLabels: { enabled: true, formatter: (val: any) => `${val}%` },
    xaxis: { max: 100, ...darkChartOptions.xaxis }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <Card title="Taxa de No-Show (%)" value="12.5%" trend={{ value: 2.1, isUp: false }} badge={{ text: 'P2', color: 'yellow' }} subtitle="Faltas ÷ Agendamentos. Meta < 10%.">
        <ReactApexChart options={lineChartOpts} series={lineChartData} type="area" height="100%" />
      </Card>
      <Card title="Taxa de Ocupação (%)" value="78%" trend={{ value: 4.5, isUp: true }} badge={{ text: 'P3', color: 'green' }} subtitle="Realizadas ÷ Capacidade. Meta > 75%.">
        <ReactApexChart options={bulletOpts} series={bulletData} type="bar" height="100%" />
      </Card>
      
      {/* Extras for visual completeness if needed */}
      <Card title="Cancelamentos com Aviso" value="65%" trend={{ value: 5, isUp: true }} subtitle="Meta > 60%">
        <ReactApexChart options={{...darkChartOptions, chart:{type:'line', sparkline:{enabled:true}}, colors:['#45a29e']}} series={[{data:[50, 55, 60, 62, 65, 68, 65]}]} type="line" height={100} />
      </Card>
      <Card title="Status das Confirmações" value="82%" subtitle="Meta > 80%">
        <ReactApexChart options={{...darkChartOptions, chart:{type:'bar', sparkline:{enabled:true}}, colors:['#22c55e']}} series={[{data:[70, 75, 80, 85, 82]}]} type="bar" height={100} />
      </Card>
    </div>
  );
}
