import { useBudget, useAuditEvents, useActiveSession } from '../hooks'
import { formatDateTime } from '../domain/utils'

export default function BudgetScreen() {
  const { session } = useActiveSession()
  const { entries, summary, loading } = useBudget(session?.id)
  const { events } = useAuditEvents(20)

  const total = summary.total
  const used = summary.used

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">งบประมาณ & Audit</h1>
          <p className="screen-shell__subtitle">Demo credits ledger และ event timeline</p>
        </div>
      </div>

      <div className="screen-shell__body">
        {/* Budget Summary */}
        <div className="card">
          <div className="card__title">สรุปงบประมาณ Demo</div>
          {loading ? (
            <p>กำลังโหลด...</p>
          ) : (
            <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-3)', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>คงเหลือ</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-success)' }}>{summary.remaining}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>ใช้ไป</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text)' }}>{used}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>ทั้งหมด</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{total}</div>
              </div>
            </div>
            <div className="form-hint" style={{ textAlign: 'center' }}>จองไว้: {summary.reserved} credits</div>
            </>
          )}
          <p className="form-hint" style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
            ⚡ Demo credits — ไม่ใช่เงินจริง
          </p>
        </div>

        {/* Cost per Step */}
        <div className="card">
          <div className="card__title">ต้นทุนต่อขั้นตอน (Demo)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span>Diverge (3 agents)</span>
              <span style={{ fontWeight: 600 }}>90 credits</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span>Critique (1 agent)</span>
              <span style={{ fontWeight: 600 }}>30 credits</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span>Synthesize (1 agent)</span>
              <span style={{ fontWeight: 600 }}>30 credits</span>
            </div>
            <hr className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
              <span>รวมต่อเซสชัน</span>
              <span>150 credits</span>
            </div>
          </div>
        </div>

        {/* Ledger Entries */}
        <div className="card">
          <div className="card__title">Ledger Entries ({entries.length})</div>
          {entries.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
              <div className="empty-state__description">
                ยังไม่มีรายการ — เริ่มเซสชันเพื่อดู budget transactions
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              {entries.slice(0, 10).map((entry) => (
                <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', padding: 'var(--space-2)', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span>{entry.description}</span>
                  <span style={{ fontWeight: 600 }}>{entry.amount} credits</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Events */}
        <div className="card">
          <div className="card__title">Audit Events ({events.length})</div>
          {events.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
              <div className="empty-state__description">
                ยังไม่มีเหตุการณ์
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              {events.slice(0, 10).map((event) => (
                <div key={event.id} style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2)', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600 }}>{event.action}</div>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                    {event.reason} — {formatDateTime(event.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
