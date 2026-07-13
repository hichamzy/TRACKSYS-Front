/**
 * Filtre segmenté avec compteurs (réclamations, alertes).
 * @param {Array<{key:string,label:string}>} options
 * @param {Object<string,number>} counts
 */
export default function Segmented({ options, counts = {}, active, onChange }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.key} className={active === o.key ? 'on' : ''} onClick={() => onChange(o.key)}>
          {o.label} <b>{counts[o.key] ?? 0}</b>
        </button>
      ))}
    </div>
  );
}
