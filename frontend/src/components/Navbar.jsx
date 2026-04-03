import { Link, useLocation } from 'react-router-dom'
import './Graphs.css'

function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="dash-nav">
      <div className="nav-left">
        <span className="nav-logo">AI Assistant</span>
        <div className="nav-links">
          <a className="nav-link">Dashboard</a>
          <a className="nav-link">Tickets</a>
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