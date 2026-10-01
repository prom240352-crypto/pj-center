import { useNavigate } from 'react-router-dom'
import { useActiveSession, useEnabledAgents, usePendingApprovals } from '../hooks'
import { getStatusLabel } from '../domain/defaults'

export default function StationScreen() {
  const navigate = useNavigate()
  const { session } = useActiveSession()
  const { agents } = useEnabledAgents()
  const { approvals } = usePendingApprovals()

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">สถานี</h1>
          <p className="screen-shell__subtitle">ภาพรวมเซสชันและงานที่กำลังดำเนินการ</p>
        </div>
        <div className="screen-shell__actions">
          <button className="btn btn--primary" onClick={() => navigate('/brief')}>
            + เริ่มงานใหม่
          </button>
        </div>
      </div>

      <div className="screen-shell__body">
        {/* Latest Session Card */}
        {session ? (
          <div
            className="card card--interactive"
            onClick={() => navigate(`/session/${session.id}`)}
          >
            <div className="card__title">เซสชันล่าสุด</div>
            <div className="card__description">
              สถานะ: {getStatusLabel(session.status)} | ขั้นตอน: {session.currentStage}
            </div>
            <div className="card__meta">
              <span className={`status-badge status-badge--${session.status}`}>
                {getStatusLabel(session.status)}
              </span>
            </div>
          </div>
        ) : (
          <div className="card card--interactive" onClick={() => navigate('/brief')}>
            <div className="card__title">เริ่มเซสชันใหม่</div>
            <div className="card__description">ยังไม่มีเซสชัน — เริ่มสร้าง idea brief เพื่อเริ่มต้น</div>
            <div className="card__meta">
              <span className="status-badge status-badge--idle">Idle</span>
            </div>
          </div>
        )}

        {/* Agent Status Summary */}
        <div className="card">
          <div className="card__title">สถานะทีม AI</div>
          <div className="card__description">ตัวแทน {agents.length} ตัว พร้อมทำงาน</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            {agents.map((agent) => (
              <span key={agent.id} className="status-badge status-badge--idle">
                {agent.name}
              </span>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="card card--interactive" onClick={() => navigate('/approvals')}>
          <div className="card__title">รออนุมัติ</div>
          <div className="card__description">
            {approvals.length > 0
              ? `มี ${approvals.length} คำขอรออนุมัติ`
              : 'ไม่มีคำขออนุมัติในขณะนี้'}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card__title">ทางลัด</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <button className="btn btn--secondary" onClick={() => navigate('/agents')}>
              จัดการทีม AI
            </button>
            <button className="btn btn--secondary" onClick={() => navigate('/budget')}>
              ดูงบประมาณ Demo
            </button>
            <button className="btn btn--secondary" onClick={() => navigate('/settings')}>
              ตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
