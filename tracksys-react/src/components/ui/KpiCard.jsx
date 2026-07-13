import Icon from '../icons/Icon.jsx';

/**
 * Carte KPI.
 * @param {string} icon  nom d'icône
 * @param {string} tone  kc | kn | ko | kg (couleur de la pastille)
 * @param {boolean} cit  variante « citoyen » (halo orange)
 * @param {object} trend { dir: 'up'|'down', text: '▲ 4%' }
 */
export default function KpiCard({ icon, tone = 'kc', cit = false, value, unit, label, trend }) {
  return (
    <div className={`kpi${cit ? ' cit' : ''}`}>
      {trend && <div className={`kpi-trend ${trend.dir}`}>{trend.text}</div>}
      <div className={`kpi-ico ${tone}`}>
        <Icon name={icon} width={1.8} />
      </div>
      <div className="kpi-val">
        {value}
        {unit && <small>{unit}</small>}
      </div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}
