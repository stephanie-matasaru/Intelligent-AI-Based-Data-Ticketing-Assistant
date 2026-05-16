import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts'

const CHART_COLORS = ['#A1CEBC', '#7b6cf6', '#e09a3a', '#e05c5c', '#4a9edd']

function renderChart(chartSpec) {
  if (!chartSpec || chartSpec.error) return null
  const { chart_type, x_key, y_key, data } = chartSpec

  return (
    <ResponsiveContainer width="100%" height={180}>
      {chart_type === 'bar' ? (
        <BarChart data={data} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
          <XAxis dataKey={x_key} stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#1a1a35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} cursor={{ fill: '#ffffff05' }} />
          <Bar dataKey={y_key} radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
          </Bar>
        </BarChart>
      ) : chart_type === 'line' ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
          <XAxis dataKey={x_key} stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#1a1a35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
          <Line type="monotone" dataKey={y_key} stroke="#A1CEBC" strokeWidth={2.5} dot={{ fill: '#A1CEBC', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#4fc093' }} />
        </LineChart>
      ) : chart_type === 'pie' ? (
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey={y_key} nameKey={x_key} paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#1a1a35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
        </PieChart>
      ) : null}
    </ResponsiveContainer>
  )
}

function MyWorkspace() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all') // all | chart | text | excel

  const chartRefs = useRef({})

  async function exportChart(ref, chartSpec) {
    if (!ref) return
    const html2canvas = (await import('html2canvas')).default
    const today = new Date().toISOString().slice(0, 10)
    const slug = (chartSpec?.title || 'chart').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    const filename = `${slug}_${today}.png`

    const container = document.createElement('div')
    container.style.cssText = [
      'position:fixed', 'left:-9999px', 'top:0',
      'background:#0f0f1e', 'padding:28px',
      `width:${Math.max(ref.offsetWidth + 56, 520)}px`,
      'font-family:system-ui,-apple-system,sans-serif',
      'box-sizing:border-box',
    ].join(';')

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
        <div>
          <p style="margin:0 0 3px;font-size:9px;text-transform:uppercase;letter-spacing:0.14em;color:#A1CEBC">Nokia · My Workspace Export</p>
          <h2 style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:-0.02em">${chartSpec?.title || 'Chart'}</h2>
        </div>
        <span style="font-family:monospace;font-size:10px;color:rgba(255,255,255,0.25)">${today}</span>
      </div>
    `

    const clone = ref.cloneNode(true)
    clone.style.background = 'transparent'
    container.appendChild(clone)

    const { data, x_key, y_key } = chartSpec || {}
    if (data?.length && x_key && y_key) {
      const table = document.createElement('table')
      table.style.cssText = 'width:100%;border-collapse:collapse;margin-top:20px;font-size:12px'
      table.innerHTML = `
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1)">
            <th style="text-align:left;padding:8px 12px;color:#A1CEBC;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600">${x_key}</th>
            <th style="text-align:right;padding:8px 12px;color:#A1CEBC;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600">${y_key}</th>
          </tr>
        </thead>
      `
      const tbody = document.createElement('tbody')
      data.forEach((row, i) => {
        const tr = document.createElement('tr')
        tr.style.cssText = `border-bottom:1px solid rgba(255,255,255,0.04);background:${i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}`
        tr.innerHTML = `
          <td style="padding:8px 12px;color:rgba(255,255,255,0.8)">${row[x_key]}</td>
          <td style="padding:8px 12px;color:#A1CEBC;font-family:monospace;font-weight:600;text-align:right">${row[y_key]}</td>
        `
        tbody.appendChild(tr)
      })
      table.appendChild(tbody)
      container.appendChild(table)
    }

    const footer = document.createElement('div')
    footer.style.cssText = 'margin-top:16px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between'
    footer.innerHTML = `
      <span style="font-size:9px;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.18)">AI Analyst · Ticketing System</span>
      <span style="font-size:9px;font-family:monospace;color:rgba(255,255,255,0.18)">${today}</span>
    `
    container.appendChild(footer)

    document.body.appendChild(container)
    const canvas = await html2canvas(container, { backgroundColor: '#0f0f1e', scale: 2, logging: false, useCORS: true })
    document.body.removeChild(container)

    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user?.user_id
    if (!userId) {
      console.error('No user in localStorage')
      return
    }
    fetch(`http://localhost:8000/api/workspace/${userId}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Failed to load workspace:', err))
  }, [])

  function removeItem(id) {
    fetch(`http://localhost:8000/api/workspace/${id}`, { method: 'DELETE' })
      .then(() => setItems(prev => prev.filter(item => item.id !== id)))
      .catch(err => console.error('Failed to delete item:', err))
  }

  function clearAll() {
    Promise.all(items.map(item =>
      fetch(`http://localhost:8000/api/workspace/${item.id}`, { method: 'DELETE' })
    )).then(() => setItems([]))
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  const typeIcon = { chart: 'bar_chart', text: 'notes', excel: 'table_chart' }
  const typeLabel = { chart: 'Chart', text: 'Insight', excel: 'Export' }
  const typeColor = { chart: '#7b6cf6', text: '#A1CEBC', excel: '#4fc093' }

  return (
    <div className="bg-[#0f0f1e] text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-8 md:px-16 py-10 max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[0.6875rem] uppercase tracking-widest text-[#A1CEBC] mb-1">Personal Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight text-white">My Workspace</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex felx-wrap items-center gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 bg-gradient-to-br from-[#000000] to-[#3E2162] px-4 py-2 rounded-xl text-white/70 hover:text-white text-xs uppercase tracking-widest border border-white/10 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New from Chatbot
            </button>
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/30 hover:text-red-400 text-xs uppercase tracking-widest border border-white/5 hover:border-red-400/30 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        {items.length > 0 && (
          <div className="flex gap-2 mb-6">
            {['all', 'chart', 'excel'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all"
                style={{
                  background: filter === f ? 'rgba(161,206,188,0.15)' : 'transparent',
                  color: filter === f ? '#A1CEBC' : 'rgba(255,255,255,0.3)',
                  border: `1px solid ${filter === f ? 'rgba(161,206,188,0.3)' : 'rgba(255,255,255,0.05)'}`
                }}
              >
                {f === 'all' ? `All (${items.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)}s`}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#000000] to-[#28074C] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white/40 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                dashboard_customize
              </span>
            </div>
            <p className="text-white/50 text-sm mb-1">Your workspace is empty</p>
            <p className="text-white/25 text-xs mb-6">Save charts, insights and data from the chatbot using the bookmark button</p>
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 bg-gradient-to-br from-[#000000] to-[#3E2162] px-5 py-2.5 rounded-xl text-white/70 hover:text-white text-xs uppercase tracking-widest border border-white/10 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">robot</span>
              Go to Chatbot
            </button>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(item => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 shadow-xl"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ color: typeColor[item.type] || '#A1CEBC', fontVariationSettings: "'FILL' 1" }}
                    >
                      {typeIcon[item.type] || 'notes'}
                    </span>
                    <span
                      className="text-[0.6rem] uppercase tracking-widest font-bold"
                      style={{ color: typeColor[item.type] || '#A1CEBC' }}
                    >
                      {typeLabel[item.type] || 'Insight'}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                {/* Label */}
                <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                  {item.label}
                </p>

                {/* Chart if present */}
                {item.chart_spec && !item.chart_spec.error && (
                  <div className="mt-1">
                    {item.chart_spec.title && (
                      <p className="text-[0.7rem] text-white/30 uppercase tracking-widest mb-2">
                        {item.chart_spec.title}
                      </p>
                    )}
                    <div ref={el => { if (el) chartRefs.current[item.id] = el }}>
                      {renderChart(item.chart_spec)}
                    </div>
                  </div>
                )}

                {/* Excel badge */}
                {item.type === 'excel' && item.excel_spec && (
                <div className="flex items-center gap-2">
                    {item.excel_spec.file_data_base64 ? (
                    <button
                        onClick={() => {
                        const byteCharacters = atob(item.excel_spec.file_data_base64)
                        const byteArray = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)))
                        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.download = item.excel_spec.filename || 'export.xlsx'
                        link.click()
                        }}
                        className="flex items-center gap-2 bg-[#4fc093]/10 border border-[#4fc093]/20 hover:bg-[#4fc093]/20 rounded-lg px-3 py-2 w-fit transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#4fc093] text-[14px]">download</span>
                        <span className="text-[#4fc093] text-xs">{item.excel_spec.filename || 'export.xlsx'}</span>
                    </button>
                    ) : (
                    <div className="flex items-center gap-2 bg-[#4fc093]/10 border border-[#4fc093]/20 rounded-lg px-3 py-2 w-fit">
                        <span className="material-symbols-outlined text-[#4fc093] text-[14px]">table_chart</span>
                        <span className="text-[#4fc093] text-xs">{item.excel_spec.filename || 'export.xlsx'}</span>
                    </div>
                    )}
                </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                  <p className="text-white/20 text-[0.6rem]">
                    Saved {new Date(item.savedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {item.chart_spec && !item.chart_spec.error && (
                    <button
                      onClick={() => exportChart(chartRefs.current[item.id], item.chart_spec)}
                      className="flex items-center gap-1 text-[0.6rem] uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[13px]">download</span>
                      Export PNG
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filtered empty */}
        {items.length > 0 && filtered.length === 0 && (
          <p className="text-white/30 text-sm text-center py-16">No {filter} items saved yet.</p>
        )}

      </main>
    </div>
  )
}

export default MyWorkspace