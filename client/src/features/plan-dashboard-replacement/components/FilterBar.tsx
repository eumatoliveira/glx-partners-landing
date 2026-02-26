import { Filters, channels, professionals, procedures, units, severities, statuses } from '../data/mockData';

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  showUnit?: boolean;
}

export default function FilterBar({ filters, onChange, showUnit = false }: FilterBarProps) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clear = () => {
    onChange({
      period: '30d', channel: '', professional: '', procedure: '',
      status: '', unit: '', severity: '',
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-title"><span className="dot" /> Filtros globais</div>
      <div className="filter-row">
        <select className="filter-select" value={filters.period} onChange={e => update('period', e.target.value)}>
          <option value="7d">7d</option>
          <option value="15d">15d</option>
          <option value="30d">30d</option>
          <option value="3m">3 meses</option>
          <option value="6m">6 meses</option>
          <option value="1 ano">1 ano</option>
        </select>

        <select className="filter-select" value={filters.channel} onChange={e => update('channel', e.target.value)}>
          <option value="">Canal (todos)</option>
          {channels.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="filter-select" value={filters.professional} onChange={e => update('professional', e.target.value)}>
          <option value="">Profissional (todos)</option>
          {professionals.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select className="filter-select" value={filters.procedure} onChange={e => update('procedure', e.target.value)}>
          <option value="">Procedimento (todos)</option>
          {procedures.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select className="filter-select" value={filters.status} onChange={e => update('status', e.target.value)}>
          <option value="">Status (todos)</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {showUnit && <select className="filter-select" value={filters.unit} onChange={e => update('unit', e.target.value)}>
          <option value="">Unidade (todas)</option>
          {units.map(u => <option key={u} value={u}>{u}</option>)}
        </select>}

        <select className="filter-select" value={filters.severity} onChange={e => update('severity', e.target.value)}>
          <option value="">Severidade</option>
          {severities.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <button className="filter-clear" onClick={clear}>Limpar</button>
      </div>
    </div>
  );
}
