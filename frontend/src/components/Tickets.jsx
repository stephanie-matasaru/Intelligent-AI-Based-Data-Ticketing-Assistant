import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import * as XLSX from 'xlsx'

function Tickets() {
  const navigate = useNavigate()
  
  // text & date filters
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-12-31')

  // dropdown selection states 
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [project, setProject] = useState('')
  const [service, setService] = useState('')
  const [assignee, setAssignee] = useState('')

  // dropdown options 
  const [projectOptions, setProjectOptions] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [assigneeOptions, setAssigneeOptions] = useState([])

  // Pagination states
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

  // table data states
  const [displayedTickets, setDisplayedTickets] = useState([])
  const [totalTickets, setTotalTickets] = useState(0)

  // fetch dropdown options
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

  // main ticket fetch
  useEffect(() => {
    const params = new URLSearchParams({
      page: currentPage,
      page_size: rowsPerPage,
      status: status,
      priority: priority,
    });

    //append optional parameters if they have value
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

  // export to excel 
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
          <div className="bg-[#13132a] border border-white/5 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end flex-shrink-0 shadow-lg">
            
            <div className="flex flex-col gap-1">
              <div className="bg-[#0a0a1a] flex items-center px-3 py-2.5 rounded-lg border border-white/10 w-48 focus-within:border-[#A1CEBC] transition-colors">
                <span className="material-symbols-outlined text-white/40 mr-2 text-[18px]">search</span>
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
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
                  onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
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
                  onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent border-none outline-none text-white text-sm w-32 cursor-pointer [color-scheme:dark]" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">Status</label>
              <div className="relative">
                <select 
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
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]">expand_more</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">Priority</label>
              <div className="relative">
                <select 
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
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]">expand_more</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">Project</label>
              <div className="relative">
                <select 
                  value={project}
                  onChange={(e) => { setProject(e.target.value); setCurrentPage(1); }}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="">All Projects</option>
                  {projectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]">expand_more</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">Service</label>
              <div className="relative">
                <select 
                  value={service}
                  onChange={(e) => { setService(e.target.value); setCurrentPage(1); }}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="">All Services</option>
                  {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]">expand_more</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.625rem] text-white/50 uppercase tracking-widest font-label ml-1">Assignee</label>
              <div className="relative">
                <select 
                  value={assignee}
                  onChange={(e) => { setAssignee(e.target.value); setCurrentPage(1); }}
                  className="bg-[#0a0a1a] text-white text-sm px-3 py-2.5 rounded-lg border border-white/10 outline-none appearance-none pr-8 cursor-pointer w-full min-w-[120px]"
                >
                  <option value="">All Assignees</option>
                  {assigneeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none text-[20px]">expand_more</span>
              </div>
             </div>

              <button onClick={exportToExcel} className="ml-auto bg-[#4fc093] hover:bg-[#A1CEBC] text-[#0f0f1e] font-bold text-sm px-6 py-2.5 rounded-lg uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(79,192,147,0.3)]">
                 Export
              </button>
          </div>

          {/* data table */}
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
                  <th className="p-4 font-semibold">Last Modified</th>
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
                      {/* Note: The DB now returns the string (e.g., 'Critical') in ticket.priority */}
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
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-[#13132a] px-6 py-4 rounded-xl border border-white/5 shadow-lg flex-shrink-0 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B4D90]"></div>

            <div className="font-headline font-bold text-white tracking-widest uppercase text-sm mb-4 sm:mb-0">
              Ticket Count : <span className="text-[#A1CEBC] ml-2 text-lg">{totalTickets}</span>
            </div>

            <div className="flex items-center gap-6 text-[0.6875rem] text-white/50 font-label uppercase tracking-widest">
              
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <div className="relative">
                  <select 
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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

              <div className="flex items-center gap-4">
                <span>{totalTickets === 0 ? 0 : startIndex + 1}–{Math.min(currentPage * rowsPerPage, totalTickets)} of {totalTickets}</span>
                <div className="flex gap-1">
                  
                  <span 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`material-symbols-outlined text-[18px] transition-colors ${currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'cursor-pointer hover:text-white'}`}
                  >
                    chevron_left
                  </span>
                  
                  <span 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
    </div>
  )
}

export default Tickets