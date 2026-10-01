import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useWorkflow, useContributions, useOptions } from '../hooks'
import { getStatusLabel } from '../domain/defaults'

export default function CouncilSessionScreen() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const { contributions, refresh: refreshContributions } = useContributions()
  const { options, refresh: refreshOptions } = useOptions()
  const {
    startWorkflow,
    executeDiverge,
    executeCritique,
    executeSynthesize,
    requestRetryApproval,
    loading,
    error,
  } = useWorkflow()
  const [stage, setStage] = useState<'ready' | 'diverge' | 'critique' | 'synthesize' | 'complete' | 'error'>('ready')
  const [workflowRunId, setWorkflowRunId] = useState<string | null>(null)
  const [failedStage, setFailedStage] = useState<'diverge' | 'critique' | 'synthesize' | null>(null)

  useEffect(() => {
    // Auto-start workflow if session exists
    if (sessionId && stage === 'ready' && !workflowRunId) {
      const start = async () => {
        try {
          const run = await startWorkflow(sessionId)
          setWorkflowRunId(run.id)
          setStage('diverge')
        } catch (err) {
          console.error('Failed to start workflow:', err)
        }
      }
      start()
    }
  }, [sessionId, stage, workflowRunId, startWorkflow])

  const handleDiverge = async () => {
    if (!sessionId || !workflowRunId) return
    try {
      await executeDiverge(sessionId, workflowRunId)
      await refreshContributions()
      setStage('critique')
      setFailedStage(null)
    } catch (err) {
      console.error('Failed to execute diverge:', err)
      setStage('error')
      setFailedStage('diverge')
    }
  }

  const handleCritique = async () => {
    if (!sessionId || !workflowRunId) return
    try {
      await executeCritique(sessionId, workflowRunId)
      await refreshContributions()
      setStage('synthesize')
      setFailedStage(null)
    } catch (err) {
      console.error('Failed to execute critique:', err)
      setStage('error')
      setFailedStage('critique')
    }
  }

  const handleSynthesize = async () => {
    if (!sessionId || !workflowRunId) return
    try {
      await executeSynthesize(sessionId, workflowRunId)
      await refreshOptions()
      setStage('complete')
      setFailedStage(null)
    } catch (err) {
      console.error('Failed to execute synthesize:', err)
      setStage('error')
      setFailedStage('synthesize')
    }
  }

  const handleRetry = async () => {
    if (!sessionId || !failedStage) return
    try {
      await requestRetryApproval(sessionId, failedStage)
      navigate('/approvals')
      setFailedStage(null)
    } catch (err) {
      console.error('Failed to retry:', err)
    }
  }

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">Council Session</h1>
          <p className="screen-shell__subtitle">เซสชันที่ 1 — กำลังระดมความคิด</p>
        </div>
        <div className="screen-shell__actions">
          <span className={`status-badge status-badge--${loading ? 'working' : stage === 'error' ? 'error' : stage === 'complete' ? 'complete' : 'idle'}`}>
            {loading ? 'กำลังทำงาน' : stage === 'error' ? 'ผิดพลาด' : getStatusLabel(stage === 'complete' ? 'complete' : 'idle')}
          </span>
        </div>
      </div>

      <div className="screen-shell__body">
        {/* Progress */}
        <div className="card">
          <div className="card__title">ความคืบหน้า</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span className="status-badge status-badge--complete">✓ Brief</span>
            <span className={`status-badge status-badge--${stage === 'diverge' ? 'working' : stage === 'error' && failedStage === 'diverge' ? 'error' : stage === 'ready' ? 'idle' : 'complete'}`}>
              {stage === 'diverge' ? '⟳' : stage === 'error' && failedStage === 'diverge' ? '✗' : stage === 'ready' ? '○' : '✓'} Diverge
            </span>
            <span className={`status-badge status-badge--${stage === 'critique' ? 'working' : stage === 'error' && failedStage === 'critique' ? 'error' : stage === 'diverge' || stage === 'ready' ? 'idle' : 'complete'}`}>
              {stage === 'critique' ? '⟳' : stage === 'error' && failedStage === 'critique' ? '✗' : stage === 'diverge' || stage === 'ready' ? '○' : '✓'} Critique
            </span>
            <span className={`status-badge status-badge--${stage === 'synthesize' ? 'working' : stage === 'error' && failedStage === 'synthesize' ? 'error' : stage === 'complete' ? 'complete' : 'idle'}`}>
              {stage === 'synthesize' ? '⟳' : stage === 'error' && failedStage === 'synthesize' ? '✗' : stage === 'complete' ? '✓' : '○'} Synthesize
            </span>
            <span className={`status-badge status-badge--${stage === 'complete' ? 'complete' : 'idle'}`}>
              {stage === 'complete' ? '✓' : '○'} Decision
            </span>
          </div>
        </div>

        {/* Error State */}
        {stage === 'error' && failedStage && (
          <div className="card" style={{ borderColor: 'var(--color-error)' }}>
            <div className="card__title" style={{ color: 'var(--color-error)' }}>
              เกิดข้อผิดพลาดในขั้นตอน {failedStage}
            </div>
            {error && (
              <p className="card__description" style={{ marginTop: 'var(--space-2)', color: 'var(--color-error)' }}>
                {error.message}
              </p>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <button
                className="btn btn--primary"
                onClick={handleRetry}
                disabled={loading}
              >
                {loading ? 'กำลังลองใหม่...' : 'ลองใหม่'}
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => navigate('/station')}
              >
                กลับหน้าหลัก
              </button>
            </div>
            <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
              ⚡ ข้อผิดพลาดจำลอง — กดลองใหม่เพื่อทำต่อ
            </p>
          </div>
        )}

        {/* Stage Controls */}
        {stage === 'diverge' && (
          <div className="card">
            <div className="card__title">รอบที่ 1 — Diverge</div>
            <p className="card__description" style={{ marginTop: 'var(--space-2)' }}>
              Agent 3 ตัวจะเสนอแนวคิดจากมุมมองต่างกัน
            </p>
            <button
              className="btn btn--primary btn--block"
              style={{ marginTop: 'var(--space-3)' }}
              onClick={handleDiverge}
              disabled={loading}
            >
              {loading ? 'กำลังทำงาน...' : 'เริ่ม Diverge'}
            </button>
          </div>
        )}

        {stage === 'critique' && (
          <div className="card">
            <div className="card__title">รอบที่ 2 — Critique</div>
            <p className="card__description" style={{ marginTop: 'var(--space-2)' }}>
              Risk & Cost Reviewer จะตรวจสอบและเสนอข้อควรระวัง
            </p>
            <button
              className="btn btn--primary btn--block"
              style={{ marginTop: 'var(--space-3)' }}
              onClick={handleCritique}
              disabled={loading}
            >
              {loading ? 'กำลังทำงาน...' : 'เริ่ม Critique'}
            </button>
          </div>
        )}

        {stage === 'synthesize' && (
          <div className="card">
            <div className="card__title">รอบที่ 3 — Synthesize</div>
            <p className="card__description" style={{ marginTop: 'var(--space-2)' }}>
              Synthesizer จะรวมข้อมูลและสร้าง 3 ทางเลือก
            </p>
            <button
              className="btn btn--primary btn--block"
              style={{ marginTop: 'var(--space-3)' }}
              onClick={handleSynthesize}
              disabled={loading}
            >
              {loading ? 'กำลังทำงาน...' : 'เริ่ม Synthesize'}
            </button>
          </div>
        )}

        {/* Contributions */}
        {contributions.length > 0 && (
          <div className="card">
            <div className="card__title">Contributions ({contributions.length} รายการ)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              {contributions.map((contrib) => (
                <div key={contrib.id} className="placeholder-block">
                  <span className="placeholder-block__icon">💡</span>
                  <span className="placeholder-block__text">
                    {contrib.content.slice(0, 100)}...
                  </span>
                </div>
              ))}
            </div>
            <p className="form-hint" style={{ marginTop: 'var(--space-3)' }}>
              ⚡ ข้อมูลจำลอง — สร้างโดย Demo Runtime
            </p>
          </div>
        )}

        {/* Options Ready */}
        {stage === 'complete' && options.length > 0 && (
          <div className="card">
            <div className="card__title">สร้างตัวเลือกเสร็จแล้ว</div>
            <p className="card__description" style={{ marginTop: 'var(--space-2)' }}>
              สร้าง {options.length} ตัวเลือกพร้อมเปรียบเทียบ
            </p>
            <button
              className="btn btn--primary btn--block"
              style={{ marginTop: 'var(--space-3)' }}
              onClick={() => navigate('/options')}
            >
              ดูตัวเลือก
            </button>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn--ghost" onClick={() => navigate('/station')}>
            กลับ
          </button>
        </div>
      </div>
    </div>
  )
}
