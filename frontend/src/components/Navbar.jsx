import { Link, useLocation } from 'react-router-dom'
import './Graphs.css'

function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="dash-nav">
      <div className="nav-left">
        <span className="nav-logo">AI Assistant</span>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${pathname === '/graphs' ? 'nav-link--active' : ''}`}>Dashboard</Link>
          <a className="nav-link">Tickets</a>
          <a className="nav-link">Archive</a>
          <Link to="/chat" className={`nav-link ${pathname === '/chat' ? 'nav-link--active' : ''}`}>Intelligence</Link>
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