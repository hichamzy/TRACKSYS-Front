import { useState } from 'react';
import Icon from '../icons/Icon.jsx';
import { VIEW_TITLES } from '../../data/navigation.js';
import { useApp } from '../../context/AppContext.jsx';

export default function Topbar() {
  const { view, setView, unreadCount } = useApp();
  const [query, setQuery] = useState('');
  const [title, subtitle] = VIEW_TITLES[view];

  return (
    <div className="topbar">
      <div className="page-title">
        {title}
        <small>{subtitle}</small>
      </div>

      <div className="search">
        <Icon name="search" />
        <input placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div
        className="icon-btn"
        onClick={() => setView('alerts')}
        role="button"
        tabIndex={0}
        title="Alertes"
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setView('alerts')}
      >
        {unreadCount > 0 && <span className="ping" />}
        <Icon name="bell" width={1.8} />
      </div>
    </div>
  );
}
