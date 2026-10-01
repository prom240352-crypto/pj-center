import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useOptions, useActiveSession, useLatestWorkflowRun } from '../hooks'
import { decisionService } from '../domain/decision'

export default function DecisionScreen() {
  const navigate = useNavigate()
  const { session } = useActiveSession()
  const { run } = useLatestWorkflowRun(session?.id)
  const { options } = useOptions(run?.id)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [rationale, setRationale] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [decision, setDecision] = useState<{ type: 'select' | 'merge' | 'rerun'; outline?: any } | null>(null)

  const handleMergeOptions = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId))
    } else {
      setSelectedOptions([...selectedOptions, optionId])
    }
  }

  const handleConfirmSelect = async () => {
    if (selectedOptions.length !== 1 || !session) {
      setError('กรุณาเลือกตัวเลือกเดียว')
      return
    }

    if (!window.confirm('ยืนยันการเลือกตัวเลือกนี้? หลังยืนยันแล้วจะสร้าง Development Outline และแก้ decision โดยตรงไม่ได้')) return

    setLoading(true)
    setError(null)

    try {
      const result = await decisionService.selectOption(
        session.id,
        selectedOptions[0],
        rationale
      )
      setDecision({ type: 'select', outline: result.outline })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmMerge = async () => {
    if (selectedOptions.length < 2 || !session) {
      setError('กรุณาเลือกอย่างน้อย 2 ตัวเลือกเพื่อรวม')
      return
    }

    if (!window.confirm(`ยืนยันการรวม ${selectedOptions.length} ตัวเลือก?`)) return

    setLoading(true)
    setError(null)

    try {
      const result = await decisionService.mergeOptions(
        session.id,
        selectedOptions,
        rationale
      )
      setDecision({ type: 'merge', outline: result.outline })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestRerun = async () => {
    if (!session) return

    setLoading(true)
    setError(null)

    try {
      await decisionService.requestNewRound(session.id, rationale || 'ต้องการระดมความคิดรอบใหม่')
      setDecision({ type: 'rerun' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  // Show decision result
  if (decision) {
    return (
      <div className="screen-shell">
        <div className="screen-shell__header">
          <div>
            <h1 className="screen-shell__title">
              {decision.type === 'select' && 'เลือกตัวเลือกแล้ว'}
              {decision.type === 'merge' && 'รวมตัวเลือกแล้ว'}
              {decision.type === 'rerun' && 'ขอรอบใหม่แล้ว'}
            </h1>
            <p className="screen-shell__subtitle">
              {decision.type === 'rerun'
                ? 'คำขอของคุณถูกส่งไปรออนุมัติ'
                : 'การตัดสินใจของคุณถูกบันทึกแล้ว'}
            </p>
          </div>
        </div>

        <div className="screen-shell__body">
          {decision.type === 'rerun' ? (
            <div className="card">
              <div className="card__title">คำขอรอบใหม่</div>
              <p className="card__description" style={{ marginTop: 'var(--space-2)' }}>
                คำขอของคุณถูกส่งไปรออนุมัติแล้ว เมื่ออนุมัติแล้ว คุณจะเริ่มเซสชันใหม่ได้
              </p>
              <div style={{ marginTop: 'var(--space-3)' }}>
                <span className="status-badge status-badge--waiting">รออนุมัติ</span>
              </div>
            </div>
          ) : decision.outline ? (
            <div className="card">
              <div className="card__title">Development Outline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    ปัญหา
                  </div>
                  <p className="card__description">{decision.outline.problem}</p>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    กลุ่มผู้ใช้
                  </div>
                  <p className="card__description">{decision.outline.users}</p>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    MVP Scope
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {decision.outline.mvpItems.map((item: string, i: number) => (
                      <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', padding: 'var(--space-1) 0' }}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    ขั้นตอนถัดไป
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {decision.outline.nextSteps.map((step: string, i: number) => (
                      <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', padding: 'var(--space-1) 0' }}>
                        {i + 1}. {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          <p className="form-hint" style={{ textAlign: 'center' }}>
            ⚡ ข้อมูลจำลอง — สร้างโดย Demo Runtime
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              className="btn btn--primary btn--block"
              onClick={() => navigate('/station')}
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">ตัดสินใจ</h1>
          <p className="screen-shell__subtitle">เลือกตัวเลือก รวม หรือขอรอบใหม่</p>
        </div>
      </div>

      <div className="screen-shell__body">
        {options.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <div className="empty-state__title">ยังไม่มีตัวเลือก</div>
            <div className="empty-state__description">
              ต้องทำ council session ก่อนเพื่อสร้างตัวเลือก
            </div>
            <button className="btn btn--primary" onClick={() => navigate('/station')}>
              กลับหน้าหลัก
            </button>
          </div>
        ) : (
          <>
            {/* Option Selection */}
            <div className="card">
              <div className="card__title">เลือกตัวเลือก</div>
              <p className="card__description" style={{ marginTop: 'var(--space-2)' }}>
                เลือก 1 ตัวเลือกเพื่อเลือก หรือเลือกหลายตัวเลือกเพื่อรวม
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                {options.map((option) => (
                  <div
                    key={option.id}
                    className={`card ${selectedOptions.includes(option.id) ? 'card--selected' : ''}`}
                    style={{
                      cursor: 'pointer',
                      borderColor: selectedOptions.includes(option.id) ? 'var(--color-primary)' : undefined,
                      background: selectedOptions.includes(option.id) ? 'var(--color-primary-light)' : undefined,
                    }}
                    onClick={() => handleMergeOptions(option.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div className="card__title">{option.title}</div>
                      <span className="status-badge status-badge--idle">#{option.rank}</span>
                    </div>
                    <p className="card__description" style={{ marginTop: 'var(--space-2)' }}>
                      {option.thesis}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rationale */}
            <div className="card">
              <div className="card__title">เหตุผล (ไม่บังคับ)</div>
              <textarea
                className="form-textarea"
                placeholder="อธิบายเหตุผลที่เลือก..."
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                style={{ marginTop: 'var(--space-2)' }}
              />
            </div>

            {error && (
              <div className="card" style={{ borderColor: 'var(--color-error)' }}>
                <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
                  {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {selectedOptions.length === 1 && (
                <button
                  className="btn btn--primary btn--block"
                  onClick={handleConfirmSelect}
                  disabled={loading}
                >
                  {loading ? 'กำลังบันทึก...' : 'เลือกตัวเลือกนี้'}
                </button>
              )}

              {selectedOptions.length >= 2 && (
                <button
                  className="btn btn--primary btn--block"
                  onClick={handleConfirmMerge}
                  disabled={loading}
                >
                  {loading ? 'กำลังบันทึก...' : `รวม ${selectedOptions.length} ตัวเลือก`}
                </button>
              )}

              <button
                className="btn btn--secondary btn--block"
                onClick={handleRequestRerun}
                disabled={loading}
              >
                {loading ? 'กำลังส่งคำขอ...' : 'ขอรอบใหม่ (ต้องอนุมัติ)'}
              </button>

              <button
                className="btn btn--ghost btn--block"
                onClick={() => navigate('/options')}
                disabled={loading}
              >
                กลับไปเปรียบเทียบ
              </button>
            </div>

            <p className="form-hint" style={{ textAlign: 'center' }}>
              ⚡ ข้อมูลจำลอง — การตัดสินใจเป็นข้อมูลจำลอง
            </p>
          </>
        )}
      </div>
    </div>
  )
}
