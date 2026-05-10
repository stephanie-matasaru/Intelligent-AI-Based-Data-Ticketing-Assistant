import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts'
import './Graphs.css'
import Navbar from './Navbar'

const MOCK_PRIORITY = [
  { name: 'Critical', count: 72 },
  { name: 'High',     count: 180 },
  { name: 'Medium',   count: 287 },
  { name: 'Low',      count: 204 },
]

const MOCK_STATUS = [
  { name: 'Open',        count: 45 },
  { name: 'In Progress', count: 63 },
  { name: 'Pending',     count: 38 },
  { name: 'Resolved',    count: 210 },
  { name: 'Closed',      count: 187 },
]

const MOCK_SLA = [
  { name: 'SLA Met',      value: 590 },
  { name: 'SLA Breached', value: 48  },
]

const MOCK_TIMELINE = [
  { day: '01/03', count: 16  },
  { day: '07/03', count: 148 },
  { day: '14/03', count: 202 },
  { day: '21/03', count: 152 },
  { day: '28/03', count: 178 },
  { day: '03/04', count: 47  },
]

const MOCK_CATEGORY = [
  { name: 'App',   count: 312 },
  { name: 'Infra', count: 198 },
  { name: 'Other', count: 47  },
]

const MOCK_TEAM = [
  { name: 'Support',  count: 143 },
  { name: 'Backend',  count: 118 },
  { name: 'Network',  count: 97  },
  { name: 'DevOps',   count: 84  },
  { name: 'Frontend', count: 76  },
  { name: 'Data',     count: 55  },
]

const PRIORITY_COLORS = {
  Critical: '#e05c5c',
  High:     '#e09a3a',
  Medium:   '#e0d43a',
  Low:      '#4fc093',
}

const STATUS_COLORS = {
  'Open':        '#7b6cf6',
  'In Progress': '#4fc093',
  'Pending':     '#e09a3a',
  'Resolved':    '#4a9edd',
  'Closed':      '#6b6b8a',
}

const SLA_COLORS = ['#4fc093', '#e05c5c']
const CATEGORY_COLORS = ['#7b6cf6', '#4a9edd', '#e09a3a']
const TEAM_COLORS     = ['#A1CEBC', '#7b6cf6', '#4a9edd', '#e09a3a', '#e05c5c', '#4fc093']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

