import React, { useState } from 'react'
import { Settings, Save, CheckCircle2, Shield, Sliders, Database, Key } from 'lucide-react'

export default function SettingsTab() {
  const [settings, setSettings] = useState({
    siteName: 'My VPS React Application',
    vpsPort: '80',
    enableGzip: true,
    enableHttps: true,
    nodeEnv: 'production',
    apiBaseUrl: 'https://api.mydomain.com/v1',
  })

  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2>Cấu Hình Môi Trường & Build Preferences</h2>
          <p>Thiết lập biến môi trường `.env` và tùy chọn tối ưu hóa build ứng dụng React.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        <div className="panel">
          <h3 className="panel-title">
            <Sliders size={18} color="#6366f1" />
            Cấu Hình Chung Ứng Dụng
          </h3>

          <div className="form-group">
            <label>Tên Ứng Dụng (Page Title)</label>
            <input 
              type="text" 
              className="form-control"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>API Base URL (VITE_API_BASE_URL)</label>
            <input 
              type="text" 
              className="form-control"
              value={settings.apiBaseUrl}
              onChange={(e) => setSettings({ ...settings, apiBaseUrl: e.target.value })}
            />
          </div>

          <div className="form-group-row">
            <div className="form-group flex-1">
              <label>Môi trường (NODE_ENV)</label>
              <select 
                className="form-control"
                value={settings.nodeEnv}
                onChange={(e) => setSettings({ ...settings, nodeEnv: e.target.value })}
              >
                <option value="production">Production (Tối ưu hóa dung lượng)</option>
                <option value="development">Development (Debug mode)</option>
                <option value="staging">Staging (Kiểm thử)</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Cổng Nginx Mặc Định</label>
              <input 
                type="text" 
                className="form-control"
                value={settings.vpsPort}
                onChange={(e) => setSettings({ ...settings, vpsPort: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="panel style-margin-top">
          <h3 className="panel-title">
            <Shield size={18} color="#10b981" />
            Tùy Chọn Bảo Mật & Nén Web Server
          </h3>

          <div className="toggle-option">
            <div>
              <div className="toggle-label">Bật Nén Gzip (Nginx Gzip Level 6)</div>
              <div className="toggle-desc">Tự động nén dung lượng file JS/CSS giảm đến 70% băng thông.</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.enableGzip}
              onChange={(e) => setSettings({ ...settings, enableGzip: e.target.checked })}
            />
          </div>

          <div className="toggle-option">
            <div>
              <div className="toggle-label">Tự Động Chuyển Hướng HTTP sang HTTPS</div>
              <div className="toggle-desc">Cấu hình Nginx redirect tất cả truy cập Port 80 sang Port 443 SSL.</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.enableHttps}
              onChange={(e) => setSettings({ ...settings, enableHttps: e.target.checked })}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saved ? 'Đã Lưu Cấu Hình!' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </form>
    </div>
  )
}
