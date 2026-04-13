import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

   useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    try {
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (e) {
      console.error('Logout failed', e)
    }
    navigate('/')
  }

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
        <div className="nav-avatar-wrapper" ref={dropdownRef}>
        <div
          className="nav-avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined">person</span>
        </div>

        {dropdownOpen && (
          <div className="nav-dropdown">
            <div className="nav-dropdown-item" onClick={() => { navigate('/settings'); setDropdownOpen(false) }}>
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </div>
            <div className="nav-dropdown-divider" />
            <div className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
              <span>Log Out</span>
            </div>
          </div>
        )}
      </div>
      </div>
    </nav>
  )
}

export default Navbar