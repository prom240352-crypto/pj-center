import { useNavigate } from 'react-router-dom'
import { useAgents } from '../hooks'
import { agentRepository } from '../storage/repositories'
import { createDefaultAgents, getRoleLabel } from '../domain/defaults'

export default function AgentsScreen() {
  const navigate = useNavigate()
  const { agents, loading, refresh } = useAgents()

  const handleDuplicate = async (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent) return
    const copy = { ...agent, id: crypto.randomUUID(), name: `${agent.name} Copy`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    await agentRepository.create(copy)
    await refresh()
  }

  const handleReset = async () => {
    if (!window.confirm('ยืนยันการคืนค่าเริ่มต้น? ตัวแทนที่สร้างเพิ่มจะถูกลบ')) return
    for (const agent of agents) await agentRepository.delete(agent.id)
    for (const agent of createDefaultAgents()) await agentRepository.create(agent)
    await refresh()
  }

  const handleToggle = async (agentId: string, currentEnabled: boolean) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent) return

    await agentRepository.update({
      ...agent,
      enabled: !currentEnabled,
      updatedAt: new Date().toISOString(),
    })
    await refresh()
  }

  if (loading) {
    return (
      <div className="screen-shell">
        <div className="screen-shell__header">
          <h1 className="screen-shell__title">กำลังโหลด...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">จัดการตัวแทน AI</h1>
          <p className="screen-shell__subtitle">สร้าง แก้ไข ทำซ้ำ หรือปิดใช้งานตัวแทน</p>
        </div>
        <div className="screen-shell__actions">
          <button className="btn btn--primary" onClick={() => navigate('/agents/new')}>+ สร้างใหม่</button>
        </div>
      </div>

      <div className="screen-shell__body">
        {/* Agent List */}
        {agents.map((agent) => (
          <div key={agent.id} className="card card--interactive">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="card__title">{agent.name}</div>
                <div className="card__description">บทบาท: {getRoleLabel(agent.role)}</div>
              </div>
              <span className={`status-badge ${agent.enabled ? 'status-badge--idle' : 'status-badge--error'}`}>
                {agent.enabled ? 'เปิด' : 'ปิด'}
              </span>
            </div>
            <div style={{ marginTop: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                บุคลิก: {agent.personality}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                Model: {agent.modelAdapterId}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <button
                className="btn btn--ghost"
                style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)' }}
                onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.id}/edit`) }}
              >
                แก้ไข
              </button>
              <button className="btn btn--ghost" style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)' }} onClick={(e) => { e.stopPropagation(); handleDuplicate(agent.id) }}>
                ทำซ้ำ
              </button>
              <button
                className="btn btn--ghost"
                style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)' }}
                onClick={() => handleToggle(agent.id, agent.enabled)}
              >
                {agent.enabled ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
              </button>
            </div>
          </div>
        ))}

        {/* Reset */}
        <button
          className="btn btn--ghost btn--block"
          onClick={() => {
            if (window.confirm('ยืนยันการคืนค่าเริ่มต้น? ตัวแทนที่สร้างเพิ่มจะถูกลบ')) {
              void handleReset()
            }
          }}
        >
          คืนค่าเริ่มต้น
        </button>

        <p className="form-hint" style={{ textAlign: 'center' }}>
          ⚡ Model ทั้งหมดเป็น Demo Simulator — ไม่ได้เชื่อม AI จริง
        </p>
      </div>
    </div>
  )
}
