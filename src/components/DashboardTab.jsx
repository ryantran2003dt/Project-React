import React, { useState, useEffect } from 'react'
import { Cpu, HardDrive, Wifi, Shield, ArrowUpRight, CheckCircle2, Clock, RefreshCw, Zap } from 'lucide-react'

export default function DashboardTab() {
  const [metrics, setMetrics] = useState({
    cpu: 18,
    ram: 42,
    disk: 29,
    network: 1.4, // MB/s
    uptime: 14205, // seconds
    requestsPerMin: 340
  })

  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpu: Math.min(95, Math.max(8, prev.cpu + Math.floor(Math.random() * 9) - 4)),
        ram: Math.min(90, Math.max(30, prev.ram + (Math.random() > 0.5 ? 1 : -1))),
        network: parseFloat((Math.max(0.2, prev.network + (Math.random() * 0.4 - 0.2))).toFixed(1)),
        uptime: prev.uptime + 1,
        requestsPerMin: Math.max(120, prev.requestsPerMin + Math.floor(Math.random() * 15) - 7)
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleManualRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 800)
  }

  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600)
    const mins = Math.floor((totalSec % 3600) / 60)
    const secs = totalSec % 60
    return `${hrs}h ${mins}m ${secs}s`
  }

  return (
    <div className="tab-content">
      {/* Overview Banner */}
      <div className="dashboard-banner">
        <div className="banner-info">
          <h2>Hệ Thống Trạng Thái VPS & React App</h2>
          <p>
            Mô phỏng thông số hiệu năng ứng dụng React đang được phục vụ trên Nginx Web Server.
          </p>
        </div>
        <div className="banner-controls">
          <button 
            className={`btn btn-secondary ${isRefreshing ? 'spin' : ''}`}
            onClick={handleManualRefresh}
          >
            <RefreshCw size={16} />
            Làm mới chỉ số
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {/* CPU Card */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Sử dụng CPU</span>
            <div className="metric-icon cpu">
              <Cpu size={20} />
            </div>
          </div>
          <div className="metric-value">{metrics.cpu}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill cpu" 
              style={{ width: `${metrics.cpu}%` }}
            ></div>
          </div>
          <div className="metric-footer">
            <span>2 Cores vCPU</span>
            <span className="trend positive">Bình thường</span>
          </div>
        </div>

        {/* RAM Card */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Bộ nhớ RAM</span>
            <div className="metric-icon ram">
              <Zap size={20} />
            </div>
          </div>
          <div className="metric-value">{metrics.ram}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill ram" 
              style={{ width: `${metrics.ram}%` }}
            ></div>
          </div>
          <div className="metric-footer">
            <span>1.68 GB / 4 GB</span>
            <span className="trend positive">Tối ưu</span>
          </div>
        </div>

        {/* Disk Card */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Dung lượng Ổ đĩa</span>
            <div className="metric-icon disk">
              <HardDrive size={20} />
            </div>
          </div>
          <div className="metric-value">{metrics.disk}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill disk" 
              style={{ width: `${metrics.disk}%` }}
            ></div>
          </div>
          <div className="metric-footer">
            <span>14.5 GB / 50 GB NVMe</span>
            <span className="trend positive">Trống 35.5 GB</span>
          </div>
        </div>

        {/* Network Card */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Băng thông Mạng</span>
            <div className="metric-icon net">
              <Wifi size={20} />
            </div>
          </div>
          <div className="metric-value">{metrics.network} MB/s</div>
          <div className="progress-bar">
            <div 
              className="progress-fill net" 
              style={{ width: `${Math.min(100, metrics.network * 20)}%` }}
            ></div>
          </div>
          <div className="metric-footer">
            <span>{metrics.requestsPerMin} req/phút</span>
            <span className="trend positive">HTTP 200 OK</span>
          </div>
        </div>
      </div>

      {/* Quick Specs & Status */}
      <div className="specs-row">
        <div className="panel flex-1">
          <h3 className="panel-title">
            <Clock size={18} color="#818cf8" />
            Thông Tin Uptime & Môi Trường
          </h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-key">Thời gian chạy liên tục (Uptime):</span>
              <span className="info-val highlight">{formatTime(metrics.uptime)}</span>
            </div>
            <div className="info-item">
              <span className="info-key">Hệ điều hành VPS:</span>
              <span className="info-val">Ubuntu 22.04.3 LTS (x86_64)</span>
            </div>
            <div className="info-item">
              <span className="info-key">Web Server:</span>
              <span className="info-val">Nginx / 1.18.0 (Ubuntu)</span>
            </div>
            <div className="info-item">
              <span className="info-key">Node.js Runtime:</span>
              <span className="info-val">v20.11.1 LTS</span>
            </div>
            <div className="info-item">
              <span className="info-key">SSL / HTTPS:</span>
              <span className="info-val green-text">
                <CheckCircle2 size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Certbot Active (Let's Encrypt)
              </span>
            </div>
          </div>
        </div>

        <div className="panel flex-1">
          <h3 className="panel-title">
            <Shield size={18} color="#10b981" />
            Nhật Ký Hoạt Động (Live Activity)
          </h3>
          <div className="activity-feed">
            <div className="feed-item">
              <div className="feed-dot green"></div>
              <div className="feed-text">
                <strong>Nginx Service</strong> khởi chạy thành công trên Port 80 & 443
              </div>
              <div className="feed-time">Vừa xong</div>
            </div>
            <div className="feed-item">
              <div className="feed-dot blue"></div>
              <div className="feed-text">
                Đã nén file tĩnh HTML/CSS/JS (Gzip level 6 active)
              </div>
              <div className="feed-time">2 phút trước</div>
            </div>
            <div className="feed-item">
              <div className="feed-dot green"></div>
              <div className="feed-text">
                SSL Certificate tự động gia hạn thành công (30 ngày nữa)
              </div>
              <div className="feed-time">1 giờ trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
