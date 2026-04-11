import { useState } from 'react'
import { useEffect } from 'react'
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

function Graphs() {
  const [filters, setFilters] = useState({
    startDate: '', endDate: '', priority: 'all', status: 'all', team: 'all',
  })

  const [priorityData, setPriorityData] = useState(MOCK_PRIORITY)
  const [statusData, setStatusData]     = useState(MOCK_STATUS)
  const [slaData, setSlaData]           = useState(MOCK_SLA)
  const [timelineData, setTimelineData] = useState(MOCK_TIMELINE)

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

    const base = 'http://localhost:8000'
    const q = params.toString() ? `?${params.toString()}` : ''

    fetch(`${base}/by-priority${q}`).then(r => r.json()).then(setPriorityData)
    fetch(`${base}/by-status${q}`).then(r => r.json()).then(setStatusData)
    fetch(`${base}/timeline${q}`).then(r => r.json()).then(setTimelineData)
    fetch(`${base}/sla${q}`)
      .then(r => r.json())
      .then(d => setSlaData([
        { name: 'SLA Met',      value: d.sla_met      },
        { name: 'SLA Breached', value: d.sla_breached },
      ]))
  }, [filters])

  function handleFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    setFilters({ startDate: '', endDate: '', priority: 'all', status: 'all', team: 'all' })
  }

  return (
    <div className="graphs-root">

      <Navbar />

      <main className="graphs-main">

        <div className="graphs-header">
          <div>
            <h1 className="graphs-title">KPI Dashboard</h1>
            <div className="graphs-subtitle">
              <div className="ai-pulse" />
              <span className="graphs-subtitle-text">Live Analytics</span>
            </div>
          </div>
          <div className="graphs-meta">
            <span className="graphs-meta-label">Total Tickets</span>
            <span className="graphs-meta-value">{priorityData.reduce((s, d) => s + d.count, 0)}</span>
          </div>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <label className="filter-label">Start Date</label>
            <input type="date" className="filter-input" value={filters.startDate}
              onChange={e => handleFilter('startDate', e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label">End Date</label>
            <input type="date" className="filter-input" value={filters.endDate}
              onChange={e => handleFilter('endDate', e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label">Priority</label>
            <select className="filter-input" value={filters.priority}
              onChange={e => handleFilter('priority', e.target.value)}>
              <option value="all">All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select className="filter-input" value={filters.status}
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
            <label className="filter-label">Team</label>
            <select className="filter-input" value={filters.team}
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
          <button className="filter-reset" onClick={handleReset}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
            Reset
          </button>
        </div>

        <div className="charts-grid">

          {/* 1. Bar – Priority */}
          <div className="chart-card" id="priority">
            <div className="chart-card-header">
              <h2 className="chart-title">Tickets by Priority</h2>
              <span className="chart-badge">{priorityData.reduce((s,d) => s+d.count, 0)} total</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priorityData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {priorityData.map(entry => (
                    <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 2. Donut – SLA */}
          <div className="chart-card" id="sla">
            <div className="chart-card-header">
              <h2 className="chart-title">SLA Compliance</h2>
              <span className="chart-badge">
                {Math.round(slaData[0].value / (slaData[0].value + slaData[1].value) * 100)}% met
              </span>
            </div>
            <div className="donut-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={slaData} cx="50%" cy="50%" innerRadius={65} outerRadius={90}
                    paddingAngle={3} dataKey="value">
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
                  <span className="sla-dot" style={{ background: SLA_COLORS[i] }} />
                  <span className="sla-legend-label">{entry.name}</span>
                  <span className="sla-legend-value">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Line – Timeline */}
          <div className="chart-card chart-card--wide" id="timeline">
            <div className="chart-card-header">
              <h2 className="chart-title">Tickets Created Over Time</h2>
              <div className="timeline-toggle">
                {['Daily', 'Weekly', 'Monthly'].map(t => (
                  <button key={t} className={`toggle-btn ${t === 'Weekly' ? 'toggle-btn--active' : ''}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
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

          {/* 4. Bar – Status */}
          <div className="chart-card chart-card--wide" id="status">
            <div className="chart-card-header">
              <h2 className="chart-title">Tickets by Status</h2>
              <span className="chart-badge">{statusData.reduce((s,d) => s+d.count, 0)} total</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={statusData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff60', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {statusData.map(entry => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Graphs