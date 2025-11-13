import { useState, useEffect } from 'react'

const initialForm = {
  username: '',
  password: '',
}

function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')

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

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedUsername = formData.username.trim()
    const trimmedPassword = formData.password.trim()

    if (!trimmedUsername || !trimmedPassword) {
      setError('Por favor, complete todos los campos.')
      return
    }

    // Mock authentication - replace with real service when available
    onLogin({
      email: trimmedUsername,
    })
    setFormData(initialForm)
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
              <span>Usuario</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingresá tu usuario"
                autoComplete="username"
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
              <a className="forgot-link" href="#recuperar-contraseña">
                ¿Olvidaste tu contraseña?
              </a>
              <button type="submit" className="primary-button">
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default LoginForm

