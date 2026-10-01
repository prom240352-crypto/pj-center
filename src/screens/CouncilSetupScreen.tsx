import { useNavigate } from 'react-router-dom'

const DEFAULT_AGENTS = [
  { id: '1', name: 'Product Strategist', role: 'คุณค่า ตลาด และ differentiation', enabled: true },
  { id: '2', name: 'User Advocate', role: 'ปัญหา user journey และ accessibility', enabled: true },
  { id: '3', name: 'Systems Architect', role: 'feasibility, architecture และ scope', enabled: true },
  { id: '4', name: 'Risk & Cost Reviewer', role: 'security, cost, risk และสิ่งเกิน MVP', enabled: true },
  { id: '5', name: 'Synthesizer', role: 'รวมหลักฐานและความเห็นต่าง', enabled: true },
]

export default function CouncilSetupScreen() {
  const navigate = useNavigate()

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">ตั้งค่าทีม Council</h1>
          <p className="screen-shell__subtitle">ตรวจสอบและปรับบทบาทตัวแทนก่อนเริ่มเซสชัน</p>
        </div>
      </div>

      <div className="screen-shell__body">
        {/* Budget Preview */}
        <div className="card">
          <div className="card__title">งบประมาณ Demo</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
            <span className="card__description">ค่าใช้จ่ายโดยประมาณ</span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>150 Demo credits</span>
          </div>
          <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
            ⚡ ข้อมูลจำลอง — ไม่ใช่เงินจริง
          </p>
        </div>

        {/* Agent List */}
        <div className="card">
          <div className="card__title">ทีมมาตรฐาน (5 ตัวแทน)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            {DEFAULT_AGENTS.map((agent) => (
              <div key={agent.id} className="list-item">
                <span className="list-item__icon">🤖</span>
                <div className="list-item__content">
                  <div className="list-item__title">{agent.name}</div>
                  <div className="list-item__subtitle">{agent.role}</div>
                </div>
                <span className="status-badge status-badge--idle">
                  {agent.enabled ? 'พร้อม' : 'ปิด'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn--ghost" onClick={() => navigate('/agents')}>
            แก้ไขทีม
          </button>
          <button
            className="btn btn--primary"
            style={{ flex: 1 }}
            onClick={() => navigate('/session')}
          >
            เริ่มเซสชัน (150 credits)
          </button>
        </div>
      </div>
    </div>
  )
}
