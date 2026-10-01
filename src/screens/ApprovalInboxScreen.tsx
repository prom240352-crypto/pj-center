import { usePendingApprovals } from '../hooks'
import { approvalService } from '../domain/approval'
import { getStatusLabel } from '../domain/defaults'
import { formatDateTime } from '../domain/utils'
import { useState } from 'react'
import { workflowService } from '../domain/workflow'

export default function ApprovalInboxScreen() {
  const { approvals, loading, refresh } = usePendingApprovals()
  const [resolvingId, setResolvingId] = useState<string | null>(null)
  const [resolutionNote, setResolutionNote] = useState('')

  const handleApprove = async (id: string) => {
    setResolvingId(id)
    try {
      const request = await approvalService.approve(id, resolutionNote || 'อนุมัติแล้ว')
      await workflowService.applyApprovedAction(request)
      setResolutionNote('')
      await refresh()
    } catch (err) {
      console.error('Failed to approve:', err)
    } finally {
      setResolvingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setResolvingId(id)
    try {
      const request = await approvalService.reject(id, resolutionNote || 'ปฏิเสธแล้ว')
      await workflowService.applyRejectedAction(request)
      setResolutionNote('')
      await refresh()
    } catch (err) {
      console.error('Failed to reject:', err)
    } finally {
      setResolvingId(null)
    }
  }

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">กล่องอนุมัติ</h1>
          <p className="screen-shell__subtitle">คำขอที่รอการอนุมัติของคุณ</p>
        </div>
      </div>

      <div className="screen-shell__body">
        {loading ? (
          <div className="card">
            <p>กำลังโหลด...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">✅</div>
            <div className="empty-state__title">ไม่มีคำขออนุมัติ</div>
            <div className="empty-state__description">
              เมื่อมีคำขอ เช่น เพิ่มงบประมาณ หรือเริ่มรอบใหม่ จะแสดงที่นี่
            </div>
          </div>
        ) : (
          <>
            {/* Resolution Note Input */}
            <div className="card">
              <div className="card__title">หมายเหตุ (ไม่บังคับ)</div>
              <input
                className="form-input"
                type="text"
                placeholder="เพิ่มหมายเหตุสำหรับการอนุมัติหรือปฏิเสธ..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                style={{ marginTop: 'var(--space-2)' }}
              />
            </div>

            {/* Approval Requests */}
            {approvals.map((approval) => (
              <div key={approval.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="card__title">
                    {approval.action === 'increase-budget' && 'ขออนุมัติเพิ่มงบประมาณ'}
                    {approval.action === 'new-round' && 'ขออนุมัติเริ่มรอบใหม่'}
                    {approval.action === 'merge-options' && 'ขออนุมัติรวมตัวเลือก'}
                    {approval.action === 'retry' && 'ขออนุมัติลองใหม่'}
                  </div>
                  <span className={`status-badge status-badge--${approval.status === 'pending' ? 'waiting' : 'complete'}`}>
                    {getStatusLabel(approval.status)}
                  </span>
                </div>
                <p className="card__description" style={{ marginTop: 'var(--space-2)' }}>
                  {approval.reason}
                </p>
                <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  ผู้ขอ: {approval.requesterId} · ผลลัพธ์: {approval.resolutionNote || 'รอผลการอนุมัติ'}
                </div>
                <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  ผลกระทบ: {approval.estimatedImpact} | สร้างเมื่อ: {formatDateTime(approval.createdAt)}
                </div>
                {approval.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                    <button
                      className="btn btn--primary"
                      style={{ flex: 1 }}
                      onClick={() => handleApprove(approval.id)}
                      disabled={resolvingId === approval.id}
                    >
                      {resolvingId === approval.id ? 'กำลังดำเนินการ...' : 'อนุมัติ'}
                    </button>
                    <button
                      className="btn btn--secondary"
                      style={{ flex: 1 }}
                      onClick={() => handleReject(approval.id)}
                      disabled={resolvingId === approval.id}
                    >
                      {resolvingId === approval.id ? 'กำลังดำเนินการ...' : 'ปฏิเสธ'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Info */}
        <div className="card">
          <div className="card__title">นโยบายการอนุมัติ</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <li style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingLeft: 'var(--space-4)', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              เพิ่มงบประมาณ Demo ต้องขออนุมัติ
            </li>
            <li style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingLeft: 'var(--space-4)', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              เริ่มรอบใหม่หรือรวมตัวเลือกต้องขออนุมัติ
            </li>
            <li style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingLeft: 'var(--space-4)', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              Agent ไม่สามารถอนุมัติตนเองได้
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
