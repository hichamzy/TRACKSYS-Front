import Switch from '../../components/ui/Switch.jsx';
import { ALERT_TYPES } from '../../data/alerts.jsx';
import { useApp } from '../../context/AppContext.jsx';

const CHANNEL_LABELS = { app: 'App', mail: 'E-mail', sms: 'SMS' };

/** Règles de déclenchement : seuil éditable, canaux, activation */
export default function RuleList() {
  const { rules, setRuleValue, toggleRule, toggleRuleChannel } = useApp();

  return (
    <>
      {rules.map((r, i) => {
        const t = ALERT_TYPES[r.k];
        return (
          <div className="rule" key={r.k}>
            <div className={`al-ico sev-${t.sev}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {t.path}
              </svg>
            </div>

            <div className="rule-main">
              <div className="rule-t">{t.label}</div>
              <div className="rule-d">{r.d}</div>
            </div>

            <div className="thr">
              <input
                type="number"
                value={r.val}
                onChange={(e) => setRuleValue(i, e.target.value)}
                aria-label={`Seuil ${t.label}`}
              />
              <span>{r.unit}</span>
            </div>

            <div className="ch-row">
              {Object.keys(CHANNEL_LABELS).map((c) => (
                <span
                  key={c}
                  className={`ch${r.channels[c] ? ' on' : ''}`}
                  onClick={() => toggleRuleChannel(i, c)}
                  role="button"
                  tabIndex={0}
                >
                  {CHANNEL_LABELS[c]}
                </span>
              ))}
            </div>

            <Switch checked={r.on} onChange={() => toggleRule(i)} label={`Activer ${t.label}`} />
          </div>
        );
      })}
    </>
  );
}
