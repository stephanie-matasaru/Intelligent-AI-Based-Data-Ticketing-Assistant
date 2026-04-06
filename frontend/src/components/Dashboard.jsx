import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import './Dashboard.css'

const CURRENT_USER = 'test' // e.g. 'admin', 'test'

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
    id: 'alerts',
    icon: 'traffic',
    label: 'Alerts',
    description: 'Active system alerts',
    accent: '#e05c5c',
    route: '/alerts',
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
    route: '/graphs#priority',
  },
  {
    id: 'piechart',
    icon: 'donut_large',
    label: 'Pie Chart',
    description: 'Distribution breakdown',
    accent: '#e09a3a',
    route: '/graphs#sla',
  },
  {
    id: 'incidents',
    icon: 'crisis_alert',
    label: 'Daily Incidents',
    description: "Today's incident log",
    accent: '#e0d43a',
    route: '/incidents',
  },
]

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="db-root">
      <Navbar />

      <main className="db-main">

        {/* Header */}
        <div className="db-header">
          <div>
            <p className="db-logged-in">
              <span className="material-symbols-outlined db-user-icon">account_circle</span>
              Logged in as <strong>{CURRENT_USER}</strong>
            </p>
            <h1 className="db-app-title">AI Ticketing Assistant</h1>
            <div className="db-live-row">
              <div className="ai-pulse" />
              <span className="db-live-label">System Active</span>
            </div>
          </div>

          {/* Background placeholder */}
          <div className="db-hero-image">
            <div className="db-hero-placeholder">
              {/* Replace this div with: <img src="your-image.png" alt="hero" /> */}
              <span className="material-symbols-outlined db-hero-icon">image</span>
              <span className="db-hero-hint">Add your image here</span>
            </div>
          </div>
        </div>

        <div className="db-cards-grid">
          {NAV_CARDS.map((card) => (
            <button
              key={card.id}
              className="db-card"
              style={{ '--card-accent': card.accent }}
              onClick={() => navigate(card.route)}
            >
              <div className="db-card-icon-wrap">
                <span
                  className="material-symbols-outlined db-card-icon"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {card.icon}
                </span>
              </div>
              <div className="db-card-body">
                <span className="db-card-label">{card.label}</span>
                <span className="db-card-desc">{card.description}</span>
              </div>
              <span className="material-symbols-outlined db-card-arrow">arrow_forward</span>
            </button>
          ))}
        </div>

      </main>
    </div>
  )
}

export default Dashboard
