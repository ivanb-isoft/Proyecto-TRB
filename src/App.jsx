import { useState } from 'react'
import LoginForm from './components/LoginForm'
import Timesheet from './components/Timesheet'
import './App.css'

function App() {
  const [session, setSession] = useState({
    isAuthenticated: false,
    user: null,
  })

  const handleLogin = (user) => {
    setSession({
      isAuthenticated: true,
      user,
    })
  }

  const handleLogout = () => {
    setSession({
      isAuthenticated: false,
      user: null,
    })
  }

  return (
    <div className="app-shell">
      {session.isAuthenticated ? (
        <Timesheet user={session.user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
