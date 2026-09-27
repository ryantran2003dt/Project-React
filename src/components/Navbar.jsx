import React from 'react'
import { Server, Rocket, Terminal, Layers, Settings, ShieldCheck, Activity } from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan (Dashboard)', icon: Activity },
    { id: 'vps', label: 'Trạng Thái VPS', icon: Server },
    { id: 'guide', label: 'Hướng Dẫn Deploy', icon: Layers },
    { id: 'terminal', label: 'Terminal Giả Lập', icon: Terminal },
    { id: 'settings', label: 'Cấu Hình System', icon: Settings },
  ]

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <Rocket size={22} color="#fff" />
        </div>
        <div className="brand-text">
          <span className="brand-title">ReactVPS Pro</span>
          <span className="brand-subtitle">Source Code & Management Suite</span>
        </div>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="nav-actions">
        <div className="status-pill">
          <span className="pulse-dot"></span>
          <span className="status-text">Server Ready</span>
        </div>
      </div>
    </header>
  )
}
