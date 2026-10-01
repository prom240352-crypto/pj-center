import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useWorkflow } from '../hooks'
import { briefRepository, sessionRepository } from '../storage/repositories'
import { validateBrief, getFieldError } from '../domain/validation'
import type { ValidationError } from '../domain/types'

export default function IdeaBriefScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('sessionId')
  const { createSession, reviseBrief, loading, error } = useWorkflow()
  const [topic, setTopic] = useState('')
  const [targetUser, setTargetUser] = useState('')
  const [goal, setGoal] = useState('')
  const [constraints, setConstraints] = useState('')
  const [successSignal, setSuccessSignal] = useState('')
  const [errors, setErrors] = useState<ValidationError[]>([])

  useEffect(() => {
    if (!sessionId) return
    void (async () => {
      const session = await sessionRepository.getById(sessionId)
      if (!session) return
      const brief = await briefRepository.getById(session.briefRevisionId)
      if (!brief) return
      setTopic(brief.topic); setTargetUser(brief.targetUser); setGoal(brief.goal); setConstraints(brief.constraints); setSuccessSignal(brief.successSignal)
    })()
  }, [sessionId])

  const handleSubmit = async () => {
    const result = validateBrief({ topic, goal })
    if (!result.valid) {
      setErrors(result.errors)
      return
    }

    try {
      if (sessionId) {
        await reviseBrief(sessionId, { topic, targetUser, goal, constraints, successSignal })
        navigate(`/council-setup?sessionId=${sessionId}`)
      } else {
        const session = await createSession({ topic, targetUser, goal, constraints, successSignal })
        navigate(`/council-setup?sessionId=${session.id}`)
      }
    } catch (err) {
      console.error('Failed to create session:', err)
    }
  }

  const canStart = topic.trim() !== '' && goal.trim() !== ''

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">{sessionId ? 'แก้ไข Idea Brief' : 'สร้าง Idea Brief'}</h1>
          <p className="screen-shell__subtitle">อธิบายโจทย์เพื่อให้ทีม AI ทำงานจากปัญหาเดียวกัน</p>
        </div>
      </div>

      <div className="screen-shell__body">
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Topic */}
            <div className="form-group">
              <label className="form-label" htmlFor="topic">หัวข้อ *</label>
              <input
                id="topic"
                className="form-input"
                type="text"
                placeholder="เช่น แอปจัดการงานสำหรับ freelancer"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value)
                  setErrors(errors.filter(err => err.field !== 'topic'))
                }}
              />
              {getFieldError(errors, 'topic') && (
                <span className="form-error">{getFieldError(errors, 'topic')}</span>
              )}
              <span className="form-hint">หัวข้อหลักของไอเดีย</span>
            </div>

            {/* Target User */}
            <div className="form-group">
              <label className="form-label form-label--optional" htmlFor="targetUser">ผู้ใช้เป้าหมาย</label>
              <input
                id="targetUser"
                className="form-input"
                type="text"
                placeholder="เช่น freelancer อายุ 25-35 ที่ทำงานหลายโปรเจกต์"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
              />
            </div>

            {/* Goal */}
            <div className="form-group">
              <label className="form-label" htmlFor="goal">เป้าหมาย *</label>
              <textarea
                id="goal"
                className="form-textarea"
                placeholder="สิ่งที่คุณต้องการให้เกิดขึ้น"
                value={goal}
                onChange={(e) => {
                  setGoal(e.target.value)
                  setErrors(errors.filter(err => err.field !== 'goal'))
                }}
              />
              {getFieldError(errors, 'goal') && (
                <span className="form-error">{getFieldError(errors, 'goal')}</span>
              )}
            </div>

            {/* Constraints */}
            <div className="form-group">
              <label className="form-label form-label--optional" htmlFor="constraints">ข้อจำกัด</label>
              <textarea
                id="constraints"
                className="form-textarea"
                placeholder="งบประมาณ เวลา เทคโนโลยี ข้อจำกัดทางธุรกิจ"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </div>

            {/* Success Signal */}
            <div className="form-group">
              <label className="form-label form-label--optional" htmlFor="successSignal">สัญญาณความสำเร็จ</label>
              <input
                id="successSignal"
                className="form-input"
                type="text"
                placeholder="เช่น ผู้ใช้ 100 คนใน 3 เดือนแรก"
                value={successSignal}
                onChange={(e) => setSuccessSignal(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="card" style={{ borderColor: 'var(--color-error)' }}>
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            className="btn btn--primary"
            disabled={!canStart || loading}
            onClick={handleSubmit}
            style={{ flex: 1 }}
          >
            {loading ? 'กำลังบันทึก...' : sessionId ? 'บันทึก revision และไปต่อ' : 'ถัดไป: เลือกทีม'}
          </button>
          <button className="btn btn--ghost" onClick={() => navigate('/station')}>
            ยกเลิก
          </button>
        </div>

        {!canStart && !error && (
          <p className="form-hint" style={{ textAlign: 'center' }}>
            กรุณากรอกหัวข้อและเป้าหมายเพื่อเริ่มเซสชัน
          </p>
        )}
      </div>
    </div>
  )
}
