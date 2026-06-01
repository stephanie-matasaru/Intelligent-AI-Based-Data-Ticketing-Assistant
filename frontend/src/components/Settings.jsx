import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Settings.css'

function Settings() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Change username state
  const [newUsername, setNewUsername]       = useState('')
  const [usernameMsg, setUsernameMsg]       = useState({ text: '', type: '' })
  const [usernameLoading, setUsernameLoading] = useState(false)

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent]         = useState(false)
  const [showNew, setShowNew]                 = useState(false)
  const [showConfirm, setShowConfirm]         = useState(false)
  const [passwordMsg, setPasswordMsg]         = useState({ text: '', type: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)

  async function handleChangeUsername() {
    setUsernameMsg({ text: '', type: '' })

    if (!newUsername.trim()) {
      setUsernameMsg({ text: 'Please enter a new username.', type: 'error' })
      return
    }
    if (newUsername.trim().length < 3) {
      setUsernameMsg({ text: 'Username must be at least 3 characters.', type: 'error' })
      return
    }

    setUsernameLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/auth/change-username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ new_username: newUsername.trim() })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.detail || 'Failed to change username')

      localStorage.setItem('user', JSON.stringify(data.user))
      setUsernameMsg({ text: 'Username updated successfully.', type: 'success' })
      setNewUsername('')
    } catch (err) {
      setUsernameMsg({ text: err.message, type: 'error' })
    }
    setUsernameLoading(false)
  }

  async function handleChangePassword() {
    setPasswordMsg({ text: '', type: '' })

    if (!currentPassword) {
      setPasswordMsg({ text: 'Please enter your current password.', type: 'error' })
      return
    }
    if (!newPassword) {
      setPasswordMsg({ text: 'Please enter a new password.', type: 'error' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters.', type: 'error' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'Passwords do not match.', type: 'error' })
      return
    }

    setPasswordLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.detail || 'Failed to change password')

      setPasswordMsg({ text: 'Password updated successfully.', type: 'success' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordMsg({ text: err.message, type: 'error' })
    }
    setPasswordLoading(false)
  }

  return (
    <div className="settings-page">
      <div className="settings-container">

        <div className="settings-header">
          <button className="settings-back" onClick={() => navigate(-1)} aria-label="Go back">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">Manage your account</p>
          </div>
          {user?.username && (
            <div className="settings-logged-in">
              <span className="material-symbols-outlined">account_circle</span>
              <span>Logged in as <strong>{user.username}</strong></span>
            </div>
          )}
        </div>

        {/* Change Username */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="material-symbols-outlined settings-card-icon">badge</span>
            <div>
              <h2 className="settings-card-title">Change Username</h2>
              <p className="settings-card-desc">Update the name used to log in</p>
            </div>
          </div>

          {usernameMsg.text && (
            <div className={`settings-msg settings-msg--${usernameMsg.type}`} role="alert">
              {usernameMsg.text}
            </div>
          )}

          <div className="settings-field">
            <label htmlFor="new-username" className="settings-label">New username</label>
            <input
              id="new-username"
              type="text"
              className="settings-input"
              placeholder="enter new username"
              value={newUsername}
              onChange={(e) => { setNewUsername(e.target.value); setUsernameMsg({ text: '', type: '' }) }}
              onKeyDown={(e) => e.key === 'Enter' && handleChangeUsername()}
            />
          </div>

          <button
            className="settings-btn"
            onClick={handleChangeUsername}
            disabled={usernameLoading}
          >
            {usernameLoading ? <span className="settings-spinner" aria-hidden="true" /> : 'Save Username'}
          </button>
        </div>

        {/* Change Password */}
        <div className="settings-card">
          <div className="settings-card-header">
            <span className="material-symbols-outlined settings-card-icon">lock</span>
            <div>
              <h2 className="settings-card-title">Change Password</h2>
              <p className="settings-card-desc">Must be at least 6 characters</p>
            </div>
          </div>

          {passwordMsg.text && (
            <div className={`settings-msg settings-msg--${passwordMsg.type}`} role="alert">
              {passwordMsg.text}
            </div>
          )}

          <div className="settings-field">
            <label htmlFor="current-password" className="settings-label">Current password</label>
            <div className="settings-input-wrapper">
              <input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                className="settings-input"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setPasswordMsg({ text: '', type: '' }) }}
              />
              <button
                type="button"
                className="settings-toggle"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="new-password" className="settings-label">New password</label>
            <div className="settings-input-wrapper">
              <input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                className="settings-input"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordMsg({ text: '', type: '' }) }}
              />
              <button
                type="button"
                className="settings-toggle"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="confirm-password" className="settings-label">Confirm new password</label>
            <div className="settings-input-wrapper">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                className="settings-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordMsg({ text: '', type: '' }) }}
                onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
              />
              <button
                type="button"
                className="settings-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            className="settings-btn"
            onClick={handleChangePassword}
            disabled={passwordLoading}
          >
            {passwordLoading ? <span className="settings-spinner" aria-hidden="true" /> : 'Save Password'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Settings