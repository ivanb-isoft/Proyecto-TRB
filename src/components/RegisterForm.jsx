import { useState, useEffect } from 'react'
import { authService } from '../services/authService'

const initialForm = {
  email: '',
  password: '',
  confirmPassword: '',
  nombre: '',
  apellido: '',
}

function RegisterForm({ onRegisterSuccess, onBackToLogin }) {
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = 'Registro de Usuario'
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
    if (success) {
      setSuccess('')
    }
  }

  const validateForm = () => {
    const { email, password, confirmPassword, nombre, apellido } = formData

    if (!email.trim() || !password.trim() || !nombre.trim() || !apellido.trim()) {
      setError('Todos los campos son requeridos.')
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Por favor, ingrese un email válido.')
      return false
    }

    // Validate password length
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return false
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return false
    }

    // Validate name fields
    if (nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.')
      return false
    }

    if (apellido.trim().length < 2) {
      setError('El apellido debe tener al menos 2 caracteres.')
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await authService.register(
        formData.email.trim(),
        formData.password,
        formData.nombre.trim(),
        formData.apellido.trim()
      )
      
      if (response.success) {
        setSuccess('Usuario registrado exitosamente. Ahora puede iniciar sesión.')
        setFormData(initialForm)
        
        // Opcional: llamar callback si se proporciona
        if (onRegisterSuccess) {
          setTimeout(() => {
            onRegisterSuccess(response.user)
          }, 2000)
        }
      } else {
        setError(response.message || 'Error en el registro')
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
          <p className="hero-kicker">Registro en</p>
          <img className="hero-logo" src="/logoTRB.svg" alt="TRB" />
          <p className="hero-subtitle">por Intersoft S.A.</p>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-panel__content">
          <div className="login-logo">
            <img src="/intersoft-logo.svg" alt="Intersoft" />
          </div>
          <h2 className="login-heading">Registrar Usuario</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-field">
                <span>Nombre</span>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresá tu nombre"
                  autoComplete="given-name"
                  required
                />
              </label>
              <label className="form-field">
                <span>Apellido</span>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ingresá tu apellido"
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>
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
                placeholder="Ingresá tu contraseña (mín. 6 caracteres)"
                autoComplete="new-password"
                required
              />
            </label>
            <label className="form-field">
              <span>Confirmar Contraseña</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmá tu contraseña"
                autoComplete="new-password"
                required
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <div className="form-footer">
              <button 
                type="button" 
                className="back-link"
                onClick={onBackToLogin}
              >
                ← Volver al Login
              </button>
              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrar Usuario'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default RegisterForm
