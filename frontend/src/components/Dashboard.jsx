import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import './Dashboard.css'
import bgImage from '../assets/dash_background.jpg'

const CURRENT_USER = 'test'

const NAV_CARDS = [
  {
    id: 'tickets',
    icon: 'confirmation_number',
    label: 'Tickets',
    description: 'View & manage all tickets',
    accent: '#4a9edd',
    route: '/tickets',
  },
  {
    id: 'workspace',
    icon: 'dashboard_customize',
    label: 'My Workspace',
    description: 'Your saved insights & charts',
    accent: '#e05c5c',
    route: '/workspace',
  },
  {
    id: 'chatbot',
    icon: 'robot',
    label: 'AI Chatbot',
    description: 'Talk to the AI analyst',
    accent: '#7b6cf6',
    route: '/chat',
  },
  {
    id: 'charts',
    icon: 'bar_chart',
    label: 'Charts',
    description: 'KPI & analytics dashboard',
    accent: '#4fc093',
    route: '/graphs',
  },
]

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="db-root" style={{ backgroundImage: `url(${bgImage})` }}>
      <Navbar />

      <main className="db-main" role="main">

        {/* Header */}
        <div className="db-header">
          <div>
            <p className="db-logged-in">
              <span className="material-symbols-outlined db-user-icon" aria-hidden="true">account_circle</span>
              Logged in as <strong>{CURRENT_USER}</strong>
            </p>
            <h1 className="db-app-title">AI Ticketing Assistant</h1>
            <div className="db-live-row" role="status" aria-label="System is active">
              <div className="ai-pulse" aria-hidden="true" />
              <span className="db-live-label">System Active</span>
            </div>
          </div>
        </div>

        <div className="db-cards-grid" role="list" aria-label="Navigation options">
          {NAV_CARDS.map((card) => (
            <button
              key={card.id}
              className="db-card"
              style={{ '--card-accent': card.accent }}
              onClick={() => navigate(card.route)}
              aria-label={`${card.label}: ${card.description}`}
              role="listitem"
            >
              <div className="db-card-icon-wrap">
                <span
                  className="material-symbols-outlined db-card-icon"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  {card.icon}
                </span>
              </div>
              <div className="db-card-body">
                <span className="db-card-label">{card.label}</span>
                <span className="db-card-desc">{card.description}</span>
              </div>
              <span className="material-symbols-outlined db-card-arrow" aria-hidden="true">arrow_forward</span>
            </button>
          ))}
        </div>

      </main>
    </div>
  )
}

export default Dashboard