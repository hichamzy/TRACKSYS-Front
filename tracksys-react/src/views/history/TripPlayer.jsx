import Icon from '../../components/icons/Icon.jsx';
import { fmtMin } from '../../utils/geo.js';

const SPEEDS = [1, 2, 4];

/** Barre de lecture du trajet : lecture/pause, curseur de progression, vitesse de relecture */
export default function TripPlayer({ progress, playing, speed, startMin, durMin, endMin, onToggle, onScrub, onSpeed }) {
  return (
    <div className="player">
      <button className="play-btn" onClick={onToggle} aria-label={playing ? 'Pause' : 'Lecture'}>
        <Icon name={playing ? 'pause' : 'play'} size={20} filled />
      </button>

      <span className="play-time">{fmtMin(startMin + progress * durMin)}</span>

      <input
        type="range"
        className="scrub"
        min={0}
        max={1000}
        value={Math.round(progress * 1000)}
        onChange={(e) => onScrub(Number(e.target.value) / 1000)}
        aria-label="Progression du trajet"
      />

      <span className="play-time" style={{ color: 'var(--muted)' }}>
        {fmtMin(endMin)}
      </span>

      <div className="speed">
        {SPEEDS.map((s) => (
          <button key={s} className={speed === s ? 'on' : ''} onClick={() => onSpeed(s)}>
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}
