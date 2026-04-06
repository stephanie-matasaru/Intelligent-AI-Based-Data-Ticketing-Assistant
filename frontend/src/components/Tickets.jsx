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
  },
  {
    ticket_id: 1045,
    pending_duration: "1h 10m",
    ticket_number: "INC-2026-067",
    priority_id: "P2 - High",
    assigned_person: "David Kim",
    status: "In Progress",
    submit_datetime: "02/04/2026 14:20",
    estimated_resolution: "02/04/2026 18:00",
    last_modified: "02/04/2026 15:00",
    service: "Email Services",
    project: "Exchange Migration",
    team: "SysAdmin",
  },
  {
    ticket_id: 1046,
    pending_duration: "48h 0m",
    ticket_number: "REQ-2026-102",
    priority_id: "P4 - Low",
    assigned_person: "Unassigned",
    status: "Open",
    submit_datetime: "02/05/2026 09:00",
    estimated_resolution: "02/10/2026 17:00",
    last_modified: "02/05/2026 09:00",
    service: "Software Licensing",
    project: "Q1 Renewals",
    team: "IT Procurement",
  },
  {
    ticket_id: 1047,
    pending_duration: "0h 15m",
    ticket_number: "INC-2026-088",
    priority_id: "P1 - Critical",
    assigned_person: "Maria Garcia",
    status: "Assigned",
    submit_datetime: "02/06/2026 10:45",
    estimated_resolution: "02/06/2026 12:45",
    last_modified: "02/06/2026 10:50",
    service: "Cloud Infrastructure",
    project: "AWS Production",
    team: "Cloud Ops",
  },
  {
    ticket_id: 1048,
    pending_duration: "12h 30m",
    ticket_number: "REQ-2026-115",
    priority_id: "P3 - Moderate",
    assigned_person: "Alex Vance",
    status: "Pending",
    submit_datetime: "02/07/2026 16:30",
    estimated_resolution: "02/09/2026 12:00",
    last_modified: "02/08/2026 09:15",
    service: "Hardware Provisioning",
    project: "Device Refresh",
    team: "IT Support Desk",
  },
  {
    ticket_id: 1049,
    pending_duration: "3h 45m",
    ticket_number: "INC-2026-092",
    priority_id: "P2 - High",
    assigned_person: "Sarah Chen",
    status: "Resolved",
    submit_datetime: "02/08/2026 11:15",
    estimated_resolution: "02/08/2026 16:00",
    last_modified: "02/08/2026 15:30",
    service: "Database Access",
    project: "ERP Upgrade",
    team: "Data Team",
  },
  {
    ticket_id: 1050,
    pending_duration: "1h 0m",
    ticket_number: "INC-2026-095",
    priority_id: "P3 - Moderate",
    assigned_person: "James Wilson",
    status: "In Progress",
    submit_datetime: "02/09/2026 13:00",
    estimated_resolution: "02/09/2026 17:00",
    last_modified: "02/09/2026 13:30",
    service: "Active Directory",
    project: "Security Audit",
    team: "Identity Access",
  },
  {
    ticket_id: 1051,
    pending_duration: "24h 20m",
    ticket_number: "REQ-2026-120",
    priority_id: "P4 - Low",
    assigned_person: "Elena Rostova",
    status: "Pending",
    submit_datetime: "02/10/2026 08:30",
    estimated_resolution: "02/15/2026 17:00",
    last_modified: "02/11/2026 09:00",
    service: "Intranet Portal",
    project: "Content Migration",
    team: "Web Services",
  },
  {
    ticket_id: 1052,
    pending_duration: "0h 45m",
    ticket_number: "INC-2026-104",
    priority_id: "P1 - Critical",
    assigned_person: "Unassigned",
    status: "Open",
    submit_datetime: "02/11/2026 15:45",
    estimated_resolution: "02/11/2026 17:45",
    last_modified: "02/11/2026 15:45",
    service: "Network Connectivity",
    project: "Office Expansion",
    team: "Network Security",
  },
  {
    ticket_id: 1053,
    pending_duration: "5h 15m",
    ticket_number: "REQ-2026-132",
    priority_id: "P3 - Moderate",
    assigned_person: "Marcus Johnson",
    status: "In Progress",
    submit_datetime: "02/12/2026 09:15",
    estimated_resolution: "02/13/2026 12:00",
    last_modified: "02/12/2026 11:30",
    service: "VPN Access",
    project: "Remote Workforce",
    team: "Network Security",
  },
  {
    ticket_id: 1054,
    pending_duration: "2h 30m",
    ticket_number: "INC-2026-112",
    priority_id: "P2 - High",
    assigned_person: "David Kim",
    status: "Assigned",
    submit_datetime: "02/13/2026 14:00",
    estimated_resolution: "02/13/2026 18:00",
    last_modified: "02/13/2026 14:15",
    service: "Email Services",
    project: "Exchange Migration",
    team: "SysAdmin",
  },
  {
    ticket_id: 1055,
    pending_duration: "72h 0m",
    ticket_number: "REQ-2026-145",
    priority_id: "P4 - Low",
    assigned_person: "Alex Vance",
    status: "Closed",
    submit_datetime: "02/14/2026 10:00",
    estimated_resolution: "02/18/2026 17:00",
    last_modified: "02/17/2026 16:45",
    service: "Software Licensing",
    project: "Q1 Renewals",
    team: "IT Procurement",
  },
  {
    ticket_id: 1056,
    pending_duration: "0h 10m",
    ticket_number: "INC-2026-125",
    priority_id: "P1 - Critical",
    assigned_person: "Maria Garcia",
    status: "Resolved",
    submit_datetime: "02/15/2026 08:00",
    estimated_resolution: "02/15/2026 10:00",
    last_modified: "02/15/2026 09:45",
    service: "Cloud Infrastructure",
    project: "AWS Production",
    team: "Cloud Ops",
  },
  {
    ticket_id: 1057,
    pending_duration: "18h 45m",
    ticket_number: "REQ-2026-158",
    priority_id: "P3 - Moderate",
    assigned_person: "Unassigned",
    status: "Open",
    submit_datetime: "02/16/2026 16:15",
    estimated_resolution: "02/18/2026 12:00",
    last_modified: "02/16/2026 16:15",
    service: "Hardware Provisioning",
    project: "New Hire Onboarding",
    team: "IT Support Desk",
  },
  {
    ticket_id: 1058,
    pending_duration: "4h 20m",
    ticket_number: "INC-2026-138",
    priority_id: "P2 - High",
    assigned_person: "Sarah Chen",
    status: "In Progress",
    submit_datetime: "02/17/2026 11:40",
    estimated_resolution: "02/17/2026 16:00",
    last_modified: "02/17/2026 13:00",
    service: "Database Access",
    project: "ERP Upgrade",
    team: "Data Team",
  },
  {
    ticket_id: 1059,
    pending_duration: "2h 15m",
    ticket_number: "REQ-2026-170",
    priority_id: "P3 - Moderate",
    assigned_person: "Elena Rostova",
    status: "Assigned",
    submit_datetime: "02/18/2026 13:45",
    estimated_resolution: "02/20/2026 17:00",
    last_modified: "02/18/2026 14:00",
    service: "Intranet Portal",
    project: "Content Migration",
    team: "Web Services",
  },
  {
    ticket_id: 1060,
    pending_duration: "0h 30m",
    ticket_number: "INC-2026-150",
    priority_id: "P1 - Critical",
    assigned_person: "Marcus Johnson",
    status: "In Progress",
    submit_datetime: "02/19/2026 09:30",
    estimated_resolution: "02/19/2026 11:30",
    last_modified: "02/19/2026 09:45",
    service: "Network Connectivity",
    project: "Office Expansion",
    team: "Network Security",
  },
  {
    ticket_id: 1061,
    pending_duration: "6h 0m",
    ticket_number: "REQ-2026-182",
    priority_id: "P3 - Moderate",
    assigned_person: "James Wilson",
    status: "Pending",
    submit_datetime: "02/20/2026 10:00",
    estimated_resolution: "02/23/2026 12:00",
    last_modified: "02/20/2026 14:00",
    service: "Active Directory",
    project: "Security Audit",
    team: "Identity Access",
  },
  {
    ticket_id: 1062,
    pending_duration: "1h 45m",
    ticket_number: "INC-2026-165",
    priority_id: "P2 - High",
    assigned_person: "Maria Garcia",
    status: "Resolved",
    submit_datetime: "02/23/2026 15:15",
    estimated_resolution: "02/23/2026 19:00",
    last_modified: "02/23/2026 16:45",
    service: "Cloud Infrastructure",
    project: "AWS Production",
    team: "Cloud Ops",
  },
  {
    ticket_id: 1063,
    pending_duration: "96h 0m",
    ticket_number: "REQ-2026-195",
    priority_id: "P4 - Low",
    assigned_person: "Unassigned",
    status: "Open",
    submit_datetime: "02/24/2026 08:00",
    estimated_resolution: "03/01/2026 17:00",
    last_modified: "02/24/2026 08:00",
    service: "Software Licensing",
    project: "Q1 Renewals",
    team: "IT Procurement",
  },
  {
    ticket_id: 1064,
    pending_duration: "3h 10m",
    ticket_number: "INC-2026-178",
    priority_id: "P2 - High",
    assigned_person: "Alex Vance",
    status: "In Progress",
    submit_datetime: "02/25/2026 11:50",
    estimated_resolution: "02/25/2026 16:00",
    last_modified: "02/25/2026 13:00",
    service: "Email Services",
    project: "Exchange Migration",
    team: "SysAdmin",
  },
  {
    ticket_id: 1065,
    pending_duration: "0h 5m",
    ticket_number: "INC-2026-190",
    priority_id: "P1 - Critical",
    assigned_person: "David Kim",
    status: "Assigned",
    submit_datetime: "02/26/2026 14:55",
    estimated_resolution: "02/26/2026 16:55",
    last_modified: "02/26/2026 15:00",
    service: "Database Access",
    project: "ERP Upgrade",
    team: "Data Team",
  },
  {
    ticket_id: 1066,
    pending_duration: "8h 30m",
    ticket_number: "REQ-2026-210",
    priority_id: "P3 - Moderate",
    assigned_person: "Sarah Chen",
    status: "Closed",
    submit_datetime: "02/27/2026 09:30",
    estimated_resolution: "03/02/2026 17:00",
    last_modified: "02/28/2026 11:15",
    service: "Hardware Provisioning",
    project: "Device Refresh",
    team: "IT Support Desk",
  },
  {
    ticket_id: 1067,
    pending_duration: "1h 20m",
    ticket_number: "INC-2026-205",
    priority_id: "P3 - Moderate",
    assigned_person: "Elena Rostova",
    status: "In Progress",
    submit_datetime: "03/02/2026 10:40",
    estimated_resolution: "03/02/2026 15:00",
    last_modified: "03/02/2026 11:00",
    service: "Intranet Portal",
    project: "Content Migration",
    team: "Web Services",
  }
]

