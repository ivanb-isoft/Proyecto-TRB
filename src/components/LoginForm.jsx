import { useState, useEffect } from 'react'
import { authService } from '../services/authService'

const initialForm = {
  email: '',
  password: '',
}

function LoginForm({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = 'Login'
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedEmail = formData.email.trim()
    const trimmedPassword = formData.password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setError('Por favor, complete todos los campos.')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError('Por favor, ingrese un email válido.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await authService.login(trimmedEmail, trimmedPassword)
      
      if (response.success) {
        onLogin(response.user)
        setFormData(initialForm)
      } else {
        setError(response.message || 'Error en el login')
      }
    } catch (error) {
      setError(error.message || 'Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <section className="login-hero">
        <div className="hero-content">
          <p className="hero-kicker">Bienvenido a</p>
          <img className="hero-logo" src="/logoTRB.svg" alt="TRB" />
          <p className="hero-subtitle">por Intersoft S.A.</p>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-panel__content">
          <div className="login-logo">
            <img src="/intersoft-logo.svg" alt="Intersoft" />
          </div>
          <h2 className="login-heading">Iniciar Sesión</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresá tu email"
                autoComplete="email"
                required
              />
            </label>
            <label className="form-field">
              <span>Contraseña</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresá tu contraseña"
                autoComplete="current-password"
                required
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <div className="form-footer">
              <div className="auth-links">
                <a className="forgot-link" href="#recuperar-contraseña">
                  ¿Olvidaste tu contraseña?
                </a>
                {onSwitchToRegister && (
                  <button 
                    type="button" 
                    className="register-link"
                    onClick={onSwitchToRegister}
                  >
                    ¿No tienes cuenta? Regístrate
                  </button>
                )}
              </div>
              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default LoginForm

