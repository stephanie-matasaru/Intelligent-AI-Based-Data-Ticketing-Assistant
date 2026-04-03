import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

// Mock data based 
const MOCK_TICKETS = [
  {
    ticket_id: 1042,
    pending_duration: "2h 15m", // Mapped to Time Remaining
    ticket_number: "INC-2026-001", // Mapped to Incident Number
    priority_id: "P1 - Critical",
    assigned_person: "Alex Vance",
    status: "In Progress",
    submit_datetime: "02/01/2026 09:30", // Start Date
    estimated_resolution: "02/01/2026 14:00", // Resolution Date
    last_modified: "02/01/2026 10:15",
    service: "Active Directory",
    project: "Network Migration",
    team: "Identity Access", // Assigned Group
  },
  {
    ticket_id: 1043,
    pending_duration: "5h 30m",
    ticket_number: "REQ-2026-089",
    priority_id: "P3 - Moderate",
    assigned_person: "Sarah Chen",
    status: "Assigned",
    submit_datetime: "02/02/2026 11:00",
    estimated_resolution: "02/05/2026 17:00",
    last_modified: "02/02/2026 11:05",
    service: "Hardware Provisioning",
    project: "New Hire Onboarding",
    team: "IT Support Desk",
  },
  {
    ticket_id: 1044,
    pending_duration: "0h",
    ticket_number: "INC-2026-042",
    priority_id: "P2 - High",
    assigned_person: "Unassigned",
    status: "Open",
    submit_datetime: "02/03/2026 08:15",
    estimated_resolution: "02/03/2026 12:00",
    last_modified: "02/03/2026 08:15",
    service: "VPN Access",
    project: "Remote Workforce",
    team: "Network Security",
  }
]

function Tickets() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-12-31')

  

  return (
    <div className="bg-[#0f0f1e] text-white font-body h-screen flex flex-col overflow-hidden">
      
      <Navbar/>

      <main className="flex flex-1 overflow-hidden">
        
        {/* Main Content Area */}
        <section className="flex-grow flex flex-col p-6 w-full overflow-hidden">
          
          {/* Header */}
          <div className="mb-6 flex-shrink-0">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-white">
              Ticket Queue
            </h1>
          </div>

          {/* Filter Bar (Matching your screenshot) */}
          <div className="bg-[#13132a] border border-white/5 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end flex-shrink-0 shadow-lg">
            
            <div className="flex flex-col gap-1">
              <div className="bg-[#0a0a1a] flex items-center px-3 py-2.5 rounded-lg border border-white/10 w-48 focus-within:border-[#A1CEBC] transition-colors">
                <span className="material-symbols-outlined text-white/40 mr-2 text-[18px]">search</span>
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">Start Date</label>
              <div className="bg-[#0a0a1a] flex items-center px-3 py-2.5 rounded-lg border border-white/10 focus-within:border-[#A1CEBC] transition-colors">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-sm w-32 cursor-pointer [color-scheme:dark]" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">End Date</label>
              <div className="bg-[#0a0a1a] flex items-center px-3 py-2.5 rounded-lg border border-white/10 focus-within:border-[#A1CEBC] transition-colors">
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-sm w-32 cursor-pointer [color-scheme:dark]" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">Status</label>
              <select className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 relative cursor-pointer min-w-[120px]">
                <option>Assigned</option>
                <option>Open</option>
                <option>In Progress</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">Priority</label>
              <select className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 relative cursor-pointer min-w-[120px]">
                <option value="">All Priorities</option>
                <option value="1">Critical</option>
                <option value="2">High</option>
                <option value="3">Medium</option>
                <option value="4">Low</option>
              </select>
            </div>

            {['Projects', 'Service', 'Queue', 'Assignee'].map((filter) => (
              <div key={filter} className="flex flex-col gap-1">
                <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1 opacity-0">{filter}</label>
                <select className="bg-[#0a0a1a] text-white/80 text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none cursor-pointer min-w-[100px]">
                  <option>{filter}</option>
                </select>
              </div>
            ))}

            <button className="ml-auto bg-[#4fc093] hover:bg-[#A1CEBC] text-[#0f0f1e] font-bold text-sm px-6 py-2.5 rounded-lg uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(79,192,147,0.3)]">
              Export
            </button>
          </div>

          {/* Data Table */}
          <div className="flex-1 overflow-auto bg-[#13132a] rounded-xl border border-white/5 shadow-xl">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-[#000000] border-b border-white/10 shadow-sm">
                <tr className="text-[0.6875rem] uppercase tracking-widest text-[#A1CEBC] font-label">
                  <th className="p-4 font-semibold">#</th>
                  <th className="p-4 font-semibold">Time Remaining</th>
                  <th className="p-4 font-semibold">Incident Number</th>
                  <th className="p-4 font-semibold">Priority</th>
                  <th className="p-4 font-semibold">Assignee</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Start Date</th>
                  <th className="p-4 font-semibold">Resolution Date</th>
                  <th className="p-4 font-semibold">Last Modified Date</th>
                  <th className="p-4 font-semibold">Service</th>
                  <th className="p-4 font-semibold">Project</th>
                  <th className="p-4 font-semibold">Assigned Group</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {MOCK_TICKETS.map((ticket) => (
                  <tr key={ticket.ticket_id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                    <td className="p-4 text-white/50 group-hover:text-white transition-colors">{ticket.ticket_id}</td>
                    <td className="p-4 text-[#A1CEBC] font-mono">{ticket.pending_duration}</td>
                    <td className="p-4 text-white">{ticket.ticket_number}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${ticket.priority_id.includes('P1') ? 'bg-red-500/20 text-red-300' : ticket.priority_id.includes('P2') ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {ticket.priority_id}
                      </span>
                    </td>
                    <td className="p-4 text-white/80">{ticket.assigned_person}</td>
                    <td className="p-4 text-white/80">{ticket.status}</td>
                    <td className="p-4 text-white/50">{ticket.submit_datetime}</td>
                    <td className="p-4 text-white/50">{ticket.estimated_resolution}</td>
                    <td className="p-4 text-white/50">{ticket.last_modified}</td>
                    <td className="p-4 text-white/80">{ticket.service}</td>
                    <td className="p-4 text-white/80">{ticket.project}</td>
                    <td className="p-4 text-white/80">{ticket.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        

      </main>
    </div>
  )
}

export default Tickets