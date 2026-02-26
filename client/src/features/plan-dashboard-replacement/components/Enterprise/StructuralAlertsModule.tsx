import React from 'react';

export function StructuralAlertsModule() {
  return (
    <div className="animate-fade-in">
      <div className="bg-[#111318]/50 border border-red-500/20 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1f2833] text-[#8892b0] text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Unidade</th>
              <th className="px-6 py-4">Alerta</th>
              <th className="px-6 py-4">Severidade</th>
              <th className="px-6 py-4">Dias</th>
              <th className="px-6 py-4">Ação Requerida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2833]">
            <tr className="hover:bg-[#1f2833]/50 transition-colors">
              <td className="px-6 py-4"><span className="font-semibold text-white">Unidade Paulista</span></td>
              <td className="px-6 py-4 text-[#c5c6c7]">ROI Marketing negativo por 3 meses</td>
              <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-red-500/20 text-red-500 text-xs font-bold font-mono">S1 CRÍTICO</span></td>
              <td className="px-6 py-4 text-[#8892b0]">90 dias</td>
              <td className="px-6 py-4"><button className="text-sm text-[#ff5a1f] font-semibold hover:underline">Revisar Playbook</button></td>
            </tr>
            <tr className="hover:bg-[#1f2833]/50 transition-colors">
              <td className="px-6 py-4"><span className="font-semibold text-white">Unidade Sul</span></td>
              <td className="px-6 py-4 text-[#c5c6c7]">NPS abaixo de P25 da rede (&lt; 7.0)</td>
              <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-xs font-bold font-mono">S2 ATENÇÃO</span></td>
              <td className="px-6 py-4 text-[#8892b0]">45 dias</td>
              <td className="px-6 py-4"><button className="text-sm text-[#ff5a1f] font-semibold hover:underline">Revisar RCA</button></td>
            </tr>
            <tr className="hover:bg-[#1f2833]/50 transition-colors">
              <td className="px-6 py-4"><span className="font-semibold text-white">Unidade Jardins</span></td>
              <td className="px-6 py-4 text-[#c5c6c7]">Dependência de 1 Médico (&gt; 40% receita)</td>
              <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-xs font-bold font-mono">S2 ATENÇÃO</span></td>
              <td className="px-6 py-4 text-[#8892b0]">60 dias</td>
              <td className="px-6 py-4"><button className="text-sm text-[#ff5a1f] font-semibold hover:underline">Plano de Contingência</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
