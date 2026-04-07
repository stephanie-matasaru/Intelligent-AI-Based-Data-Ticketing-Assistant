import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="dash-nav">
      <div className="nav-left">
        <span className="nav-logo">AI Assistant</span>
        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'nav-link--active' : ''}`}>Dashboard</Link>
          <Link to="/tickets" className={`nav-link ${pathname === '/tickets' ? 'nav-link--active' : ''}`}>Tickets</Link>
          <Link to="/graphs" className={`nav-link ${pathname === '/graphs' ? 'nav-link--active' : ''}`}>Archive</Link>
          <Link to="/chat" className={`nav-link ${pathname === '/chat' ? 'nav-link--active' : ''}`}>Chatbot</Link>
        </div>
      </div>
      <div className="nav-right">
        <span className="material-symbols-outlined nav-icon">notifications</span>
        <span className="material-symbols-outlined nav-icon">settings</span>
        <div className="nav-avatar">
          <span className="material-symbols-outlined">person</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar