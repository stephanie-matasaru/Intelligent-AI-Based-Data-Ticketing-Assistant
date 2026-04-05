import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [modalOpen, setModalOpen]       = useState(false)
  const [username, setUsername]         = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg]         = useState('')
  const [loading, setLoading]           = useState(false)
  const [success, setSuccess]           = useState(false)
  const [shake, setShake]               = useState(false)
  const navigate = useNavigate()

  function openModal() {
    setModalOpen(true)
    setErrorMsg('')
  }

  function closeModal() {
    setModalOpen(false)
    setErrorMsg('')
    setUsername('')
    setPassword('')
    setShowPassword(false)
    setSuccess(false)
  }

  function showError(msg) {
    setErrorMsg(msg)
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  function validate() {
    if (!username.trim()) { showError('Please enter your username.'); return false }
    if (!password) { showError('Please enter your password.'); return false }
    if (password.length < 6) { showError('Password must be at least 6 characters.'); return false }
    return true
  }

async function handleSubmit() {
  setErrorMsg('')
  if (!validate()) return
  setLoading(true)

  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed')
    }

    localStorage.setItem('user', JSON.stringify(data.user))
    setSuccess(true)
    setTimeout(() => { navigate('/chat') }, 800)

  } catch (error) {
    showError(error.message)
  }

  setLoading(false)
}

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) closeModal()
  }

  return (
    <div className="h-full font-sans antialiased text-white">
      <main className="relative h-full w-full bg-main-image flex items-center justify-center p-6 overflow-hidden">

        <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md w-full">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              AI Ticketing<br />
              <span className="text-ai-mint">Assistant</span>
            </h1>
          </div>

          <button
            className="btn-active mt-2 px-12 py-3.5 bg-ai-mint text-ai-dark font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 focus:outline-none"
            type="button"
            onClick={openModal}
          >
            Log In
          </button>
        </div>
      </main>

      {modalOpen && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={handleBackdropClick}
        >
          <div className={`modal-card w-full max-w-sm bg-[#0f1117] border border-white/10 rounded-2xl p-8 shadow-2xl ${shake ? 'shake' : ''}`}>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Log in to your account</h2>
                <p className="text-white/30 text-xs mt-1">AI Ticketing Assistant</p>
              </div>
              <button onClick={closeModal} className="text-white/20 hover:text-white transition-colors text-2xl leading-none">&times;</button>
            </div>

            {errorMsg && (
              <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2" htmlFor="username">Username</label>
                <input
                  id="username" type="text" placeholder="your_username"
                  value={username} onChange={(e) => { setUsername(e.target.value); setErrorMsg('') }}
                  onKeyDown={handleKeyDown}
                  className="input-field w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={(e) => { setPassword(e.target.value); setErrorMsg('') }}
                    onKeyDown={handleKeyDown}
                    className="input-field w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-16 text-white placeholder-white/20 text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs uppercase tracking-wider">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <button type="button" onClick={handleSubmit} disabled={loading}
                className={`btn-active w-full py-3.5 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${success ? 'bg-ai-mint text-ai-dark' : 'bg-ai-mint text-ai-dark hover:bg-white'}`}>
                {loading ? <span className="spinner" /> : success ? 'Logged In' : 'Log In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login