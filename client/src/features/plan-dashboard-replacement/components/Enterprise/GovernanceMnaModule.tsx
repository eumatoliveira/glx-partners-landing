import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from '../Card';
import { darkChartOptions } from '../../utils/chartOptions';

export function GovernanceMnaModule() {
  const radarData = [{
    name: 'Rede Alfa',
    data: [80, 90, 70, 85, 60]
  }, {
    name: 'Rede Beta',
    data: [60, 75, 80, 70, 90]
  }];

  const radarOpts: any = {
    ...darkChartOptions,
    chart: { type: 'radar' },
    labels: ['Crescimento', 'Margem', 'Ops', 'Risco', 'Captação'],
    stroke: { width: 2 },
    fill: { opacity: 0.2 },
    markers: { size: 4 },
    xaxis: {
      labels: {
        style: { colors: ['#c5c6c7', '#c5c6c7', '#c5c6c7', '#c5c6c7', '#c5c6c7'], fontFamily: 'Inter' }
      }
    }
  };

  const valuationOpts: any = {
    ...darkChartOptions,
    chart: { type: 'radialBar' },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: '65%' },
        dataLabels: {
          name: { offsetY: -10, color: '#8892b0', fontSize: '13px' },
          value: { color: '#fff', fontSize: '30px', fontWeight: 'bold' }
        }
      }
    },
    fill: { type: 'gradient', gradient: { shade: 'dark', type: 'horizontal', colorStops: [ {offset: 0, color: '#ef4444'}, {offset: 100, color: '#22c55e'} ] } }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <Card title="Score da Rede por Dimensão" subtitle="Score: 82. Benchmark interno.">
        <ReactApexChart options={radarOpts} series={radarData} type="radar" height={300} />
      </Card>
      <Card title="Múltiplo EBITDA (Risco Ajustado)" badge={{text: 'Favorável', color: 'green'}}>
         <ReactApexChart options={{...valuationOpts, labels:['Múltiplo Atual']}} series={[85]} type="radialBar" height={300} />
      </Card>
      
      <Card className="col-span-1 md:col-span-2" title="Valuation Progressivo (LTM)" subtitle="Cenário base vs Otimista">
          <ReactApexChart options={{...darkChartOptions, chart:{type:'area'}, stroke:{curve:'smooth'}, colors:['#45a29e', '#8892b0']}} series={[{name:'Otimista', data:[60, 70, 85, 94]}, {name:'Base', data:[60, 65, 75, 80]}]} type="area" height={250} />
      </Card>
    </div>
  );
}
