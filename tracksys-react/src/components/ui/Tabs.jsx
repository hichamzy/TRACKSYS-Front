import Icon from '../icons/Icon.jsx';

/**
 * Onglets « set-tabs » (Paramètres, Alertes).
 * @param {Array<{key:string,label:string,icon:string}>} tabs
 */
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="set-tabs" role="tablist">
      {tabs.map((t) => (
        <div
          key={t.key}
          role="tab"
          tabIndex={0}
          aria-selected={active === t.key}
          className={`stab${active === t.key ? ' on' : ''}`}
          onClick={() => onChange(t.key)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(t.key)}
        >
          {t.icon && <Icon name={t.icon} width={1.8} />}
          {t.label}
        </div>
      ))}
    </div>
  );
}
