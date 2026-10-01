import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAgents } from '../hooks'
import { agentRepository } from '../storage/repositories'
import { validateAgent, getFieldError } from '../domain/validation'
import type { AgentDefinition, AgentRole, ValidationError } from '../domain/types'

export default function AgentEditScreen() {
  const navigate = useNavigate()
  const { agentId } = useParams()
  const { agents, refresh } = useAgents()
  const [name, setName] = useState('')
  const [role, setRole] = useState<AgentRole>('strategist')
  const [personality, setPersonality] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!agentId
  const existingAgent = agentId ? agents.find(a => a.id === agentId) : null

  useEffect(() => {
    if (existingAgent) {
      setName(existingAgent.name)
      setRole(existingAgent.role)
      setPersonality(existingAgent.personality)
      setSystemPrompt(existingAgent.systemPrompt)
    }
  }, [existingAgent])

  const handleSubmit = async () => {
    const result = validateAgent({ name, systemPrompt })
    if (!result.valid) {
      setErrors(result.errors)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (isEdit && existingAgent) {
        // Update existing agent
        await agentRepository.update({
          ...existingAgent,
          name,
          role,
          personality,
          systemPrompt,
          updatedAt: new Date().toISOString(),
        })
      } else {
        // Create new agent
        const newAgent: AgentDefinition = {
          id: crypto.randomUUID(),
          name,
          role,
          personality,
          systemPrompt,
          modelAdapterId: 'demo-simulator',
          permissionProfileId: role,
          enabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await agentRepository.create(newAgent)
      }

      await refresh()
      navigate('/agents')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">
            {isEdit ? 'แก้ไขตัวแทน' : 'สร้างตัวแทนใหม่'}
          </h1>
          <p className="screen-shell__subtitle">
            {isEdit ? 'แก้ไขข้อมูลตัวแทน AI' : 'เพิ่มตัวแทน AI ใหม่ในทีม'}
          </p>
        </div>
      </div>

      <div className="screen-shell__body">
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">ชื่อ *</label>
              <input
                id="name"
                className="form-input"
                type="text"
                placeholder="เช่น Product Strategist"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrors(errors.filter(err => err.field !== 'name'))
                }}
              />
              {getFieldError(errors, 'name') && (
                <span className="form-error">{getFieldError(errors, 'name')}</span>
              )}
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="role">บทบาท</label>
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value as AgentRole)}
              >
                <option value="strategist">นักกลยุทธ์</option>
                <option value="advocate">ตัวแทนผู้ใช้</option>
                <option value="architect">สถาปนิก</option>
                <option value="reviewer">ผู้ตรวจสอบ</option>
                <option value="synthesizer">ผู้สังเคราะห์</option>
              </select>
            </div>

            {/* Personality */}
            <div className="form-group">
              <label className="form-label form-label--optional" htmlFor="personality">บุคลิก</label>
              <input
                id="personality"
                className="form-input"
                type="text"
                placeholder="เช่น วิเคราะห์ตลาด มองหาโอกาส"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
              />
            </div>

            {/* System Prompt */}
            <div className="form-group">
              <label className="form-label" htmlFor="systemPrompt">System Prompt *</label>
              <textarea
                id="systemPrompt"
                className="form-textarea"
                placeholder="คำสั่งและบทบาทของตัวแทน..."
                value={systemPrompt}
                onChange={(e) => {
                  setSystemPrompt(e.target.value)
                  setErrors(errors.filter(err => err.field !== 'systemPrompt'))
                }}
                style={{ minHeight: '150px' }}
              />
              {getFieldError(errors, 'systemPrompt') && (
                <span className="form-error">{getFieldError(errors, 'systemPrompt')}</span>
              )}
              <span className="form-hint">คำสั่งที่กำหนดบทบาทและพฤติกรรมของตัวแทน</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="card" style={{ borderColor: 'var(--color-error)' }}>
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            className="btn btn--primary"
            disabled={loading}
            onClick={handleSubmit}
            style={{ flex: 1 }}
          >
            {loading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'สร้างตัวแทน'}
          </button>
          <button className="btn btn--ghost" onClick={() => navigate('/agents')}>
            ยกเลิก
          </button>
        </div>

        <p className="form-hint" style={{ textAlign: 'center' }}>
          ⚡ Model ทั้งหมดเป็น Demo Simulator — ไม่ได้เชื่อม AI จริง
        </p>
      </div>
    </div>
  )
}
