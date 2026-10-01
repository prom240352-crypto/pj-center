import { initService } from '../domain/init'
import { useAgents } from '../hooks'

export default function SettingsScreen() {
  const { agents } = useAgents()

  const handleClearData = async () => {
    if (window.confirm('ยืนยันการล้างข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      await initService.resetAll()
      window.location.reload()
    }
  }

  return (
    <div className="screen-shell">
      <div className="screen-shell__header">
        <div>
          <h1 className="screen-shell__title">ตั้งค่า</h1>
          <p className="screen-shell__subtitle">ภาษา ธีม ข้อมูล และการจัดการ</p>
        </div>
      </div>

      <div className="screen-shell__body">
        {/* Language */}
        <div className="card">
          <div className="card__title">ภาษา</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <button className="btn btn--primary" style={{ flex: 1 }}>ไทย</button>
            <button className="btn btn--secondary" style={{ flex: 1 }} disabled>English</button>
          </div>
          <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
            English จะพร้อมใช้งานในเวอร์ชันถัดไป
          </p>
        </div>

        {/* Theme */}
        <div className="card">
          <div className="card__title">ธีม</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <button className="btn btn--primary" style={{ flex: 1 }}>สว่าง</button>
            <button className="btn btn--secondary" style={{ flex: 1 }}>มืด</button>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <div className="card__title">ข้อมูลในเครื่อง</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span>ตัวแทน AI</span>
              <span style={{ fontWeight: 600 }}>{agents.length} ตัว</span>
            </div>
          </div>
          <button
            className="btn btn--secondary btn--block"
            style={{ marginTop: 'var(--space-4)' }}
            onClick={handleClearData}
          >
            ล้างข้อมูลทั้งหมด
          </button>
          <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
            ข้อมูลเก็บใน IndexedDB ของเบราว์เซอร์ หากล้างเบราว์เซอร์หรือถอนการติดตั้ง ข้อมูลจะสูญหาย
          </p>
        </div>

        {/* About */}
        <div className="card">
          <div className="card__title">เกี่ยวกับ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>เวอร์ชัน</span>
              <span style={{ fontWeight: 600 }}>0.4.0 (M4 Interactive Prototype)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>โหมด</span>
              <span style={{ fontWeight: 600 }}>Demo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Storage</span>
              <span style={{ fontWeight: 600 }}>IndexedDB (local)</span>
            </div>
          </div>
        </div>

        {/* PWA Install */}
        <div className="card">
          <div className="card__title">ติดตั้งแอป</div>
          <p className="card__description">
            เพิ่ม PJ Center ลงในหน้าหลักเพื่อใช้งานแบบแอป
          </p>
          <button className="btn btn--primary btn--block" style={{ marginTop: 'var(--space-3)' }}>
            ติดตั้ง PWA
          </button>
          <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
            ใช้เมนู "Add to Home Screen" ของเบราว์เซอร์
          </p>
        </div>
      </div>
    </div>
  )
}
