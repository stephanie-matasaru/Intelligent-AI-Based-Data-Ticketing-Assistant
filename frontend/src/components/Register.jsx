import { useState, useEffect, useRef } from 'react'
import './Register.css'

function Register({ onClose, onSwitchToLogin }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let stars = []
    let shooters = []
    let t = 0

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initStars()
    }

    function initStars() {
      stars = Array.from({ length: 220 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.15,
        baseO: Math.random() * 0.55 + 0.1,
        speed: Math.random() * 0.008 + 0.003,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.85
          ? 'rgba(161,206,188,'
          : Math.random() > 0.7
          ? 'rgba(180,190,255,'
          : 'rgba(255,255,255,',
      }))
    }

    function spawnShooter() {
      if (Math.random() > 0.004) return
      shooters.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 4 + 3,
        angle: Math.PI / 5,
        life: 1,
      })
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.016

      stars.forEach(s => {
        const o = s.baseO * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.color + o + ')'
        ctx.fill()
      })

      spawnShooter()
      shooters = shooters.filter(sh => sh.life > 0)
      shooters.forEach(sh => {
        const dx = Math.cos(sh.angle) * sh.speed
        const dy = Math.sin(sh.angle) * sh.speed
        sh.x += dx; sh.y += dy; sh.life -= 0.025
        const grad = ctx.createLinearGradient(
          sh.x - Math.cos(sh.angle) * sh.len,
          sh.y - Math.sin(sh.angle) * sh.len,
          sh.x, sh.y
        )
        grad.addColorStop(0, 'rgba(255,255,255,0)')
        grad.addColorStop(1, `rgba(200,235,225,${sh.life * 0.7})`)
        ctx.beginPath()
        ctx.moveTo(sh.x - Math.cos(sh.angle) * sh.len, sh.y - Math.sin(sh.angle) * sh.len)
        ctx.lineTo(sh.x, sh.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2
        ctx.stroke()
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  async function handleSubmit() {
    if (!firstName || !username || !password) {
      alert('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      alert('Passwords do not match.')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || 'Registration failed')
        return
      }

      localStorage.removeItem('user')
      sessionStorage.removeItem('chat_messages')
      sessionStorage.removeItem('chat_group_id')
      alert('Account created! You can now log in.')
      onSwitchToLogin()

    } catch (error) {
      alert('Something went wrong. Please try again.')
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="register-page">
      <canvas ref={canvasRef} className="register-canvas" />
      <div className="register-nebula register-nebula-1" />
      <div className="register-nebula register-nebula-2" />

      <div className="register-hero-bg">
        <h1>AI Ticketing<span>Assistant</span></h1>
      </div>

      <div className="register-overlay" onClick={handleOverlayClick}>
        <div className="register-modal">

          <div className="register-modal-header">
            <span className="register-modal-icon material-symbols-outlined">person_add</span>
            <div>
              <h2>Create Account</h2>
              <p>Register to access the AI ticketing assistant</p>
            </div>
            <button className="register-close-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>

          <div className="register-row">
            <div className="register-field">
              <label>First Name</label>
              <input
                type="text"
                placeholder=""
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div className="register-field">
              <label>Last Name</label>
              <input
                type="text"
                placeholder=""
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="register-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="register-field">
            <label>Password</label>
            <div className="register-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button className="register-show-btn" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <div className="register-field">
            <label>Confirm Password</label>
            <div className="register-input-wrap">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
              <button className="register-show-btn" onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <button className="register-submit-btn" onClick={handleSubmit}>
            Create Account
          </button>

          <div className="register-divider" />

          <p className="register-switch-prompt">
            Already have an account?{' '}
            <span onClick={onSwitchToLogin}>Log in</span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register
