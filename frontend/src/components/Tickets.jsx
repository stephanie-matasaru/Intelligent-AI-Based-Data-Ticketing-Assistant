import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import * as XLSX from 'xlsx'

function Tickets() {
  const navigate = useNavigate()

  const [selectedTicket, setSelectedTicket] = useState(null)
  
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-12-31')

  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [project, setProject] = useState('')
  const [service, setService] = useState('')
  const [assignee, setAssignee] = useState('')

  const [projectOptions, setProjectOptions] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [assigneeOptions, setAssigneeOptions] = useState([])

  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

  const [displayedTickets, setDisplayedTickets] = useState([])
  const [totalTickets, setTotalTickets] = useState(0)

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer); 
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/dropdown/projects')
      .then(res => res.json())
      .then(data => setProjectOptions(data.items || []))
      .catch(err => console.error("Error loading projects:", err));

    fetch('http://127.0.0.1:8000/api/dropdown/services')
      .then(res => res.json())
      .then(data => setServiceOptions(data.items || []))
      .catch(err => console.error("Error loading services:", err));

    fetch('http://127.0.0.1:8000/api/dropdown/assignees')
      .then(res => res.json())
      .then(data => setAssigneeOptions(data.items || []))
      .catch(err => console.error("Error loading assignees:", err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      page: currentPage,
      page_size: rowsPerPage,
      status: status,
      priority: priority,
    });

    if (search) params.append('search', search);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (project) params.append('project', project);
    if (service) params.append('service', service);
    if (assignee) params.append('assignee', assignee);

    const url = `http://127.0.0.1:8000/api/tickets/?${params.toString()}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setDisplayedTickets(data.items || []);
        setTotalTickets(data.total || 0);
      })
      .catch(error => console.error("Error fetching tickets:", error));
      
  }, [currentPage, rowsPerPage, search, startDate, endDate, status, priority, project, service, assignee]);


  const totalPages = Math.ceil(totalTickets / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;


  const calculateTimeRemaining = (estimatedResolution, status) => {
    if (!estimatedResolution) return <span className="text-white/30">-</span>;
    
    if (status === 'Resolved' || status === 'Closed') {
      return <span className="text-green-400">Completed</span>;
    }

    const targetTime = new Date(estimatedResolution).getTime();
    const now = currentTime.getTime();
    const difference = targetTime - now;

    const absoluteDiff = Math.abs(difference);
    const hours = Math.floor(absoluteDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absoluteDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (difference < 0) {
      return <span className="text-red-400 font-bold">Overdue by {hours}h {minutes}m</span>;
    }

    return <span className="text-[#A1CEBC]">{hours}h {minutes}m</span>;
  };

  const exportToExcel = () => {
    if (displayedTickets.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = [
      "ID", "Time Remaining", "Incident Number", "Priority", 
      "Assignee", "Status", "Start Date", "Resolution Date", 
      "Last Modified", "Service", "Project", "Assigned Group"
    ];

    const dataRows = displayedTickets.map(ticket => [
      ticket.ticket_id,
      ticket.pending_duration || "0",
      ticket.ticket_number,
      ticket.priority || "Unknown",
      ticket.assigned_person,
      ticket.status,
      ticket.submit_datetime ? new Date(ticket.submit_datetime).toLocaleString() : "",
      ticket.estimated_resolution ? new Date(ticket.estimated_resolution).toLocaleString() : "",
      ticket.last_modified ? new Date(ticket.last_modified).toLocaleString() : "",
      ticket.service,
      ticket.project,
      ticket.team
    ]);

    const worksheetData = [headers, ...dataRows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    const fileName = `Tickets_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="bg-[#0f0f1e] text-white font-body h-screen flex flex-col overflow-hidden">
      
      <Navbar/>

      <main className="flex flex-1 overflow-hidden">
        
        <section className="flex-grow flex flex-col p-6 w-full overflow-hidden">
          
          <div className="mb-6 flex-shrink-0">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-white">
              Ticket Queue
            </h1>
          </div>

          {/* top filter bar */}
          <div className="bg-[#13132a] border border-white/5 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end flex-shrink-0 shadow-lg"
            role="search"
            aria-label="Filter tickets">
            
            <div className="flex flex-col gap-1">
              <div className="bg-[#0a0a1a] flex items-center px-3 py-2.5 rounded-lg border border-white/10 w-48 focus-within:border-[#A1CEBC] transition-colors">
                <span className="material-symbols-outlined text-white/40 mr-2 text-[18px]" aria-hidden="true">search</span>
                <input 
                  type="text" 
                  placeholder="Search"
                  aria-label="Search tickets"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1" htmlFor="start-date">Start Date</label>
              <div className="bg-[#0a0a1a] flex items-center px-3 py-2.5 rounded-lg border border-white/10 focus-within:border-[#A1CEBC] transition-colors">
                <input 
                  id="start-date"
                  type="date" 
                  value={startDate}
                  aria-label="Filter start date"
                  onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent border-none outline-none text-white text-sm w-32 cursor-pointer [color-scheme:dark]" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1" htmlFor="end-date">End Date</label>
              <div className="bg-[#0a0a1a] flex items-center px-3 py-2.5 rounded-lg border border-white/10 focus-within:border-[#A1CEBC] transition-colors">
                <input 
                  id="end-date"
                  type="date" 
                  value={endDate}
                  aria-label="Filter end date"
                  onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent border-none outline-none text-white text-sm w-32 cursor-pointer [color-scheme:dark]" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1" htmlFor="status-filter">Status</label>
              <div className="relative">
                <select 
                  id="status-filter"
                  aria-label="Filter by status"
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="all">All</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]" aria-hidden="true">expand_more</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1" htmlFor="priority-filter">Priority</label>
              <div className="relative">
                <select 
                  id="priority-filter"
                  aria-label="Filter by priority"
                  value={priority}
                  onChange={(e) => { setPriority(e.target.value); setCurrentPage(1); }}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="all">All</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]" aria-hidden="true">expand_more</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1" htmlFor="project-filter">Project</label>
              <div className="relative">
                <select 
                  id="project-filter"
                  aria-label="Filter by project"
                  value={project}
                  onChange={(e) => { setProject(e.target.value); setCurrentPage(1); }}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="">All Projects</option>
                  {projectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]" aria-hidden="true">expand_more</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1" htmlFor="service-filter">Service</label>
              <div className="relative">
                <select 
                  id="service-filter"
                  aria-label="Filter by service"
                  value={service}
                  onChange={(e) => { setService(e.target.value); setCurrentPage(1); }}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="">All Services</option>
                  {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]" aria-hidden="true">expand_more</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1" htmlFor="assignee-filter">Assignee</label>
              <div className="relative">
                <select 
                  id="assignee-filter"
                  aria-label="Filter by assignee"
                  value={assignee}
                  onChange={(e) => { setAssignee(e.target.value); setCurrentPage(1); }}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="">All Assignees</option>
                  {assigneeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]" aria-hidden="true">expand_more</span>
              </div>
             </div>

              <button
                onClick={exportToExcel}
                aria-label="Export tickets to Excel"
                className="ml-auto bg-[#4fc093] hover:bg-[#A1CEBC] text-[#0f0f1e] font-bold text-sm px-6 py-2.5 rounded-lg uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(79,192,147,0.3)]">
                 Export
              </button>
          </div>

          {/* data table */}
          <div className="flex-1 overflow-auto bg-[#13132a] rounded-xl border border-white/5 shadow-xl">
            <table className="w-full text-left border-collapse whitespace-nowrap" role="grid" aria-label="Tickets table" aria-rowcount={totalTickets}>
              <thead className="sticky top-0 z-10 bg-[#000000] border-b border-white/10 shadow-sm">
                <tr className="text-[0.6875rem] uppercase tracking-widest text-[#A1CEBC] font-label">
                  <th className="p-4 font-semibold" scope="col">#</th>
                  <th className="p-4 font-semibold" scope="col">Time Remaining</th>
                  <th className="p-4 font-semibold" scope="col">Incident Number</th>
                  <th className="p-4 font-semibold" scope="col">Priority</th>
                  <th className="p-4 font-semibold" scope="col">Assignee</th>
                  <th className="p-4 font-semibold" scope="col">Status</th>
                  <th className="p-4 font-semibold" scope="col">Start Date</th>
                  <th className="p-4 font-semibold" scope="col">Resolution Date</th>
                  <th className="p-4 font-semibold" scope="col">Last Modified</th>
                  <th className="p-4 font-semibold" scope="col">Service</th>
                  <th className="p-4 font-semibold" scope="col">Project</th>
                  <th className="p-4 font-semibold" scope="col">Assigned Group</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {displayedTickets.map((ticket) => (
                  <tr key={ticket.ticket_id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => setSelectedTicket(ticket)}
                    aria-label={`Ticket ${ticket.ticket_number}, priority ${ticket.priority}, status ${ticket.status}`}>
                    <td className="p-4 text-white/50 group-hover:text-white transition-colors">{ticket.ticket_id}</td>
                    <td className="p-4 font-mono">{calculateTimeRemaining(ticket.estimated_resolution, ticket.status)}</td>
                    <td className="p-4 text-white">{ticket.ticket_number}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        ticket.priority === 'Critical' ? 'bg-red-500/20 text-red-500' : 
                        ticket.priority === 'High' ? 'bg-orange-500/20 text-orange-400' : 
                        ticket.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {ticket.priority || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4 text-white/80">{ticket.assigned_person}</td>
                    <td className="p-4 text-white/80">{ticket.status}</td>
                    <td className="p-4 text-white/50">{ticket.submit_datetime ? new Date(ticket.submit_datetime).toLocaleString() : ''}</td>
                    <td className="p-4 text-white/50">{ticket.estimated_resolution ? new Date(ticket.estimated_resolution).toLocaleString() : ''}</td>
                    <td className="p-4 text-white/50">{ticket.last_modified ? new Date(ticket.last_modified).toLocaleString() : ''}</td>
                    <td className="p-4 text-white/80">{ticket.service}</td>
                    <td className="p-4 text-white/80">{ticket.project}</td>
                    <td className="p-4 text-white/80">{ticket.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* footer */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-[#13132a] px-6 py-4 rounded-xl border border-white/5 shadow-lg flex-shrink-0 relative overflow-hidden"
            role="navigation"
            aria-label="Pagination">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B4D90]"></div>

            <div className="font-headline font-bold text-white tracking-widest uppercase text-sm mb-4 sm:mb-0" aria-live="polite" aria-atomic="true">
              Ticket Count : <span className="text-[#A1CEBC] ml-2 text-lg">{totalTickets}</span>
            </div>

            <div className="flex items-center gap-6 text-[0.6875rem] text-white/50 font-label uppercase tracking-widest">
              
              <div className="flex items-center gap-2">
                <label htmlFor="rows-per-page">Rows per page:</label>
                <div className="relative">
                  <select 
                    id="rows-per-page"
                    aria-label="Rows per page"
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-transparent text-white font-bold outline-none appearance-none pr-5 cursor-pointer hover:text-[#A1CEBC] transition-colors"
                  >
                    <option value={10} className="bg-[#0a0a1a]">10</option>
                    <option value={25} className="bg-[#0a0a1a]">25</option>
                    <option value={50} className="bg-[#0a0a1a]">50</option>
                    <option value={100} className="bg-[#0a0a1a]">100</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[16px]" aria-hidden="true">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span aria-live="polite" aria-atomic="true">{totalTickets === 0 ? 0 : startIndex + 1}–{Math.min(currentPage * rowsPerPage, totalTickets)} of {totalTickets}</span>
                <div className="flex gap-1">
                  
                  <span 
                    role="button"
                    tabIndex={currentPage === 1 ? -1 : 0}
                    aria-label="Previous page"
                    aria-disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`material-symbols-outlined text-[18px] transition-colors ${currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'cursor-pointer hover:text-white'}`}
                  >
                    chevron_left
                  </span>
                  
                  <span 
                    role="button"
                    tabIndex={currentPage === totalPages || totalPages === 0 ? -1 : 0}
                    aria-label="Next page"
                    aria-disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={`material-symbols-outlined text-[18px] transition-colors ${currentPage === totalPages || totalPages === 0 ? 'text-white/20 cursor-not-allowed' : 'cursor-pointer hover:text-white'}`}
                  >
                    chevron_right
                  </span>
                  
                </div>
              </div>

            </div>

          </div>

        </section>

      </main> 

      {selectedTicket && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedTicket(null)} />
          <div className="fixed right-0 top-0 h-full w-[480px] bg-[#13132a] border-l border-white/10 z-50 overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/10">
              <div>
                <p className="text-[0.625rem] uppercase tracking-widest text-[#A1CEBC] mb-1">Ticket</p>
                <h2 className="text-xl font-bold text-white">{selectedTicket.ticket_number}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-white/30 hover:text-white transition-colors mt-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Badges */}
            <div className="flex gap-2 px-6 py-4 border-b border-white/5">
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                selectedTicket.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                selectedTicket.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                selectedTicket.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>{selectedTicket.priority || 'Unknown'}</span>
              <span className="px-2 py-1 rounded text-xs font-bold bg-white/10 text-white/70">{selectedTicket.status}</span>
              {selectedTicket.estimated_resolution && new Date(selectedTicket.estimated_resolution) < new Date() && selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Closed' && (
                <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400">SLA Breached</span>
              )}
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-5 p-6">
              
              {[
                { label: 'Company', value: selectedTicket.company },
                { label: 'Project', value: selectedTicket.project },
                { label: 'Team', value: selectedTicket.team },
                { label: 'Assigned To', value: selectedTicket.assigned_person },
                { label: 'Service', value: selectedTicket.service },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[0.625rem] uppercase tracking-widest text-white/30 mb-1">{label}</p>
                  <p className="text-white/80 text-sm">{value || '—'}</p>
                </div>
              ))}

              <div>
                <p className="text-[0.625rem] uppercase tracking-widest text-white/30 mb-1">Description</p>
                <p className="text-white/80 text-sm leading-relaxed bg-black/20 rounded-lg p-3">{selectedTicket.description || '—'}</p>
              </div>

              {selectedTicket.notes && (
                <div>
                  <p className="text-[0.625rem] uppercase tracking-widest text-white/30 mb-1">Notes</p>
                  <p className="text-white/80 text-sm leading-relaxed bg-black/20 rounded-lg p-3">{selectedTicket.notes}</p>
                </div>
              )}

              {selectedTicket.resolution && (
                <div>
                  <p className="text-[0.625rem] uppercase tracking-widest text-white/30 mb-1">Resolution</p>
                  <p className="text-white/80 text-sm leading-relaxed bg-black/20 rounded-lg p-3">{selectedTicket.resolution}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4">
                {[
                  { label: 'Submitted', value: selectedTicket.submit_datetime },
                  { label: 'Estimated Resolution', value: selectedTicket.estimated_resolution },
                  { label: 'Resolved', value: selectedTicket.resolved_datetime },
                  { label: 'Closed', value: selectedTicket.closed_datetime },
                  { label: 'Last Modified', value: selectedTicket.last_modified },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[0.625rem] uppercase tracking-widest text-white/30 mb-1">{label}</p>
                    <p className="text-white/70 text-xs font-mono">{value ? new Date(value).toLocaleString() : '—'}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  )
}

export default Tickets