function DrillDownPanel({ drillDown, onClose, onExport }) {
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
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 40,
          backdropFilter: 'blur(2px)',
        }}
      />
 
      {/* panel */}
      <div style={{
        position: 'fixed', right: 0, top: 0,
        height: '100%', width: '580px',
        background: '#13132a',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        zIndex: 50,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-12px 0 48px rgba(0,0,0,0.5)',
      }}>
 
        {/* header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'sticky', top: 0, background: '#13132a', zIndex: 1,
        }}>
          <div>
            <p style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A1CEBC', marginBottom: 6, margin: 0 }}>
              Drill-down
            </p>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', margin: '4px 0 0 0' }}>
              {drillDown.label}
            </h2>
            {!drillDown.loading && (
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: 4, marginBottom: 0 }}>
                {drillDown.tickets.length} ticket{drillDown.tickets.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
 
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!drillDown.loading && !drillDown.error && drillDown.tickets.length > 0 && (
              <button
                onClick={onExport}
                style={{
                  background: '#4fc093', color: '#0f0f1e',
                  border: 'none', borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: '0.6875rem', fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>
                Export CSV
              </button>
            )}
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 4, display: 'flex' }}
              aria-label="Close panel"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
 
        {/* body */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {drillDown.loading && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', padding: 48, fontSize: '0.875rem' }}>
              Loading tickets...
            </div>
          )}
 
          {drillDown.error && (
            <div style={{ textAlign: 'center', color: '#e05c5c', padding: 48, fontSize: '0.875rem' }}>
              Failed to load tickets. Check the console.
            </div>
          )}
 
          {!drillDown.loading && !drillDown.error && drillDown.tickets.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', padding: 48, fontSize: '0.875rem' }}>
              No tickets match this selection.
            </div>
          )}
 
          {!drillDown.loading && !drillDown.error && drillDown.tickets.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: '#0c0c1f', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0 }}>
                  {['Ticket', 'Priority', 'Status', 'Assignee', 'Team', 'Service', 'Submitted'].map(h => (
                    <th key={h} style={{
                      padding: '10px 14px', textAlign: 'left',
                      fontSize: '0.5875rem', textTransform: 'uppercase',
                      letterSpacing: '0.1em', color: '#A1CEBC',
                      fontWeight: 600, whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drillDown.tickets.map(t => {
                  const ps = priorityStyle(t.priority)
                  return (
                    <tr
                      key={t.ticket_id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 14px', color: 'white', fontWeight: 600 }}>
                        {t.ticket_number}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 4,
                          fontSize: '0.6875rem', fontWeight: 700,
                          background: ps.bg, color: ps.color,
                        }}>
                          {t.priority || '—'}
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
          )}
        </div>
      </div>
    </>
  )
}


function Graphs() {
  const [filters, setFilters] = useState({
    startDate: '', endDate: '', priority: 'all', status: 'all', team: 'all',
  })

  const [priorityData, setPriorityData] = useState(MOCK_PRIORITY)
  const [statusData, setStatusData] = useState(MOCK_STATUS)
  const [slaData, setSlaData] = useState(MOCK_SLA)
  const [timelineData, setTimelineData] = useState(MOCK_TIMELINE)
  const [categoryData, setCategoryData] = useState(MOCK_CATEGORY)
  const [teamData, setTeamData]         = useState(MOCK_TEAM)
  const [timelineGroup, setTimelineGroup] = useState('weekly')
  const [drillDown, setDrillDown] = useState(null)

  const priorityRef = useRef(null)
  const slaRef = useRef(null)
  const timelineRef = useRef(null)
  const statusRef = useRef(null)
  const categoryRef = useRef(null)
  const teamRef     = useRef(null)

  async function exportChart(ref, filename) {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(ref.current, { backgroundColor: '#1a1a2e' })
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.startDate) params.append('start_date', filters.startDate)
    if (filters.endDate)   params.append('end_date',   filters.endDate)
    if (filters.priority !== 'all') params.append('priority', filters.priority)
    if (filters.status   !== 'all') params.append('status',   filters.status)
    if (filters.team     !== 'all') params.append('team',      filters.team)

    const base = 'http://localhost:8000/api/graphs'
    const q = params.toString() ? `?${params.toString()}` : ''

    fetch(`${base}/by-priority${q}`).then(r => r.json()).then(setPriorityData)
    fetch(`${base}/by-status${q}`).then(r => r.json()).then(setStatusData)
    const tq = new URLSearchParams(params)
    tq.append('group_by', timelineGroup)
    fetch(`${base}/timeline?${tq.toString()}`).then(r => r.json()).then(setTimelineData)
    fetch(`${base}/sla${q}`)
      .then(r => r.json())
      .then(d => setSlaData([
        { name: 'SLA Met',      value: d.sla_met      },
        { name: 'SLA Breached', value: d.sla_breached },
      ]))
    fetch(`${base}/by-category${q}`).then(r => r.json()).then(setCategoryData)
    fetch(`${base}/by-team${q}`).then(r => r.json()).then(setTeamData)
  }, [filters, timelineGroup])

  function handleFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    setFilters({ startDate: '', endDate: '', priority: 'all', status: 'all', team: 'all' })
  }

  async function fetchDrillDown(label, extraParams = {}) {
    setDrillDown({ label, tickets: [], loading: true, error: false })
 
    const params = new URLSearchParams()
    if (filters.startDate) params.append('start_date', filters.startDate)
    if (filters.endDate)   params.append('end_date',   filters.endDate)
    if (filters.priority !== 'all') params.append('priority', filters.priority)
    if (filters.status   !== 'all') params.append('status',   filters.status)
    if (filters.team     !== 'all') params.append('team',     filters.team)
 
    // drilldown-specific params override the current filters
    Object.entries(extraParams).forEach(([k, v]) => params.set(k, v))
 
    params.set('page', '1')
    params.set('page_size', '500')
 
    try {
      const res = await fetch(`http://localhost:8000/api/tickets/?${params.toString()}`)
      const data = await res.json()
      setDrillDown({ label, tickets: data.items || [], loading: false, error: false })
    } catch (e) {
      console.error('DrillDown fetch failed:', e)
      setDrillDown({ label, tickets: [], loading: false, error: true })
    }
  }
 
  function exportDrillDownCSV() {
    if (!drillDown?.tickets?.length) return
 
    const cols = [
      ['ticket_number',       'Ticket Number'],
      ['status',              'Status'],
      ['priority',            'Priority'],
      ['team',                'Team'],
      ['assigned_person',     'Assigned Person'],
      ['service',             'Service'],
      ['company',             'Company'],
      ['project',             'Project'],
      ['cat_t1',              'Category T1'],
      ['cat_t2',              'Category T2'],
      ['cat_t3',              'Category T3'],
      ['description',         'Description'],
      ['resolution',          'Resolution'],
      ['resolution_category', 'Resolution Category'],
      ['submit_datetime',     'Submit Date'],
      ['estimated_resolution','Estimated Resolution'],
      ['resolved_datetime',   'Resolved Date'],
      ['closed_datetime',     'Closed Date'],
      ['last_modified',       'Last Modified'],
    ]
 
    const dateKeys = ['submit_datetime', 'estimated_resolution', 'resolved_datetime', 'closed_datetime', 'last_modified']
 
    const header = cols.map(([, label]) => `"${label}"`).join(',')
    const rows = drillDown.tickets.map(t =>
      cols.map(([key]) => {
        const v = t[key]
        if (!v) return '""'
        const val = dateKeys.includes(key) ? new Date(v).toLocaleString() : v
        return `"${String(val).replace(/"/g, '""')}"`
      }).join(',')
    )
 
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `drilldown_${drillDown.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="graphs-root">

      <Navbar />

      <main className="graphs-main" role="main">

        <div className="graphs-header">
          <div>
            <h1 className="graphs-title">KPI Dashboard</h1>
            <div className="graphs-subtitle" role="status" aria-label="Live analytics active">
              <div className="ai-pulse" aria-hidden="true" />
              <span className="graphs-subtitle-text">Live Analytics</span>
            </div>
          </div>
          <div className="graphs-meta">
            <span className="graphs-meta-label">Total Tickets</span>
            <span className="graphs-meta-value" aria-live="polite" aria-atomic="true">
              {priorityData.reduce((s, d) => s + d.count, 0)}
            </span>
          </div>
        </div>

        <div className="filter-bar" role="search" aria-label="Filter charts">
          <div className="filter-group">
            <label className="filter-label" htmlFor="graph-start-date">Start Date</label>
            <input id="graph-start-date" type="date" className="filter-input" value={filters.startDate}
              onChange={e => handleFilter('startDate', e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="graph-end-date">End Date</label>
            <input id="graph-end-date" type="date" className="filter-input" value={filters.endDate}
              onChange={e => handleFilter('endDate', e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="graph-priority">Priority</label>
            <select id="graph-priority" className="filter-input" value={filters.priority}
              onChange={e => handleFilter('priority', e.target.value)}>
              <option value="all">All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="graph-status">Status</label>
            <select id="graph-status" className="filter-input" value={filters.status}
              onChange={e => handleFilter('status', e.target.value)}>
              <option value="all">All</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="graph-team">Team</label>
            <select id="graph-team" className="filter-input" value={filters.team}
              onChange={e => handleFilter('team', e.target.value)}>
              <option value="all">All Teams</option>
              <option value="Support">Support</option>
              <option value="Network">Network</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="DevOps">DevOps</option>
              <option value="Data">Data</option>
            </select>
          </div>
          <button className="filter-reset" onClick={handleReset} aria-label="Reset all filters">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">refresh</span>
            Reset
          </button>
        </div>

        <div className="charts-grid">

          {/* 1. Bar – Priority */}
          <div className="chart-card" id="priority" ref={priorityRef}>
            <div className="chart-card-header">
              <h2 className="chart-title">Tickets by Priority</h2> 
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="chart-badge">{priorityData.reduce((s,d) => s+d.count, 0)} total</span>
                <button className="export-btn" onClick={() => exportChart(priorityRef, 'priority.png')}
                  aria-label="Export priority chart as PNG">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                </button>
              </div>
            </div>

            {/* screen reader table */}
            <table className="sr-only" aria-label="Tickets by priority data">
              <thead><tr><th scope="col">Priority</th><th scope="col">Count</th></tr></thead>
              <tbody>
                {priorityData.map(d => (
                  <tr key={d.name}><td>{d.name}</td><td>{d.count}</td></tr>
                ))}
              </tbody>
            </table>
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={priorityData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                  <Bar dataKey="count" radius={[4,4,0,0]}                     style={{ cursor: 'pointer' }}
                    onClick={(data) => fetchDrillDown(`Priority: ${data.name}`, { priority: data.name })}>
                    {priorityData.map(entry => (
                      <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Donut – SLA */}
          <div className="chart-card" id="sla" ref={slaRef}>
            <div className="chart-card-header">
              <h2 className="chart-title">SLA Compliance</h2>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="chart-badge">
                {Math.round(slaData[0].value / (slaData[0].value + slaData[1].value) * 100)}% met
              </span>
                <button className="export-btn" onClick={() => exportChart(slaRef, 'sla.png')}
                  aria-label="Export SLA chart as PNG">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                </button>
              </div>
            </div>
            {/* screen reader table */}
            <table className="sr-only" aria-label="SLA compliance data">
              <thead><tr><th scope="col">Category</th><th scope="col">Count</th></tr></thead>
              <tbody>
                {slaData.map(d => (
                  <tr key={d.name}><td>{d.name}</td><td>{d.value}</td></tr>
                ))}
              </tbody>
            </table>
            <div aria-hidden="true">
              <div className="donut-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={slaData} cx="50%" cy="50%" innerRadius={65} outerRadius={90}
                      paddingAngle={3} dataKey="value" style={{ cursor: 'pointer' }} onClick={(data) => fetchDrillDown(data.payload?.name, { sla_status: data.payload?.name === 'SLA Met' ? 'met' : 'breached' })}>
                      {slaData.map((entry, i) => (
                        <Cell key={entry.name} fill={SLA_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center">
                  <span className="donut-number">{slaData[0].value}</span>
                  <span className="donut-sub">SLA Met</span>
                </div>
              </div>
              <div className="sla-legend">
                {slaData.map((entry, i) => (
                  <div key={entry.name} className="sla-legend-item">
                    <span className="sla-dot" style={{ background: SLA_COLORS[i] }} aria-hidden="true" />
                    <span className="sla-legend-label">{entry.name}</span>
                    <span className="sla-legend-value">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Line – Timeline */}
          <div className="chart-card chart-card--wide" id="timeline" ref={timelineRef}>
            <div className="chart-card-header">
              <h2 className="chart-title">Tickets Created Over Time</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="timeline-toggle">
                    {['Daily', 'Weekly', 'Monthly'].map(t => (
                      <button key={t}
                        className={`toggle-btn ${timelineGroup === t.toLowerCase() ? 'toggle-btn--active' : ''}`}
                        aria-pressed={timelineGroup === t.toLowerCase()}
                        onClick={() => setTimelineGroup(t.toLowerCase())}>
                        {t}
                      </button>
                    ))}
                  </div>
                <button className="export-btn" onClick={() => exportChart(timelineRef, 'timeline.png')}
                  aria-label="Export timeline chart as PNG">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                </button>
            </div>
            </div>
            {/* screen reader table */}
            <table className="sr-only" aria-label="Tickets created over time data">
              <thead><tr><th scope="col">Date</th><th scope="col">Count</th></tr></thead>
              <tbody>
                {timelineData.map(d => (
                  <tr key={d.day}><td>{d.day}</td><td>{d.count}</td></tr>
                ))}
              </tbody>
            </table>
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="day" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#A1CEBC', strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="count" stroke="#A1CEBC" strokeWidth={2.5}
                    dot={{ fill: '#A1CEBC', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#4fc093' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Bar – Status */}
          <div className="chart-card chart-card--wide" id="status" ref={statusRef}>
            <div className="chart-card-header">
              <h2 className="chart-title">Tickets by Status</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="chart-badge">{statusData.reduce((s,d) => s+d.count, 0)} total</span>
                <button className="export-btn" onClick={() => exportChart(statusRef, 'status.png')}
                  aria-label="Export status chart as PNG">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                </button>
              </div>
            </div>
            {/* screen reader table */}
            <table className="sr-only" aria-label="Tickets by status data">
              <thead><tr><th scope="col">Status</th><th scope="col">Count</th></tr></thead>
              <tbody>
                {statusData.map(d => (
                  <tr key={d.name}><td>{d.name}</td><td>{d.count}</td></tr>
                ))}
              </tbody>
            </table>
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={statusData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                  <Bar dataKey="count" radius={[4,4,0,0]} style={{ cursor: 'pointer' }} onClick={(data) => fetchDrillDown(`Status: ${data.name}`, { status: data.name })}>
                    {statusData.map(entry => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* 5. Pie – Category */}
          <div className="chart-card" id="category" ref={categoryRef}>
            <div className="chart-card-header">
              <h2 className="chart-title">Tickets by Category</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="chart-badge">{categoryData.reduce((s,d) => s+d.count, 0)} total</span>
                <button className="export-btn" onClick={() => exportChart(categoryRef, 'category.png')}
                  aria-label="Export category chart as PNG">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                </button>
              </div>
            </div>
            <table className="sr-only" aria-label="Tickets by category data">
              <thead><tr><th scope="col">Category</th><th scope="col">Count</th></tr></thead>
              <tbody>{categoryData.map(d => <tr key={d.name}><td>{d.name}</td><td>{d.count}</td></tr>)}</tbody>
            </table>
            <div aria-hidden="true">
            <div className="donut-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={65} outerRadius={90}
                    paddingAngle={3} dataKey="count" nameKey="name">
                    {categoryData.map((entry, i) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} style={{ cursor: 'pointer' }} onClick={(data) => {
                        console.log('category click data:', data)
                        fetchDrillDown(`Category: ${data.payload?.name}`, { cat_t1: data.payload?.name })
                      }}/>
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <span className="donut-number">{categoryData.reduce((s,d) => s+d.count, 0)}</span>
                <span className="donut-sub">Total</span>
              </div>
            </div>
            <div className="sla-legend">
              {categoryData.map((entry, i) => (
                <div key={entry.name} className="sla-legend-item">
                  <span className="sla-dot" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} aria-hidden="true" />
                  <span className="sla-legend-label">{entry.name}</span>
                  <span className="sla-legend-value">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
          </div>

          {/* 6. Bar – Team */}
          <div className="chart-card" id="team" ref={teamRef}>
            <div className="chart-card-header">
              <h2 className="chart-title">Tickets by Team</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="chart-badge">{teamData.reduce((s,d) => s+d.count, 0)} total</span>
                <button className="export-btn" onClick={() => exportChart(teamRef, 'team.png')}
                  aria-label="Export team chart as PNG">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                </button>
              </div>
            </div>
            <table className="sr-only" aria-label="Tickets by team data">
              <thead><tr><th scope="col">Team</th><th scope="col">Count</th></tr></thead>
              <tbody>{teamData.map(d => <tr key={d.name}><td>{d.name}</td><td>{d.count}</td></tr>)}</tbody>
            </table>
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={teamData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                  <Bar dataKey="count" radius={[4,4,0,0]} style={{ cursor: 'pointer' }} onClick={(data) => fetchDrillDown(`Team: ${data.name}`, { team: data.name })}>
                    {teamData.map((entry, i) => (
                      <Cell key={entry.name} fill={TEAM_COLORS[i % TEAM_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
      <DrillDownPanel
        drillDown={drillDown}
        onClose={() => setDrillDown(null)}
        onExport={exportDrillDownCSV}
      />
    </div>
  )
}

export default Graphs