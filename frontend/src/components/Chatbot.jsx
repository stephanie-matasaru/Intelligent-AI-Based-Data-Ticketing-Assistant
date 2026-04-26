import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import './Chatbot.css'

function Chatbot() {
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
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)

  // Set this however your app stores the logged-in user
  const userId = 1

  useEffect(() => {
  sessionStorage.setItem('chat_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (groupId) sessionStorage.setItem('chat_group_id', groupId)
  }, [groupId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

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

  function buildHistory(messages) {
    return messages
      .filter(msg => msg.type === 'user' || msg.type === 'ai')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
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
    if (!attachedFile || isTyping) return

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: `Uploaded file: ${attachedFile.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
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

      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: data.explanation || 'File processed.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sql_script: data.sql_script || null,
        script_filename: data.script_filename || 'import.sql'
      }

      setMessages(prev => [...prev, aiMsg])
      setAttachedFile(null)
      fileInputRef.current.value = ''
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: error.message || 'Unable to process the file.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  async function handleSend() {
    if (attachedFile) {
      await handleUpload()
      return
    }

    if (!input.trim() || isTyping) return

    const question = input.trim()

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          history: buildHistory(messages),
          user_id: userId,
          group_id: groupId
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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, aiMsg])

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
                      <p className="text-white/80 leading-relaxed">{msg.text}</p>
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
                  accept=".xlsx,.csv"
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
            {[
              { icon: 'chat_bubble', label: 'Active Chat', active: true },
              { icon: 'group', label: 'Agent Queue' },
              { icon: 'menu_book', label: 'Knowledge Base' },
              { icon: 'query_stats', label: 'Insights' },
              { icon: 'hub', label: 'Team' },
            ].map((item) => (
              <div
                key={item.label}
                className={`mx-4 my-1 p-4 flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-br from-[#000000] to-[#6B4D90] text-white shadow-lg shadow-blue-900/20'
                    : 'text-white/50 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`}
              >
                <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <span className="font-body text-sm uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>
      </main>
    </div>
  )
}

export default Chatbot