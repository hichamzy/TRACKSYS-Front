import Icon from '../icons/Icon.jsx';
import { NAV_GROUPS, CURRENT_USER } from '../../data/navigation.js';
import { useApp } from '../../context/AppContext.jsx';

function BrandMark() {
  return (
    <svg className="hexmark" viewBox="0 0 40 44" fill="none">
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3FC6E0" />
          <stop offset="1" stopColor="#1B3A6B" />
        </linearGradient>
      </defs>
      <rect x="1" y="3" width="38" height="38" rx="12" fill="url(#tg)" />
      <path d="M20 11.5a7 7 0 0 0-7 7c0 4.9 7 12.5 7 12.5s7-7.6 7-12.5a7 7 0 0 0-7-7z" fill="#fff" />
      <circle cx="20" cy="18.5" r="2.8" fill="#1B3A6B" />
    </svg>
  );
}

export default function Sidebar() {
  const { view, setView, unreadCount, openComplaints } = useApp();

  const badgeValue = (key) => {
    if (key === 'alerts') return unreadCount || null;
    if (key === 'complaints') return openComplaints.length || null;
    return null;
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <BrandMark />
        <div>
          <div className="brand-name">
            TRACK<span style={{ color: 'var(--cyan)' }}>SYS</span>
          </div>
          <div className="brand-sub">FLEET &amp; CIVIC</div>
          <div className="brand-by">
            by <b>ALEXSYS</b> Solutions
          </div>
        </div>
      </div>

      <nav className="nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="nav-group">{group.label}</div>
            {group.items.map((item) => {
              const badge = item.badge ? badgeValue(item.badge) : null;
              const active = view === item.view;
              return (
                <div
                  key={item.view}
                  className={`nav-item${item.accent ? ` ${item.accent}` : ''}${active ? ' active' : ''}`}
                  onClick={() => setView(item.view)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setView(item.view)}
                >
                  <Icon name={item.icon} width={1.8} />
                  {item.label}
                  {badge != null && <span className="nav-badge">{badge}</span>}
                  {item.dot && <span className="nav-dot" />}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="user">
          <div className="avatar">{CURRENT_USER.initials}</div>
          <div>
            <div className="user-name">{CURRENT_USER.name}</div>
            <div className="user-role">{CURRENT_USER.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
