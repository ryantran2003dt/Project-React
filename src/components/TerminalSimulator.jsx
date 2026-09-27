import React, { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, Play, CornerDownLeft, Trash2 } from 'lucide-react'

export default function TerminalSimulator() {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to ReactVPS Interactive Linux Terminal v2.4.0' },
    { type: 'output', text: 'Gõ "help" để xem danh sách các lệnh được hỗ trợ (nginx, pm2, build, status, v.v.)\n' },
  ])
  const [input, setInput] = useState('')
  const terminalEndRef = useRef(null)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (e) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return

    const newHistory = [...history, { type: 'input', text: `root@vps-server:~# ${cmd}` }]

    const lower = cmd.toLowerCase()

    if (lower === 'clear') {
      setHistory([])
      setInput('')
      return
    }

    let responseText = ''

    if (lower === 'help') {
      responseText = `Các câu lệnh khả dụng:
  - help            : Hiển thị trợ giúp này
  - status / top    : Xem chỉ số CPU, RAM, Uptime hiện tại
  - nginx -t        : Kiểm tra file cấu hình Nginx
  - systemctl status nginx : Xem trạng thái Nginx Server
  - pm2 list        : Danh sách tiến trình PM2
  - node -v         : Phiên bản Node.js
  - npm run build   : Chạy thử nghiệm Build Vite React Project
  - clear           : Xóa màn hình terminal`
    } else if (lower === 'status' || lower === 'top') {
      responseText = `[VPS SYSTEM MONITOR]
  OS       : Ubuntu 22.04.3 LTS (x86_64)
  Uptime   : 4 days, 3 hours, 22 mins
  CPU Load : 0.14, 0.20, 0.18 (14% utilization)
  Memory   : 1.68 GB / 4.00 GB (42% used)
  Disk     : 14.5 GB / 50.0 GB (29% used)
  Nginx    : Active (running) - Ports 80, 443`
    } else if (lower === 'nginx -t') {
      responseText = `nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful`
    } else if (lower.includes('systemctl status nginx')) {
      responseText = `● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: active (running) since Sun 2026-09-27 10:14:02 UTC; 3h 21min ago
       Docs: man:nginx(8)
   Main PID: 1402 (nginx)
      Tasks: 3 (limit: 4652)
     Memory: 14.2M`
    } else if (lower === 'pm2 list' || lower === 'pm2 status') {
      responseText = `┌────┬────────────────┬─────────────┬─────────┬─────────%]
│ id │ name           │ mode        │ status  │ cpu     │ memory  │
├────┼────────────────┼─────────────┼─────────┼─────────┤─────────┤
│ 0  │ react-vps-app  │ fork        │ online  │ 0%      │ 38.5MB  │
└────┴────────────────┴─────────────┴─────────┴─────────┴─────────┘`
    } else if (lower === 'node -v' || lower === 'node --version') {
      responseText = 'v20.11.1'
    } else if (lower === 'npm run build' || lower === 'vite build') {
      responseText = `> my-react-vps-app@1.0.0 build
> vite build

vite v5.1.6 building for production...
transforming...
✓ 48 modules transformed.
dist/index.html                   0.52 kB │ gzip:  0.34 kB
dist/assets/index-D7x9L.css      12.40 kB │ gzip:  3.10 kB
dist/assets/index-B2k1L.js      148.80 kB │ gzip: 46.20 kB
✓ built in 1.18s`
    } else {
      responseText = `bash: ${cmd}: command not found. Gõ "help" để xem câu lệnh hợp lệ.`
    }

    newHistory.push({ type: 'output', text: responseText })
    setHistory(newHistory)
    setInput('')
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2>Giả Lập Terminal Linux VPS (Interactive Shell)</h2>
          <p>Thử nghiệm các câu lệnh quản trị server ngay trên trình duyệt trước khi chạy thật trên VPS.</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setHistory([])}>
          <Trash2 size={14} /> Xóa Màn Hình
        </button>
      </div>

      <div className="terminal-window">
        <div className="terminal-topbar">
          <div className="terminal-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="terminal-title">
            <TerminalIcon size={14} /> bash - root@vps-server:~
          </div>
        </div>

        <div className="terminal-body">
          {history.map((item, index) => (
            <div key={index} className={`terminal-line ${item.type}`}>
              <pre>{item.text}</pre>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <form className="terminal-input-bar" onSubmit={handleCommand}>
          <span className="prompt">root@vps-server:~#</span>
          <input 
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập lệnh (ví dụ: help, nginx -t, npm run build, status)..."
            autoFocus
          />
          <button type="submit" className="terminal-send-btn">
            <CornerDownLeft size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
