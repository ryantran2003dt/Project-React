import React, { useState } from 'react'
import { Copy, Check, Terminal, Globe, Server, Shield, Sparkles, CheckSquare, Square } from 'lucide-react'

export default function DeployGuideTab() {
  const [domain, setDomain] = useState('mydomain.com')
  const [vpsIp, setVpsIp] = useState('103.145.12.34')
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  const [checklist, setChecklist] = useState({
    ssh: false,
    apt: false,
    node: false,
    nginx: false,
    code: false,
    config: false,
    ssl: false,
  })

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const generatedNginxConfig = `server {
    listen 80;
    server_name ${domain || 'mydomain.com'} ${vpsIp ? vpsIp : ''};

    root /var/www/my-react-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}`

  const steps = [
    {
      id: 'ssh',
      title: 'Bước 1: Kết nối VPS qua SSH',
      desc: 'Mở Terminal / PowerShell và thực hiện câu lệnh kết nối:',
      code: `ssh root@${vpsIp || '103.145.12.34'}`,
    },
    {
      id: 'apt',
      title: 'Bước 2: Cập nhật hệ thống & Cài đặt phần mềm cần thiết',
      desc: 'Cập nhật kho phần mềm apt và cài đặt Nginx, Git, Curl:',
      code: `sudo apt update && sudo apt upgrade -y\nsudo apt install nginx git curl -y`,
    },
    {
      id: 'node',
      title: 'Bước 3: Cài đặt Node.js 20 LTS',
      desc: 'Cài đặt Node.js để thực hiện lệnh build ứng dụng React trên VPS:',
      code: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs`,
    },
    {
      id: 'code',
      title: 'Bước 4: Upload Code & Build dự án React',
      desc: 'Tải source code về thư mục /var/www và cài đặt thư viện:',
      code: `cd /var/www\n# Hoặc upload thư mục code của bạn lên đây\ngit clone <URL_REPOSITORY_GIT_CUA_BAN> my-react-app\ncd my-react-app\nnpm install\nnpm run build`,
    },
    {
      id: 'config',
      title: 'Bước 5: Tạo cấu hình Nginx Server Block',
      desc: 'Tạo file cấu hình mới tại /etc/nginx/sites-available/reactapp:',
      code: `sudo nano /etc/nginx/sites-available/reactapp`,
      extra: 'Dán đoạn Nginx Config bên dưới vào file nano:'
    },
    {
      id: 'ssl',
      title: 'Bước 6: Kích hoạt Nginx & Cài SSL Certbot (HTTPS)',
      desc: 'Tạo liên kết Nginx, kiểm tra cú pháp và kích hoạt SSL miễn phí:',
      code: `sudo ln -s /etc/nginx/sites-available/reactapp /etc/nginx/sites-enabled/\nsudo rm -f /etc/nginx/sites-enabled/default\nsudo nginx -t\nsudo systemctl restart nginx\n\n# Cài đặt SSL Let's Encrypt\nsudo apt install certbot python3-certbot-nginx -y\nsudo certbot --nginx -d ${domain || 'mydomain.com'}`,
    }
  ]

  const completedCount = Object.values(checklist).filter(Boolean).length

  return (
    <div className="tab-content">
      {/* Config Customizer Box */}
      <div className="customizer-box">
        <div className="customizer-title">
          <Sparkles size={20} color="#a855f7" />
          <span>Trình Tạo Lệnh Deploy Theo VPS & Domain Cá Nhân</span>
        </div>
        <p className="customizer-desc">
          Nhập IP VPS và Tên Miền của bạn bên dưới. Tất cả câu lệnh và file Nginx bên dưới sẽ tự động được tùy biến dành riêng cho bạn!
        </p>

        <div className="input-group-row">
          <div className="input-field">
            <label>
              <Server size={15} /> IP VPS của bạn:
            </label>
            <input 
              type="text" 
              value={vpsIp} 
              onChange={(e) => setVpsIp(e.target.value)} 
              placeholder="103.145.12.34"
            />
          </div>

          <div className="input-field">
            <label>
              <Globe size={15} /> Domain (Tên Miền):
            </label>
            <input 
              type="text" 
              value={domain} 
              onChange={(e) => setDomain(e.target.value)} 
              placeholder="tenmien.com"
            />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-banner">
        <div className="progress-info">
          <span>Tiến độ deploy thực tế: <strong>{completedCount} / {steps.length} bước</strong> hoàn thành</span>
        </div>
        <div className="progress-bar-wrap">
          <div 
            className="progress-fill-deploy" 
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Steps Accordion / List */}
      <div className="steps-container">
        {steps.map((step, idx) => {
          const isDone = checklist[step.id]
          return (
            <div key={step.id} className={`step-card ${isDone ? 'done' : ''}`}>
              <div className="step-header">
                <div className="step-checkbox" onClick={() => toggleCheck(step.id)}>
                  {isDone ? (
                    <CheckSquare size={22} className="check-icon done" />
                  ) : (
                    <Square size={22} className="check-icon" />
                  )}
                  <h3 className="step-title">{step.title}</h3>
                </div>
              </div>

              <p className="step-desc">{step.desc}</p>

              {step.code && (
                <div className="code-snippet-wrap">
                  <pre className="code-text">{step.code}</pre>
                  <button 
                    className="copy-btn" 
                    onClick={() => handleCopy(step.code, idx)}
                  >
                    {copiedIndex === idx ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                    {copiedIndex === idx ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>
              )}

              {step.id === 'config' && (
                <div className="config-preview-box">
                  <div className="config-preview-header">
                    <span>Nội dung Nginx config được tạo tự động:</span>
                    <button 
                      className="copy-btn"
                      onClick={() => handleCopy(generatedNginxConfig, 99)}
                    >
                      {copiedIndex === 99 ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                      {copiedIndex === 99 ? 'Đã chép Config' : 'Sao chép Nginx Config'}
                    </button>
                  </div>
                  <pre className="code-text nginx-highlight">{generatedNginxConfig}</pre>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