function Tickets() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-12-31')

  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')

  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  
  const displayedTickets = MOCK_TICKETS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(MOCK_TICKETS.length / rowsPerPage);

  

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
              <div className="relative">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="all">All</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">Priority</label>
              <div className="relative">
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="all">All</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {['Projects', 'Service', 'Queue', 'Assignee'].map((filter) => (
              <div key={filter} className="flex flex-col gap-1">
                <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1 opacity-0">{filter}</label>
                <div className="relative">
                  <select className="bg-[#0a0a1a] text-white/80 text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[100px]">
                    <option>{filter}</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
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
                {displayedTickets.map((ticket) => (
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

          {/* --- Ticket Count Footer for the Mock Data --- */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-[#13132a] px-6 py-4 rounded-xl border border-white/5 shadow-lg flex-shrink-0 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B4D90]"></div>

            <div className="font-headline font-bold text-white tracking-widest uppercase text-sm mb-4 sm:mb-0">
              Ticket Count : <span className="text-[#A1CEBC] ml-2 text-lg">{MOCK_TICKETS.length}</span>
            </div>

            <div className="flex items-center gap-6 text-[0.6875rem] text-white/50 font-label uppercase tracking-widest">
              
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <div className="relative">
                  <select 
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="bg-transparent text-white font-bold outline-none appearance-none pr-5 cursor-pointer hover:text-[#A1CEBC] transition-colors"
                  >
                    <option value={10} className="bg-[#0a0a1a]">10</option>
                    <option value={25} className="bg-[#0a0a1a]">25</option>
                    <option value={50} className="bg-[#0a0a1a]">50</option>
                    <option value={100} className="bg-[#0a0a1a]">100</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[16px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              {/* functional pagination text and arrow */}
              <div className="flex items-center gap-4">
                <span>{startIndex + 1}–{Math.min(endIndex, MOCK_TICKETS.length)} of {MOCK_TICKETS.length}</span>
                <div className="flex gap-1">
                  
                  {/* Left Arrow */}
                  <span 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`material-symbols-outlined text-[18px] transition-colors ${currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'cursor-pointer hover:text-white'}`}
                  >
                    chevron_left
                  </span>
                  
                  {/* Right Arrow */}
                  <span 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={`material-symbols-outlined text-[18px] transition-colors ${currentPage === totalPages ? 'text-white/20 cursor-not-allowed' : 'cursor-pointer hover:text-white'}`}
                  >
                    chevron_right
                  </span>
                  
                </div>
              </div>

            </div>

          </div>

        </section>

        

      </main>
    </div>
  )
}

export default Tickets