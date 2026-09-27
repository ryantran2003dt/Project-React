import React, { useState } from 'react'
import { Server, Play, Square, RotateCw, CheckCircle2, AlertTriangle, ShieldCheck, Lock } from 'lucide-react'

export default function VpsStatusTab() {
  const [services, setServices] = useState([
    { id: 'nginx', name: 'Nginx Web Server', status: 'running', port: '80, 443', memory: '14.2 MB', pid: 1402 },
    { id: 'sshd', name: 'SSH Daemon (sshd)', status: 'running', port: '22', memory: '4.8 MB', pid: 890 },
    { id: 'ufw', name: 'UFW Firewall', status: 'running', port: 'Filtering', memory: '2.1 MB', pid: 412 },
    { id: 'pm2', name: 'PM2 Process Manager', status: 'running', port: '3000', memory: '38.5 MB', pid: 2190 },
  ])

  const toggleService = (id) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'running' ? 'stopped' : 'running'
        return { ...s, status: nextStatus }
      }
      return s
    }))
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2>Quản Lý Dịch Vụ & Cổng VPS</h2>
          <p>Kiểm tra danh sách các service đang chạy trên Linux VPS và phân bổ cổng (Port allocation).</p>
        </div>
      </div>

      {/* Services List Grid */}
      <div className="services-grid">
        {services.map((svc) => (
          <div key={svc.id} className={`service-card ${svc.status}`}>
            <div className="service-header">
              <div className="service-title-wrap">
                <Server size={20} className="service-icon" />
                <span className="service-name">{svc.name}</span>
              </div>
              <span className={`status-badge ${svc.status}`}>
                {svc.status === 'running' ? (
                  <>
                    <CheckCircle2 size={13} /> Active
                  </>
                ) : (
                  <>
                    <AlertTriangle size={13} /> Stopped
                  </>
                )}
              </span>
            </div>

            <div className="service-details">
              <div className="detail-item">
                <span className="label">PID:</span>
                <span className="value">#{svc.pid}</span>
              </div>
              <div className="detail-item">
                <span className="label">Cổng (Port):</span>
                <span className="value">{svc.port}</span>
              </div>
              <div className="detail-item">
                <span className="label">RAM tiêu thụ:</span>
                <span className="value">{svc.status === 'running' ? svc.memory : '0 MB'}</span>
              </div>
            </div>

            <div className="service-actions">
              <button 
                className={`btn btn-sm ${svc.status === 'running' ? 'btn-danger' : 'btn-success'}`}
                onClick={() => toggleService(svc.id)}
              >
                {svc.status === 'running' ? (
                  <>
                    <Square size={14} /> Dừng Service
                  </>
                ) : (
                  <>
                    <Play size={14} /> Khởi Chạy
                  </>
                )}
              </button>

              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => alert(`Khởi động lại ${svc.name} thành công!`)}
                disabled={svc.status !== 'running'}
              >
                <RotateCw size={14} /> Reload
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ports Table */}
      <div className="panel style-margin-top">
        <h3 className="panel-title">
          <Lock size={18} color="#06b6d4" />
          Bảng Mở Cổng Tường Lửa (UFW Open Ports)
        </h3>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Cổng (Port)</th>
                <th>Giao Thức</th>
                <th>Dịch Vụ Sử Dụng</th>
                <th>Trạng Thái UFW</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>80</code></td>
                <td>TCP</td>
                <td>Nginx (HTTP Web traffic)</td>
                <td><span className="tag green">ALLOW IN</span></td>
                <td><span className="text-muted">Bắt buộc</span></td>
              </tr>
              <tr>
                <td><code>443</code></td>
                <td>TCP</td>
                <td>Nginx (HTTPS Secure traffic)</td>
                <td><span className="tag green">ALLOW IN</span></td>
                <td><span className="text-muted">Bắt buộc</span></td>
              </tr>
              <tr>
                <td><code>22</code></td>
                <td>TCP</td>
                <td>SSH Remote Access</td>
                <td><span className="tag green">ALLOW IN</span></td>
                <td><span className="text-muted">Khuyên dùng giới hạn IP</span></td>
              </tr>
              <tr>
                <td><code>3000</code></td>
                <td>TCP</td>
                <td>React Dev Server / PM2 Serve</td>
                <td><span className="tag yellow">LOCAL ONLY</span></td>
                <td><span className="text-muted">Nginx Proxy Pass</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
