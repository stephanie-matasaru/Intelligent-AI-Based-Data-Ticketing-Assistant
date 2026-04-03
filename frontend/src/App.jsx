import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Chatbot from './components/Chatbot'
import Tickets from './components/Tickets'
import Graphics from './components/Graphs'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/graphs" element = {<Graphics/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App