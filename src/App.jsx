import React, { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import DashboardTab from './components/DashboardTab.jsx'
import VpsStatusTab from './components/VpsStatusTab.jsx'
import DeployGuideTab from './components/DeployGuideTab.jsx'
import TerminalSimulator from './components/TerminalSimulator.jsx'
import SettingsTab from './components/SettingsTab.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="app-layout">
      {/* Navigation Topbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container Area */}
      <main className="main-container">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'vps' && <VpsStatusTab />}
        {activeTab === 'guide' && <DeployGuideTab />}
        {activeTab === 'terminal' && <TerminalSimulator />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* App Footer */}
      <footer className="footer-bar">
        <div className="footer-content">
          <span>&copy; 2026 ReactVPS Management Suite &bull; Vite + React 18</span>
          <div className="footer-links">
            <span className="dot-sep">&bull;</span>
            <span className="green-text">System Status: Operational</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
