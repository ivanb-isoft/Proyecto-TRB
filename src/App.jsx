import { useState } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Home from './components/Home'
import Timesheet from './components/Timesheet'
import Clientes from './components/Clientes'
import './App.css'

function App() {
  const [session, setSession] = useState({
    isAuthenticated: false,
    user: null,
  })
  const [currentView, setCurrentView] = useState('home')
  const [authView, setAuthView] = useState('login') // 'login' or 'register'

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
    } else if (view === 'clientes') {
      setCurrentView('clientes')
    } else if (view === 'register') {
      setCurrentView('register')
    }
  }

  const handleRegisterSuccess = (user) => {
    // Opcional: auto-login después del registro
    // handleLogin(user)
    // O simplemente volver al login
    setAuthView('login')
  }

  return (
    <div className="app-shell">
      {session.isAuthenticated ? (
        currentView === 'home' ? (
          <Home
            user={session.user}
            onLogout={handleLogout}
            onNavigateToTimesheet={() => handleNavigate('timesheet')}
            onNavigateToClientes={() => handleNavigate('clientes')}
          />
        ) : currentView === 'timesheet' ? (
          <Timesheet
            user={session.user}
            onLogout={handleLogout}
            onNavigateToHome={() => handleNavigate('home')}
            onNavigateToClientes={() => handleNavigate('clientes')}
          />
        ) : (
          <Clientes
            user={session.user}
            onLogout={handleLogout}
            onNavigateToHome={() => handleNavigate('home')}
          />
        )
      ) : (
        authView === 'login' ? (
          <LoginForm 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            onBackToLogin={() => setAuthView('login')}
          />
        )
      )}
    </div>
  )
}

export default App
