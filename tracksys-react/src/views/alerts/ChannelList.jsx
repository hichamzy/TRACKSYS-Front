import Switch from '../../components/ui/Switch.jsx';
import { useApp } from '../../context/AppContext.jsx';

/** Canaux de notification globaux (plateforme, e-mail, SMS, récap quotidien) */
export default function ChannelList() {
  const { channels, toggleChannel } = useApp();

  return (
    <>
      {channels.map((c) => (
        <div className="rule" key={c.id}>
          <div className="rule-main">
            <div className="rule-t">{c.name}</div>
            <div className="rule-d">{c.d}</div>
          </div>
          <Switch checked={c.on} onChange={() => toggleChannel(c.id)} label={c.name} />
        </div>
      ))}
    </>
  );
}
