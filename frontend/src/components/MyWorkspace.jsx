import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts'
import * as XLSX from 'xlsx'

const CHART_COLORS = ['#A1CEBC', '#7b6cf6', '#e09a3a', '#e05c5c', '#4a9edd']

function renderChart(chartSpec, onTicketClick) {
  if (!chartSpec || chartSpec.error) return null

  const { chart_type, title, x_key, y_key, data } = chartSpec

  return (
    <div style={{ marginTop: '12px' }}>
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
            <Bar dataKey={y_key} radius={[4, 4, 0, 0]} style={{ cursor: onTicketClick ? 'pointer' : 'default' }}
               onClick={onTicketClick ? (d) => onTicketClick(d) : undefined}>
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
              activeDot={{ r: 5, fill: '#4fc093', cursor: onTicketClick ? 'pointer' : 'default',
                onClick: onTicketClick ? (_, payload) => onTicketClick(payload.payload) : undefined }} />
          </LineChart>
        ) : chart_type === 'pie' ? (
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey={y_key} nameKey={x_key} paddingAngle={3}>
              {data.map((entry, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} 
                  style={{ cursor: onTicketClick ? 'pointer' : 'default' }}
                  onClick={onTicketClick ? () => onTicketClick(entry) : undefined} />
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

function DrillDownPanel({ drillDown, onClose, onExportCSV, onExportExcel }) {
  if (!drillDown) return null

  const priorityStyle = (p) => {
    const map = {
      Critical: { bg: 'rgba(224,92,92,0.2)',   color: '#e05c5c' },
      High:     { bg: 'rgba(224,154,58,0.2)',  color: '#e09a3a' },
      Medium:   { bg: 'rgba(224,212,58,0.2)',  color: '#e0d43a' },
      Low:      { bg: 'rgba(79,192,147,0.2)',  color: '#4fc093' },
    }
    return map[p] || { bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 40, backdropFilter: 'blur(2px)' }} />
      <div style={{ position: 'fixed', right: 0, top: 0, height: '100%', width: 'min(580px, 100vw)', background: '#13132a', borderLeft: '1px solid rgba(255,255,255,0.08)', zIndex: 50, overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 48px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: '#13132a', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A1CEBC', margin: 0 }}>Tickets in Selection</p>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', margin: '4px 0 0 0' }}>{drillDown.label}</h2>
            {!drillDown.loading && (
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: 4, marginBottom: 0 }}>
                {drillDown.tickets.length} ticket{drillDown.tickets.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!drillDown.loading && !drillDown.error && drillDown.tickets.length > 0 && (
              <>
                <button onClick={onExportCSV} style={{ background: '#4fc093', color: '#0f0f1e', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>CSV
                </button>
                <button onClick={onExportExcel} style={{ background: '#4a9edd', color: '#0f0f1e', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>table_view</span>Excel
                </button>
              </>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
          {drillDown.loading && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', padding: 48 }}>Loading tickets...</div>}
          {drillDown.error && <div style={{ textAlign: 'center', color: '#e05c5c', padding: 48 }}>Failed to load tickets.</div>}
          {!drillDown.loading && !drillDown.error && drillDown.tickets.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', padding: 48 }}>No tickets match this selection.</div>}
          {!drillDown.loading && !drillDown.error && drillDown.tickets.length > 0 && (
            <div style={{ minWidth: '500px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: '#0c0c1f', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0 }}>
                    {['Ticket', 'Priority', 'Status', 'Assignee', 'Team', 'Service', 'Submitted'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.5875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A1CEBC', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drillDown.tickets.map(t => {
                    const ps = priorityStyle(t.priority || t.priority_name)
                    return (
                      <tr key={t.ticket_id || t.ticket_number} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '10px 14px', color: 'white', fontWeight: 600 }}>{t.ticket_number}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 700, background: ps.bg, color: ps.color }}>
                            {t.priority || t.priority_name || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.65)' }}>{t.status}</td>
                        <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.65)' }}>{t.assigned_person || '—'}</td>
                        <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.65)' }}>{t.team || '—'}</td>
                        <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.65)' }}>{t.service || '—'}</td>
                        <td style={{ padding: '10px 14px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', fontSize: '0.725rem', whiteSpace: 'nowrap' }}>
                          {t.submit_datetime ? new Date(t.submit_datetime).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function MyWorkspace() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all') // all | chart | text | excel
  const [drillDown, setDrillDown] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

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
    setConfirmDelete({ type: 'one', id })
  }

  function clearAll() {
    setConfirmDelete({ type: 'all' })
  }

  function confirmDeleteAction() {
    if (!confirmDelete) return
    if (confirmDelete.type === 'all') {
      Promise.all(items.map(item =>
        fetch(`http://localhost:8000/api/workspace/${item.id}`, { method: 'DELETE' })
      )).then(() => setItems([]))
    } else {
      fetch(`http://localhost:8000/api/workspace/${confirmDelete.id}`, { method: 'DELETE' })
        .then(() => setItems(prev => prev.filter(item => item.id !== confirmDelete.id)))
        .catch(err => console.error('Failed to delete item:', err))
    }
    setConfirmDelete(null)
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  const typeIcon = { chart: 'bar_chart', text: 'notes', excel: 'table_chart' }
  const typeLabel = { chart: 'Chart', text: 'Insight', excel: 'Export' }
  const typeColor = { chart: '#7b6cf6', text: '#A1CEBC', excel: '#4fc093' }

  function exportDrillDownCSV() {
  if (!drillDown?.tickets?.length) return
  const cols = [
    ['ticket_number','Ticket Number'],['status','Status'],['priority','Priority'],
    ['priority_name','Priority'],['team','Team'],['assigned_person','Assigned Person'],
    ['service','Service'],['company','Company'],['submit_datetime','Submit Date'],
    ['resolved_datetime','Resolved Date'],
  ]
  const dateKeys = ['submit_datetime','resolved_datetime']
  const header = cols.map(([,label]) => `"${label}"`).join(',')
  const rows = drillDown.tickets.map(t =>
    cols.map(([key]) => {
      const v = t[key]
      if (!v) return '""'
      const val = dateKeys.includes(key) ? new Date(v).toLocaleString() : v
      return `"${String(val).replace(/"/g,'""')}"`
    }).join(',')
  )
  const blob = new Blob([[header,...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `tickets_${drillDown.label.replace(/[^a-z0-9]/gi,'_').toLowerCase()}.csv`
  a.click()
}

function exportDrillDownExcel() {
  if (!drillDown?.tickets?.length) return
  const rows = drillDown.tickets.map(t => ({
    'Ticket Number': t.ticket_number,
    'Status': t.status,
    'Priority': t.priority || t.priority_name,
    'Team': t.team,
    'Assigned Person': t.assigned_person,
    'Service': t.service,
    'Company': t.company,
    'Submit Date': t.submit_datetime ? new Date(t.submit_datetime).toLocaleString() : '',
    'Resolved Date': t.resolved_datetime ? new Date(t.resolved_datetime).toLocaleString() : '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Tickets')
  XLSX.writeFile(wb, `tickets_${drillDown.label.replace(/[^a-z0-9]/gi,'_').toLowerCase()}.xlsx`)
}

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
                    <div ref={el => { if (el) chartRefs.current[item.id] = el }}>
                      {renderChart(item.chart_spec, item.ticket_records?.length ? (d) => {
                        const xKey = item.chart_spec?.x_key
                        const clicked = d?.[xKey]
                        const filtered = clicked
                          ? item.ticket_records.filter(t =>
                              String(t[xKey] || t.priority_name || t.status || t.team || t.service || '')
                                .toLowerCase() === String(clicked).toLowerCase()
                            )
                          : item.ticket_records
                        setDrillDown({
                          label: clicked ? `${item.chart_spec?.title || 'Chart'}: ${clicked}` : item.chart_spec?.title || 'Chart',
                          tickets: filtered.length ? filtered : item.ticket_records,
                          loading: false,
                          error: false
                        })
                      } : null)}
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

      <DrillDownPanel
        drillDown={drillDown}
        onClose={() => setDrillDown(null)}
        onExportCSV={exportDrillDownCSV}
        onExportExcel={exportDrillDownExcel}
        />
        {confirmDelete && (
        <>
          <div
            onClick={() => setConfirmDelete(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, backdropFilter: 'blur(2px)' }}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            background: '#13132a', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '28px 32px', zIndex: 70, width: 'min(400px, 90vw)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'rgba(224,92,92,0.15)', borderRadius: 10, padding: 8, display: 'flex' }}>
                <span className="material-symbols-outlined" style={{ color: '#e05c5c', fontSize: 20, fontVariationSettings: "'FILL' 1" }}>delete</span>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: 'white', fontSize: '0.9375rem' }}>
                  {confirmDelete.type === 'all' ? 'Clear workspace?' : 'Remove item?'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                  {confirmDelete.type === 'all'
                    ? `This will permanently delete all ${items.length} saved items.`
                    : 'This item will be permanently removed from your workspace.'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '8px 18px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                style={{ background: 'rgba(224,92,92,0.15)', border: '1px solid rgba(224,92,92,0.3)', color: '#e05c5c', borderRadius: 8, padding: '8px 18px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
              >
                {confirmDelete.type === 'all' ? 'Clear all' : 'Delete'}
              </button>
            </div>
          </div>
        </>
      )}
      </main>
    </div>
  )
}

export default MyWorkspace