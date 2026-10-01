import { useNavigate } from 'react-router-dom'
import { useActiveSession, useLatestWorkflowRun, useOptions } from '../hooks'
import { contributionRepository } from '../storage/repositories'
import type { Contribution } from '../domain/types'
import { useEffect, useState } from 'react'

export default function OptionCompareScreen() {
  const navigate = useNavigate()
  const { session } = useActiveSession()
  const { run } = useLatestWorkflowRun(session?.id)
  const { options, loading } = useOptions(run?.id)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [contributions, setContributions] = useState<Record<string, Contribution[]>>({})

  useEffect(() => {
    if (!options.length) return
    void Promise.all(options.map(async (option) => {
      const rows = await Promise.all(option.contributionRefs.map((id) => contributionRepository.getById(id)))
      setContributions(prev => ({ ...prev, [option.id]: rows.filter(Boolean) as Contribution[] }))
    }))
  }, [options])

  if (loading) {
    return (
      <div className="screen-shell">
        <div className="screen-shell__header">
          <h1 className="screen-shell__title">กำลังโหลด...</h1>
        </div>
      </div>
    )
  }

  if (options.length === 0) {
    return (
      <div className="screen-shell">
        <div className="screen-shell__header">
          <div>
            <h1 className="screen-shell__title">เปรียบเทียบตัวเลือก</h1>
            <p className="screen-shell__subtitle">ยังไม่มีตัวเลือก — ต้องทำ council session ก่อน</p>
          </div>
        </div>
        <div className="screen-shell__body">
          <button className="btn btn--primary" onClick={() => navigate('/station')}>
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">เปรียบเทียบตัวเลือก</h1>
          <p className="screen-shell__subtitle">{options.length} ทางเลือกจากทีม AI — เลือกหรือขอรอบใหม่</p>
        </div>
      </div>

      <div className="screen-shell__body">
        {options.length !== 3 ? (
          <div className="card">
            <strong>ผลสังเคราะห์ไม่ครบ</strong>
            <p className="card__description">ต้องมีตัวเลือกครบ 3 รายการก่อนจึงจะยืนยันการตัดสินใจได้</p>
          </div>
        ) : null}
        {options.map((option) => (
          <div key={option.id} className="card">
            <div onClick={() => navigate('/decision')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="card__title">{option.title}</div>
              <span className="status-badge status-badge--idle">#{option.rank}</span>
            </div>
            <p className="card__description" style={{ marginTop: 'var(--space-2)' }}>
              {option.thesis}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-success)' }}>
                  ข้อดี:
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginLeft: 'var(--space-2)' }}>
                  {option.strengths}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-error)' }}>
                  ข้อเสีย:
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginLeft: 'var(--space-2)' }}>
                  {option.weaknesses}
                </span>
              </div>
            </div>
            <div className="card__meta">
              <button className="btn btn--ghost" onClick={(e) => { e.stopPropagation(); setExpanded(expanded === option.id ? null : option.id) }}>
                {expanded === option.id ? 'ซ่อนที่มา' : `ดูที่มา (${option.contributionRefs.length})`}
              </button>
              <span>ต้นทุน: {option.indicativeCostLevel === 'low' ? 'ต่ำ' : option.indicativeCostLevel === 'medium' ? 'ปานกลาง' : 'สูง'}</span>
            </div>
            {expanded === option.id && (
              <div style={{ marginTop: 'var(--space-3)' }} aria-label="contributions used">
                {contributions[option.id]?.map((c) => (
                  <div key={c.id} className="card card--muted">
                    <strong>{c.type === 'critique' ? 'Critique' : 'Contribution'}</strong>
                    <p className="card__description">{c.content}</p>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        ))}

        <p className="form-hint" style={{ textAlign: 'center' }}>
          ⚡ ข้อมูลจำลอง — สร้างโดย Demo Synthesizer
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn--ghost" onClick={() => navigate('/session')}>
            กลับ
          </button>
          <button
            className="btn btn--primary"
            style={{ flex: 1 }}
            onClick={() => navigate('/decision')}
          >
            เลือกตัวเลือก
          </button>
        </div>
      </div>
    </div>
  )
}
