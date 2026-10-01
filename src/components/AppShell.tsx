import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import type { NavTab } from '../types'

const NAV_TABS: NavTab[] = [
  { id: 'station', label: 'สถานี', icon: '🏠', path: '/station' },
  { id: 'sessions', label: 'เซสชัน', icon: '📋', path: '/sessions' },
  { id: 'agents', label: 'ตัวแทน', icon: '🤖', path: '/agents' },
  { id: 'approvals', label: 'อนุมัติ', icon: '✅', path: '/approvals' },
]

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="app-shell">
      {/* Demo Badge */}
      <div className="demo-badge">
        <span className="demo-badge__icon">⚡</span>
        <span>Demo — ข้อมูลจำลองทั้งหมด</span>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bottom-nav" role="navigation" aria-label="เมนูหลัก">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`bottom-nav__item${isActive(tab.path) ? ' bottom-nav__item--active' : ''}`}
            onClick={() => navigate(tab.path)}
            aria-current={isActive(tab.path) ? 'page' : undefined}
          >
            <span className="bottom-nav__icon" aria-hidden="true">{tab.icon}</span>
            <span className="bottom-nav__label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Nav Rail (Tablet) */}
      <nav className="nav-rail" role="navigation" aria-label="เมนูหลัก">
        <div className="nav-rail__brand">PJ</div>
        <ul className="nav-rail__list">
          {NAV_TABS.map((tab) => (
            <li key={tab.id}>
              <button
                className={`nav-rail__item${isActive(tab.path) ? ' nav-rail__item--active' : ''}`}
                onClick={() => navigate(tab.path)}
                aria-current={isActive(tab.path) ? 'page' : undefined}
              >
                <span className="nav-rail__icon" aria-hidden="true">{tab.icon}</span>
                <span className="nav-rail__label">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
