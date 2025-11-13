import { useState } from 'react'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Timesheet from './components/Timesheet'
import './App.css'

function App() {
  const [session, setSession] = useState({
    isAuthenticated: false,
    user: null,
  })
  const [currentView, setCurrentView] = useState('home')

  const handleLogin = (user) => {
    setSession({
      isAuthenticated: true,
      user,
    })
    setCurrentView('home')
  }

  const handleLogout = () => {
    setSession({
      isAuthenticated: false,
      user: null,
    })
    setCurrentView('home')
  }

  const handleNavigate = (view) => {
    if (view === 'timesheet' || view === 'carga-horas') {
      setCurrentView('timesheet')
    } else if (view === 'home') {
      setCurrentView('home')
    }
  }

  return (
    <div className="app-shell">
      {session.isAuthenticated ? (
        currentView === 'home' ? (
          <Home
            user={session.user}
            onLogout={handleLogout}
            onNavigateToTimesheet={() => handleNavigate('timesheet')}
          />
        ) : (
          <Timesheet
            user={session.user}
            onLogout={handleLogout}
            onNavigateToHome={() => handleNavigate('home')}
          />
        )
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
