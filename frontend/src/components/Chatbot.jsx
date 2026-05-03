import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import './Chatbot.css'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts'

const CHART_COLORS = ['#A1CEBC', '#7b6cf6', '#e09a3a', '#e05c5c', '#4a9edd']

function renderChart(chartSpec) {
  if (!chartSpec || chartSpec.error) return null

  const { chart_type, title, x_key, y_key, data } = chartSpec

  return (
    <div style={{ marginTop: '12px' }}>
      {title && (
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={200}>
        {chart_type === 'bar' ? (
          <BarChart data={data} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis dataKey={x_key} stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#1a1a35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              cursor={{ fill: '#ffffff05' }}
            />
            <Bar dataKey={y_key} radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : chart_type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis dataKey={x_key} stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#1a1a35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              cursor={{ stroke: '#A1CEBC', strokeWidth: 1 }}
            />
            <Line type="monotone" dataKey={y_key} stroke="#A1CEBC" strokeWidth={2.5}
              dot={{ fill: '#A1CEBC', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#4fc093' }} />
          </LineChart>
        ) : chart_type === 'pie' ? (
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey={y_key} nameKey={x_key} paddingAngle={3}>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1a1a35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            />
          </PieChart>
        ) : null}
      </ResponsiveContainer>
    </div>
  )
}

function saveToWorkspace(msg) {
  const existing = JSON.parse(localStorage.getItem('workspace_items') || '[]')
  const item = {
    id: Date.now(),
    savedAt: new Date().toISOString(),
    text: msg.text,
    chart_spec: msg.chart_spec || null,
    excel_spec: msg.excel_spec || null,
    label: msg.chart_spec?.title || msg.text?.slice(0, 60) || 'Saved insight',
    type: msg.chart_spec ? 'chart' : msg.excel_spec ? 'excel' : 'text',
  }
  localStorage.setItem('workspace_items', JSON.stringify([item, ...existing]))
}

function Chatbot() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chat_messages')
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: 'ai',
        text: "Hello! I'm your AI Ticketing Assistant. Describe your issue and I'll help you resolve it.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [groupId, setGroupId] = useState(() => {
    return sessionStorage.getItem('chat_group_id') || null
  })
  const [isListening, setIsListening] = useState(false)
  const [attachedFile, setAttachedFile] = useState(null)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [sessions, setSessions] = useState([])
  const [sessionMessages, setSessionMessages] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)
  const [savedIds, setSavedIds] = useState([])
  const chartRefs = useRef({})

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user?.user_id || 1

  useEffect(() => {
    sessionStorage.setItem('chat_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (groupId) sessionStorage.setItem('chat_group_id', groupId)
  }, [groupId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    sessionStorage.removeItem('chat_messages')
    sessionStorage.removeItem('chat_group_id')
    setGroupId(null)
    setMessages([{
      id: 1,
      type: 'ai',
      text: "Hello! I'm your AI Ticketing Assistant. Describe your issue and I'll help you resolve it.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])

    fetch('http://localhost:8000/api/auth/me', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) navigate('/')
      })
      .catch(() => navigate('/'))
  }, [])

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend()
  }

  function handleMic() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome.')
      return
    }
  

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
    }

    recognition.onerror = () => setIsListening(false)

    recognition.start()
  }

  function handleNewChat() {
    sessionStorage.removeItem('chat_messages')
    sessionStorage.removeItem('chat_group_id')
    setGroupId(null)
    setMessages([{
      id: 1,
      type: 'ai',
      text: "Hello! I'm your AI Ticketing Assistant. Describe your issue and I'll help you resolve it.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setShowHistory(false)
    setSelectedSession(null)
}

  function buildHistory(messages) {
    return messages
      .filter(msg => msg.type === 'user' || msg.type === 'ai')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
  }

  async function fetchSessions() {
  const res = await fetch(`http://localhost:8000/api/chat/sessions/${userId}`)
  const data = await res.json()
  setSessions(Array.isArray(data) ? data : [])
  setShowHistory(true)
  setSelectedSession(null)
  setSessionMessages([])
}

 async function fetchMessages(groupId) {
  try {
    const res = await fetch(`http://localhost:8000/api/chat/messages/${groupId}`)
    const data = await res.json()
    setSessionMessages(Array.isArray(data) ? data : [])
    setSelectedSession(groupId)
  } catch (error) {
    console.error('Error fetching messages:', error)
  }
}

  function handleDownload(sqlScript, filename) {
    const blob = new Blob([sqlScript], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

async function handleUpload() {
  if (!attachedFile) return null

  const formData = new FormData()
  formData.append('file', attachedFile)
  formData.append('user_id', userId)
  if (groupId) formData.append('group_id', groupId)

  const response = await fetch('http://localhost:8000/api/upload/', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    let errorMessage = 'Something went wrong while processing the file.'
    try {
      const errorData = await response.json()
      errorMessage = errorData.detail || errorMessage
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(errorMessage)
  }

  const data = await response.json()

  if (data.group_id) setGroupId(data.group_id)

  return data.parsed_file
}

  async function handleSend() {
    if ((!input.trim() && !attachedFile) || isTyping) return

    const question = input.trim() || `Please analyze the uploaded file: ${attachedFile.name}`

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: attachedFile ? `${question}\nAttached file: ${attachedFile.name}` : question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)

    try {
    let parsedFiles = []

    if (attachedFile) {
      const parsedFile = await handleUpload()
      if (parsedFile) parsedFiles = [parsedFile]
    }

      const response = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          history: buildHistory(messages),
          user_id: userId,
          group_id: groupId,
          files: parsedFiles
        })
      })

      if (!response.ok) {
        let errorMessage = 'Something went wrong while contacting the assistant.'
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
        } catch {
          // ignore JSON parse failure
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.group_id) {
        setGroupId(data.group_id)
      }

      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: data.explanation || 'No response received.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chart_spec: data.chart_spec || null,
        excel_spec: data.excel_spec || null
      }

      setMessages(prev => [...prev, aiMsg])
      setAttachedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (voiceEnabled && data.explanation) {
        const utterance = new SpeechSynthesisUtterance(data.explanation)
        utterance.lang = 'en-US'
        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: error.message || 'Unable to reach the backend.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }
  async function exportChart(ref, filename) {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(ref, { backgroundColor: '#1a1a2e' })
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleDownloadExcel = (base64String, filename) => {
    try {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || 'ticket_export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating Excel download:", error);
    }
  };

  return (
    <div className="bg-[#0f0f1e] text-white font-body h-screen flex flex-col overflow-hidden">

      <Navbar />

      <main className="flex flex-1 overflow-hidden">

        {/* Chat Section */}
        <section className="flex-grow flex flex-col px-4 md:px-12 py-8 max-w-5xl mx-auto w-full overflow-hidden">

          {/* Chat Header */}
          <div className="mb-6 flex items-center justify-between flex-shrink-0">
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight text-white mb-1">
                Active Ticket Session
              </h1>
              <div className="flex items-center gap-2">
                <div className="ai-pulse"></div>
                <span className="font-label text-[0.6875rem] uppercase tracking-widest text-[#A1CEBC]">
                  AI Analyst Active
                </span>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-white/40 block mb-1">
                Session ID
              </span>
              <span className="font-mono text-sm text-white/60">
                {groupId ? groupId : '#AX-992-KLD'}
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-6 overflow-y-auto pb-4">

            {messages.map((msg) => (
              msg.type === 'user' ? (
                <div key={msg.id} className="flex justify-end group">
                  <div className="max-w-[45%] bg-gradient-to-br from-[#000000] to-[#6B4D90]/80 p-4 rounded-2xl rounded-tr-none shadow-xl">
                    <p className="text-white leading-relaxed">{msg.text}</p>
                    <div className="mt-3 flex justify-end items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="font-label text-[0.625rem] text-white/50">{msg.time}</span>
                      <span className="material-symbols-outlined text-[14px]">done_all</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-[#000000] to-[#28074C] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      robot
                    </span>
                  </div>
                  <div className="max-w-[85%]">
                   <div className="bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] backdrop-blur-xl p-6 rounded-2xl rounded-tl-none shadow-2xl">

                      <p className="text-white/80 leading-relaxed">
                        {msg.text ? msg.text.replace("[ACTION: DOWNLOAD_EXCEL]", "").trim() : ""}
                      </p>

                      {/* Render the excel download button if the tag and data exist */}
                      {msg.text && msg.text.includes("[ACTION: DOWNLOAD_EXCEL]") && msg.excel_spec && msg.excel_spec.file_data_base64 && (
                        <div className="mt-4">
                          <button 
                            onClick={() => handleDownloadExcel(msg.excel_spec.file_data_base64, msg.excel_spec.filename)}
                            className="bg-[#4fc093] hover:bg-[#A1CEBC] text-[#0f0f1e] font-bold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 w-fit transition-colors shadow-lg"
                          >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Download Spreadsheet
                          </button>
                        </div>
                      )}
                      {msg.chart_spec && (
                        <div ref={el => { if (el) chartRefs.current[msg.id] = el }}>
                          {renderChart(msg.chart_spec)}
                        </div>
                      )}
                      {(msg.chart_spec || msg.excel_spec) && (
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            onClick={() => {
                              saveToWorkspace(msg)
                              setSavedIds(prev => [...prev, msg.id])
                            }}
                            disabled={savedIds.includes(msg.id)}
                            className="flex items-center gap-1 text-[0.625rem] uppercase tracking-widest transition-colors"
                            style={{ color: savedIds.includes(msg.id) ? '#4fc093' : 'rgba(255,255,255,0.3)' }}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {savedIds.includes(msg.id) ? 'bookmark' : 'bookmark_add'}
                            </span>
                            {savedIds.includes(msg.id) ? 'Saved to Workspace' : 'Save to Workspace'}
                          </button>

                          {msg.chart_spec && (
                            <button
                              onClick={() => exportChart(chartRefs.current[msg.id], `chart-${msg.id}.png`)}
                              className="flex items-center gap-1 text-[0.625rem] uppercase tracking-widest transition-colors"
                              style={{ color: 'rgba(255,255,255,0.3)' }}
                            >
                              <span className="material-symbols-outlined text-[14px]">download</span>
                              Export PNG
                            </button>
                          )}
                        </div>
                      )}
                      {msg.sql_script && (
                        <div className="mt-4">
                          <pre className="bg-black/40 text-[#A1CEBC] text-xs rounded-xl p-4 overflow-auto max-h-48 font-mono leading-relaxed border border-white/10">
                            {msg.sql_script}
                          </pre>
                          <button
                            onClick={() => handleDownload(msg.sql_script, msg.script_filename)}
                            className="mt-3 flex items-center gap-2 bg-gradient-to-br from-[#1a1a35] to-[#3E2162] hover:to-[#6B4D90] px-4 py-2 rounded-xl text-white/80 hover:text-white text-xs font-label uppercase tracking-widest transition-all border border-white/10"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            Download {msg.script_filename}
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="mt-2 block font-label text-[0.625rem] text-white/30 text-left">
                      AI Analyst • {msg.time}
                    </span>
                  </div>
                </div>
              )
            ))}

            {isTyping && (
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-[#000000] to-[#28074C] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    robot
                  </span>
                </div>
                <div className="bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] px-6 py-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1 items-center">
                    <span className="typing-dot"></span>
                    <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                    <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 pt-4">
            <div className="bg-[#1a1a35] backdrop-blur-md border border-white/10 p-1.5 rounded-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.3)] max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.pdf,.docx"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => setAttachedFile(e.target.files[0] || null)}
                />
                <button
                  className="h-10 w-10 flex items-center justify-center text-white/30 hover:text-white transition-colors"
                  onClick={() => fileInputRef.current.click()}
                >
                  <span className="material-symbols-outlined">
                    {attachedFile ? 'attach_file' : 'add_circle'}
                  </span>
                </button>
                {attachedFile && (
                  <span className="text-xs text-white/50 truncate max-w-[120px]">
                    {attachedFile.name}
                  </span>
                )}
                <input
                  className="flex-grow bg-transparent border-none outline-none text-white placeholder:text-white/30 font-body py-4 text-sm"
                  placeholder="Type an instruction for the analyst..."
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleMic}
                  className="h-10 w-10 flex items-center justify-center transition-colors"
                  style={{ color: isListening ? '#4fc093' : 'rgba(255,255,255,0.3)' }}
                >
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button
                  onClick={() => voiceEnabled ? (window.speechSynthesis.cancel(), setVoiceEnabled(false)) : setVoiceEnabled(true)}
                  className="h-10 w-10 flex items-center justify-center transition-colors"
                  style={{ color: voiceEnabled ? '#4fc093' : 'rgba(255,255,255,0.3)' }}
                  title={voiceEnabled ? 'Voice on' : 'Voice off'}
                >
                  <span className="material-symbols-outlined">record_voice_over</span>
                </button>
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-br from-[#000000] to-[#3E2162] h-12 w-12 flex items-center justify-center rounded-xl text-white shadow-lg shadow-blue-900/20 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    send
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="w-72 bg-[#13132a] flex flex-col py-8 border-l border-white/5 shadow-[-20px_0px_40px_rgba(0,0,0,0.4)] flex-shrink-0 overflow-y-auto">
          <div className="px-8 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#000000] to-[#28074C] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  robot
                </span>
              </div>
              <div>
                <p className="font-headline text-white font-bold text-sm tracking-tight">AI Analyst</p>
                <p className="font-label text-[0.625rem] text-[#A1CEBC] uppercase tracking-widest">System Active</p>
              </div>
            </div>
          </div>

          <nav className="mt-8">
            {/* Active Chat */}
            <div
              onClick={() => { setShowHistory(false); setSelectedSession(null); setSessionMessages([]) }}
              className={`mx-4 my-1 p-4 flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200 ${
                !showHistory
                  ? 'bg-gradient-to-br from-[#000000] to-[#6B4D90] text-white shadow-lg shadow-blue-900/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <span className="material-symbols-outlined" style={!showHistory ? { fontVariationSettings: "'FILL' 1" } : {}}>chat_bubble</span>
              <span className="font-body text-sm uppercase tracking-widest">Active Chat</span>
            </div>

            {/* New Chat */}
            <div
              onClick={handleNewChat}
              className="mx-4 my-1 p-4 flex items-center gap-3 rounded-xl cursor-pointer text-white/50 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span className="font-body text-sm uppercase tracking-widest">New Chat</span>
            </div>

            {/* Chat History */}
            <div
              onClick={fetchSessions}
              className={`mx-4 my-1 p-4 flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200 ${
                showHistory
                  ? 'bg-gradient-to-br from-[#000000] to-[#6B4D90] text-white shadow-lg shadow-blue-900/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <span className="material-symbols-outlined" style={showHistory ? { fontVariationSettings: "'FILL' 1" } : {}}>history</span>
              <span className="font-body text-sm uppercase tracking-widest">Chat History</span>
            </div>

            {/* Session list */}
            {showHistory && !selectedSession && (
              <div className="mx-4 mt-2 space-y-1">
                {sessions.length === 0 && (
                  <p className="text-white/30 text-xs px-2 py-3">No past sessions found.</p>
                )}
                {sessions.map((s) => (
                  <div
                    key={s.group_id}
                    onClick={() => fetchMessages(s.group_id)}
                    className="p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
                  >
                    <p className="text-white/70 text-xs font-mono truncate">{s.group_id.slice(0, 8)}...</p>
                    <p className="text-white/30 text-[0.6rem] mt-1">{s.started_at.slice(0, 16)} • {s.message_count} messages</p>
                  </div>
                ))}
              </div>
            )}

            {/* Messages in selected session */}
            {showHistory && selectedSession && (
              <div className="mx-4 mt-2">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-white/40 hover:text-white text-xs flex items-center gap-1 mb-3 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  Back to sessions
                </button>
                <div className="space-y-2">
                  {sessionMessages.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-xl text-xs ${msg.sender === 'user' ? 'bg-[#6B4D90]/30 text-white/80' : 'bg-white/5 text-white/60'}`}>
                      <p className="font-bold uppercase tracking-widest text-[0.6rem] mb-1 opacity-50">{msg.sender}</p>
                      <p className="leading-relaxed">{msg.message}</p>
                      <p className="text-white/20 text-[0.6rem] mt-1">{msg.date_added.slice(0, 16)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sign Out */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div
                onClick={() => navigate('/')}
                className="text-white/50 mx-4 my-1 p-4 flex items-center gap-3 hover:bg-white/5 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="font-body text-sm uppercase tracking-widest">Sign Out</span>
              </div>
            </div>
          </nav>
        </aside>
      </main>
    </div>
  )
}

export default Chatbot