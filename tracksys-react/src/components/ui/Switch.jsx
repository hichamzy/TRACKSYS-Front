/** Interrupteur (règles d'alerte, canaux de notification) */
export default function Switch({ checked, onChange, label }) {
  return (
    <label className="sw-t" aria-label={label}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="sl" />
    </label>
  );
}
