import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Chatbot from './components/Chatbot'
import Tickets from './components/Tickets'
import Graphs from './components/Graphs'
import Dashboard from './components/Dashboard'
import MyWorkspace from './components/MyWorkspace'
import Settings from './components/Settings'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/graphs" element = {<Graphs />} />
        <Route path="/dashboard" element = {<Dashboard />} />
        <Route path="/workspace" element={<MyWorkspace />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App