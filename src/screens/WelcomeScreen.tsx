import { useNavigate } from 'react-router-dom'

export default function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="welcome">
      {/* Demo Badge */}
      <div className="demo-badge">
        <span className="demo-badge__icon">⚡</span>
        <span>Demo — ข้อมูลจำลองทั้งหมด</span>
      </div>

      {/* Hero */}
      <div className="welcome__hero">
        <div className="welcome__logo">PJ</div>
        <h1 className="welcome__title">PJ Center</h1>
        <p className="welcome__tagline">สถานีระดมความคิดด้วยทีม AI</p>
      </div>

      {/* Info Card */}
      <div className="welcome__card card">
        <h2 className="welcome__card-title">ยินดีต้อนรับสู่โหมดทดลอง</h2>
        <p className="welcome__card-text">
          สร้างทีม AI หลายมุมมองเพื่อระดมความคิด วิจารณ์ และสังเคราะห์เป็น 3 ทางเลือก
          พร้อมข้อดี ข้อเสีย ความเสี่ยง และขั้นตอนถัดไป
        </p>
        <ul className="welcome__list">
          <li>ไม่ต้องล็อกอินหรือใช้ API key</li>
          <li>เนื้อหา AI ต้นทุน และการประมวลผลเป็นข้อมูลจำลอง</li>
          <li>ข้อมูลเก็บในเครื่อง Refresh ไม่หาย</li>
          <li>ทุกจุดสำคัญอยู่ภายใต้การอนุมัติของคุณ</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="welcome__actions">
        <button className="btn btn--primary btn--block" onClick={() => navigate('/station')}>
          เริ่มระดมความคิด
        </button>
        <button className="btn btn--secondary btn--block" onClick={() => navigate('/station')}>
          ดูตัวอย่างเซสชัน
        </button>
      </div>

      {/* Footer */}
      <p className="welcome__footer">
        ข้อมูลทั้งหมดในโหมด Demo เป็นข้อมูลจำลอง ไม่ใช่ผลลัพธ์จาก AI จริง
        และ Demo credits ไม่ใช่เงินจริง
      </p>
    </div>
  )
}
