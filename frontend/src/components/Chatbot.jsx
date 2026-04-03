import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import './Chatbot.css'

const AI_RESPONSES = [
  "I'm analyzing your request. Please hold while I gather the relevant data.",
  "I've logged this issue and notified the appropriate team. You'll receive an update shortly.",
  "I've identified a potential root cause. Running diagnostics now — this may take a moment.",
  "Your ticket has been escalated to a senior analyst. Expected resolution time: 15 minutes.",
  "I've cross-referenced this with similar past incidents. A mitigation strategy is being prepared.",
  "Request acknowledged. I'm pulling the latest logs to investigate further.",
]

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm your AI Ticketing Assistant. Describe your issue and I'll help you resolve it.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend()
  }

  function handleSend() {
    if (!input.trim()) return

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
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
              <span className="font-label text-[0.6875rem] uppercase tracking-widest text-white/40 block mb-1">Session ID</span>
              <span className="font-mono text-sm text-white/60">#AX-992-KLD</span>
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
                    <span className="material-symbols-outlined text-white text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>robot</span>
                  </div>
                  <div className="max-w-[85%]">
                    <div className="bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] backdrop-blur-xl p-6 rounded-2xl rounded-tl-none shadow-2xl">
                      <p className="text-white/80 leading-relaxed">{msg.text}</p>
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
                  <span className="material-symbols-outlined text-white text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>robot</span>
                </div>
                <div className="bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] px-6 py-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1 items-center">
                    <span className="typing-dot"></span>
                    <span className="typing-dot" style={{animationDelay: '0.2s'}}></span>
                    <span className="typing-dot" style={{animationDelay: '0.4s'}}></span>
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
                <button className="h-10 w-10 flex items-center justify-center text-white/30 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
                <input
                  className="flex-grow bg-transparent border-none outline-none text-white placeholder:text-white/30 font-body py-4 text-sm"
                  placeholder="Type an instruction for the analyst..."
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="h-10 w-10 flex items-center justify-center text-white/30 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-br from-[#000000] to-[#3E2162] h-12 w-12 flex items-center justify-center rounded-xl text-white shadow-lg shadow-blue-900/20 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
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
                <span className="material-symbols-outlined text-white text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>robot</span>
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
                <span className="material-symbols-outlined" style={item.active ? {fontVariationSettings: "'FILL' 1"} : {}}>{item.icon}</span>
                <span className="font-body text-sm uppercase tracking-widest">{item.label}</span>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-white/50 mx-4 my-1 p-4 flex items-center gap-3 hover:bg-white/5 hover:text-white rounded-xl transition-all cursor-pointer">
                <span className="material-symbols-outlined">help</span>
                <span className="font-body text-sm uppercase tracking-widest">Help</span>
              </div>
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