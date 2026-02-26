import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from '../Card';
import { darkChartOptions } from '../../utils/chartOptions';

export function FinanceAdvancedModule() {
  const waterfallData = [{
    name: 'Receita',
    data: [
      { x: 'Receita Bruta', y: 150000 },
      { x: 'CMV', y: -25000 },
      { x: 'Variáveis', y: -15000 },
      { x: 'Fixos', y: -45000 },
      { x: 'EBITDA', y: 65000 },
    ]
  }];

  const waterfallOpts: any = {
    ...darkChartOptions,
    chart: { type: 'bar' },
    plotOptions: {
      bar: { 
        colors: { 
          ranges: [
            { from: -1000000, to: -1, color: '#ef4444' },
            { from: 0, to: 1000000, color: '#22c55e' }
          ]
        }
      }
    },
    xaxis: { type: 'category' },
    dataLabels: { enabled: true, formatter: (val: number) => `R$ ${val/1000}k` }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <Card className="lg:col-span-2" title="DRE Semanal — EBITDA Operacional" subtitle="Margem: 43.3% (> 20% Meta)">
        <ReactApexChart options={waterfallOpts} series={waterfallData} type="bar" height={300} />
      </Card>
      
      <Card title="Forecast de Receita (IA)" badge={{text: 'P50 Confidence', color: 'green'}} glowOnHover={false}>
        <ReactApexChart options={{...darkChartOptions, chart:{type:'area'}, stroke:{curve:'straight', dashArray:[0, 4]}}} series={[{name:'Confirmado', data:[10,20,30,40,null]}, {name:'Forecast ML', data:[null,null,null,40, 55]}]} type="area" height={200} />
      </Card>
      <Card title="Margem por Serviços (Top 3)" glowOnHover={false}>
          <ReactApexChart options={{...darkChartOptions, chart:{type:'bar'}, plotOptions:{bar:{horizontal:true}}, xaxis:{categories:['Botox', 'Preenchimento', 'Laser']}}} series={[{name:'Margem (%)', data:[45, 38, 30]}]} type="bar" height={200} />
      </Card>
      
      <Card title="Break-Even Cobertura" value="85%" badge={{text:'Dia 15', color:'green'}} subtitle="Meta > 90%">
        <ReactApexChart options={{...darkChartOptions, chart:{type:'radialBar'}, plotOptions:{radialBar:{hollow:{size:'70%'}}}}} series={[85]} type="radialBar" height={200} />
      </Card>
      <Card title="Recebíveis - Aging" badge={{text:'Atenção > 90d', color:'yellow'}} subtitle="Evolução da dívida">
         <ReactApexChart options={{...darkChartOptions, chart:{type:'bar', stacked:true}, xaxis:{categories:['Jan','Fev','Mar']}}} series={[{name:'< 30d', data:[10,12,14]}, {name:'30-60d', data:[5,4,6]}, {name:'> 90d', data:[1,2,5]}]} type="bar" height={200} />
      </Card>
    </div>
  );
}
