import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSessions } from '../hooks'
import { getStatusLabel } from '../domain/defaults'
import { formatDate } from '../domain/utils'

export default function HistoryScreen() {
  const navigate = useNavigate()
  const { sessions, loading } = useSessions()
  const [filter, setFilter] = useState<'all' | 'complete' | 'error'>('all')
  const visibleSessions = sessions.filter((session) => filter === 'all' || session.status === filter)

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">ประวัติ</h1>
          <p className="screen-shell__subtitle">เซสชัน การตัดสินใจ และเหตุการณ์ทั้งหมด</p>
        </div>
      </div>

      <div className="screen-shell__body">
        {/* Filter */}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className={`btn ${filter === 'all' ? 'btn--secondary' : 'btn--ghost'}`} style={{ fontSize: 'var(--text-xs)' }} onClick={() => setFilter('all')}>ทั้งหมด</button>
          <button className={`btn ${filter === 'complete' ? 'btn--secondary' : 'btn--ghost'}`} style={{ fontSize: 'var(--text-xs)' }} onClick={() => setFilter('complete')}>Complete</button>
          <button className={`btn ${filter === 'error' ? 'btn--secondary' : 'btn--ghost'}`} style={{ fontSize: 'var(--text-xs)' }} onClick={() => setFilter('error')}>Error</button>
        </div>

        {/* Session List */}
        {loading ? (
          <div className="card">
            <p>กำลังโหลด...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <div className="empty-state__title">ยังไม่มีเซสชัน</div>
            <div className="empty-state__description">
              เมื่อสร้างเซสชันและตัดสินใจแล้ว จะบันทึกที่นี่
            </div>
            <button className="btn btn--primary" onClick={() => navigate('/brief')}>
              เริ่มเซสชันแรก
            </button>
          </div>
        ) : visibleSessions.length === 0 ? (
          <div className="empty-state"><div className="empty-state__title">ไม่พบเซสชันตามตัวกรอง</div></div>
        ) : (
          visibleSessions.map((session) => (
            <div
              key={session.id}
              className="card card--interactive"
              onClick={() => navigate(`/session/${session.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="card__title">เซสชัน {session.id.slice(0, 8)}</div>
                  <div className="card__description">{formatDate(session.createdAt)}</div>
                </div>
                <span className={`status-badge status-badge--${session.status}`}>
                  {getStatusLabel(session.status)}
                </span>
              </div>
              <div className="card__meta">
                <span>ขั้นตอน: {session.currentStage}</span>
              </div>
            </div>
          ))
        )}

        {/* Audit Trail Preview */}
        <div className="card">
          <div className="card__title">Audit Trail</div>
          <div className="card__description">
            เหตุการณ์ทั้งหมด (entity_created, state_changed, approval_resolved, ...) จะบันทึกที่นี่
          </div>
          <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
            Append-only — ไม่สามารถแก้ไขจาก UI
          </p>
        </div>
      </div>
    </div>
  )
}
