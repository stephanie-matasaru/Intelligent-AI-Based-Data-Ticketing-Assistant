import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('workspace_items') || '[]')
    setItems(saved)
  }, [])

  function removeItem(id) {
    const updated = items.filter(item => item.id !== id)
    setItems(updated)
    localStorage.setItem('workspace_items', JSON.stringify(updated))
  }

  function clearAll() {
    setItems([])
    localStorage.removeItem('workspace_items')
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
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[0.6875rem] uppercase tracking-widest text-[#A1CEBC] mb-1">Personal Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight text-white">My Workspace</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
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
            {['all', 'chart', 'text', 'excel'].map(f => (
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
                    {renderChart(item.chart_spec)}
                  </div>
                )}

                {/* Excel badge */}
                {item.type === 'excel' && item.excel_spec && (
                  <div className="flex items-center gap-2 bg-[#4fc093]/10 border border-[#4fc093]/20 rounded-lg px-3 py-2 w-fit">
                    <span className="material-symbols-outlined text-[#4fc093] text-[14px]">table_chart</span>
                    <span className="text-[#4fc093] text-xs">{item.excel_spec.filename || 'export.xlsx'}</span>
                  </div>
                )}

                {/* Timestamp */}
                <p className="text-white/20 text-[0.6rem] mt-auto pt-2 border-t border-white/5">
                  Saved {new Date(item.savedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
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