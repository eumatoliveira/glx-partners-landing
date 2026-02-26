import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from '../Card';
import { darkChartOptions } from '../../utils/chartOptions';

export function MarketingOpsModule() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      {/* Marketing */}
      <Card title="Leads / Semana" value="234" badge={{text: 'P2 Queda', color: 'yellow'}}>
        <ReactApexChart options={{...darkChartOptions, chart:{type: 'bar', toolbar: {show:false}}, xaxis:{categories:['S1','S2','S3','S4']}}} series={[{name:'Leads', data: [250, 260, 280, 234]}]} type="bar" height={150} />
      </Card>
      <Card title="Custo por Lead (CPL)" value="R$ 42,00" trend={{value: 8.5, isUp: false}} subtitle="Meta < R$ 50">
         <ReactApexChart options={{...darkChartOptions, chart:{sparkline:{enabled:true}}, colors:['#ff5a1f']}} series={[{data: [35, 38, 40, 42, 45, 42]}]} type="line" height={150} />
      </Card>
      
      {/* Ops */}
      <Card title="NPS Geral" value="8.4" trend={{value: 0.2, isUp: true}}>
        <ReactApexChart options={{...darkChartOptions, chart:{type: 'radialBar'}, plotOptions:{radialBar:{hollow:{size:'60%'}, dataLabels:{name:{show:false}, value:{color:'#fff', fontSize:'24px', show:true}}}}}} series={[84]} type="radialBar" height={200} />
      </Card>
      <Card title="Espera Média" value="18 min" badge={{text: 'P2', color: 'yellow'}} subtitle="Meta: < 15 min">
        <ReactApexChart options={{...darkChartOptions, chart:{sparkline:{enabled:true}}, colors:['#ef4444']}} series={[{data: [12, 14, 15, 14, 16, 22, 18]}]} type="line" height={100} />
      </Card>
      <Card title="SLA Resposta (h)" value="1.5h" badge={{text: 'Bom', color: 'green'}} subtitle="Meta: < 1h">
         <ReactApexChart options={{...darkChartOptions, chart:{sparkline:{enabled:true}}, colors:['#22c55e']}} series={[{data: [4, 3, 2, 1.5, 1.2, 1.5]}]} type="bar" height={100} />
      </Card>
      <Card title="Taxa Retorno (90d)" value="38%" trend={{value: 3, isUp: true}} subtitle="Meta: > 35%">
         <ReactApexChart options={{...darkChartOptions, chart:{sparkline:{enabled:true}}, colors:['#45a29e']}} series={[{data: [20, 25, 30, 35, 38]}]} type="area" height={100} />
      </Card>
    </div>
  );
}
