import { useState } from 'react'

const initialForm = {
  email: '',
  password: '',
}

function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')

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
    const trimmedEmail = formData.email.trim()
    const trimmedPassword = formData.password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setError('Por favor, complete todos los campos.')
      return
    }

    // Mock authentication - replace with real service when available
    onLogin({
      email: trimmedEmail,
    })
    setFormData(initialForm)
  }

  return (
    <div className="login-screen">
      <div className="brand-accent" />
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-mark">I</span>
          <span className="logo-text">Intersoft</span>
        </div>
        <h1 className="login-title">Iniciar sesión</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu.email@empresa.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="primary-button">
            Confirmar
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm

