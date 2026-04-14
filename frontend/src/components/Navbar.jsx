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
    <nav className="dash-nav" role="navigation" aria-label="Main navigation">
      <div className="nav-left">
        <span className="nav-logo">AI Assistant</span>
        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'nav-link--active' : ''}`} aria-current={pathname === '/dashboard' ? 'page' : undefined}>Dashboard</Link>
          <Link to="/tickets" className={`nav-link ${pathname === '/tickets' ? 'nav-link--active' : ''}`} aria-current={pathname === '/tickets' ? 'page' : undefined}>Tickets</Link>
          <Link to="/graphs" className={`nav-link ${pathname === '/graphs' ? 'nav-link--active' : ''}`} aria-current={pathname === '/graphs' ? 'page' : undefined}>Archive</Link>
          <Link to="/chat" className={`nav-link ${pathname === '/chat' ? 'nav-link--active' : ''}`} aria-current={pathname === '/chat' ? 'page' : undefined}>Chatbot</Link>
        </div>
      </div>
      <div className="nav-right">
        <span className="material-symbols-outlined nav-icon" aria-hidden="true">notifications</span>
        <span className="material-symbols-outlined nav-icon" aria-hidden="true">settings</span>
        <div className="nav-avatar-wrapper" ref={dropdownRef}>
          <div
            className="nav-avatar"
            role="button"
            tabIndex={0}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onKeyDown={(e) => e.key === 'Enter' && setDropdownOpen(!dropdownOpen)}
            style={{ cursor: 'pointer' }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">person</span>
          </div>

          {dropdownOpen && (
            <div className="nav-dropdown" role="menu">
              <div
                className="nav-dropdown-item"
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && (navigate('/settings'), setDropdownOpen(false))}
                onClick={() => { navigate('/settings'); setDropdownOpen(false) }}>
                <span className="material-symbols-outlined" aria-hidden="true">settings</span>
                <span>Settings</span>
              </div>
              <div className="nav-dropdown-divider" role="separator" />
              <div
                className="nav-dropdown-item nav-dropdown-logout"
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
                onClick={handleLogout}>
                <span className="material-symbols-outlined" aria-hidden="true">logout</span>
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