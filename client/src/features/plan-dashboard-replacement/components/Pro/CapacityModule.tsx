import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from '../Card';
import { darkChartOptions } from '../../utils/chartOptions';

export function CapacityModule() {
  const heatmapData = [
    { name: 'Dr. Silva', data: [{ x: '08:00', y: 80 }, { x: '09:00', y: 90 }, { x: '10:00', y: 45 }, { x: '11:00', y: 30 }] },
    { name: 'Dra. Ana', data: [{ x: '08:00', y: 95 }, { x: '09:00', y: 85 }, { x: '10:00', y: 60 }, { x: '11:00', y: 55 }] },
    { name: 'Dr. Costa', data: [{ x: '08:00', y: 100 }, { x: '09:00', y: 90 }, { x: '10:00', y: 80 }, { x: '11:00', y: 70 }] },
  ];

  const heatmapOpts: any = {
    ...darkChartOptions,
    chart: { type: 'heatmap', toolbar: { show: false } },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 4,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            { from: 0, to: 40, color: '#ef4444', name: 'Ocioso (<40%)' },
            { from: 41, to: 70, color: '#eab308', name: 'Atenção (41-70%)' },
            { from: 71, to: 100, color: '#22c55e', name: 'Ideal (>70%)' }
          ]
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: 1 }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <Card title="Heatmap Ocupação (Dia × Hora × Profissional)" badge={{text: 'Alerta Ociosidade', color: 'red'}}>
          <ReactApexChart options={heatmapOpts} series={heatmapData} type="heatmap" height={250} />
      </Card>
      <Card title="Simulador Overbooking" value="R$ 15.000 / mês" subtitle="Receita Adicional Estimada">
          <ReactApexChart options={{...darkChartOptions, chart:{type: 'line'}, stroke:{dashArray: [0, 5]}, labels:['0','1','2','3'], colors: ['#ff5a1f', '#8892b0']}} series={[{name:'Receita', data:[10, 15, 20, 22]}, {name:'Espera (min)', data:[10, 12, 18, 25]}]} type="line" height={250} />
      </Card>
      <Card title="Cancelamentos por Motivo">
         <ReactApexChart options={{...darkChartOptions, chart:{type:'bar'}, plotOptions:{bar:{horizontal:true}}, xaxis:{categories:['Financeiro', 'Emergência', 'Preço', 'Agenda']}}} series={[{data:[400, 300, 200, 100]}]} type="bar" height={200} />
      </Card>
      <Card title="Lead Time do Agendamento (dias)" badge={{text: 'P1 > 7d', color: 'yellow'}}>
         <ReactApexChart options={{...darkChartOptions, chart:{sparkline:{enabled:true}}, colors:['#ff5a1f']}} series={[{data:[2, 3, 4, 3, 5, 8]}]} type="area" height={200} />
      </Card>
    </div>
  );
}
