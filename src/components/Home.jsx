import { useState, useEffect } from 'react'
import SlideMenu from './SlideMenu'

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

// Mock data - replace with real data from API
const activeProjects = [
  {
    cliente: 'Intersoft',
    proyecto: 'Capacitación',
    depto: 'Calidad',
    hsContr: 0,
    hsCarg: 20292.88,
  },
  {
    cliente: 'Intersoft',
    proyecto: 'Soporte/Gestión Clientes',
    depto: 'Servicios',
    hsContr: 0,
    hsCarg: 21771.0,
  },
  {
    cliente: 'Intersoft',
    proyecto: 'Comercial',
    depto: 'Comercial',
    hsContr: 0,
    hsCarg: 1629.75,
  },
  {
    cliente: 'Intersoft',
    proyecto: 'Ausencias justificadas',
    depto: 'Administración',
    hsContr: 0,
    hsCarg: 14386.03,
  },
  {
    cliente: 'Intersoft',
    proyecto: 'TRB - Sistema de control de Horas',
    depto: 'Software Factory',
    hsContr: 0,
    hsCarg: 1319.33,
  },
  {
    cliente: 'Intersoft',
    proyecto: 'Reuniones',
    depto: 'Administración',
    hsContr: 0,
    hsCarg: 4373.75,
  },
  {
    cliente: 'Intersoft',
    proyecto: 'Dictado de Capacitación',
    depto: 'Calidad',
    hsContr: 0,
    hsCarg: 715.0,
  },
  {
    cliente: 'Intersoft',
    proyecto: 'Proyecto/Gestión Interna',
    depto: 'Software Factory',
    hsContr: 0,
    hsCarg: 1198.67,
  },
  {
    cliente: 'Intersoft',
    proyecto: 'Soporte/Gestión Interna',
    depto: 'Servicios',
    hsContr: 0,
    hsCarg: 9534.92,
  },
  {
    cliente: 'Intersoft',
    proyecto: 'Suite SaaS (SSO)',
    depto: 'Software Factory',
    hsContr: 0,
    hsCarg: 700.0,
  },
]

function Home({ user, onLogout, onNavigateToTimesheet, onNavigateToClientes }) {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('Noviembre')
  const [selectedYear, setSelectedYear] = useState(2023)
  const [projectFilter, setProjectFilter] = useState('')
  const [professionalFilter, setProfessionalFilter] = useState('')
  const [professionalMovementFilter, setProfessionalMovementFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('13/11/2025')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Actualizar el título de la pestaña cuando se monta el componente
  useEffect(() => {
    document.title = 'Inicio'
  }, [])

  // Mock data
  const totalToLoad = 160
  const loaded = 144
  const missingToLoad = 16
  const totalProjects = 47
  const activeProjectsCount = 26
  const inactiveProjectsCount = 21

  const handleLoadMissingHours = () => {
    onNavigateToTimesheet()
  }

  const totalPages = Math.ceil(activeProjects.length / itemsPerPage)
  const paginatedProjects = activeProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className={`home-layout ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="brand-accent" />
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => setMenuOpen(false)}
        currentView="home"
        onNavigate={(view) => {
          if (view === 'timesheet' || view === 'carga-horas') {
            onNavigateToTimesheet()
          } else if (view === 'clientes' && onNavigateToClientes) {
            onNavigateToClientes()
          }
        }}
      />
      <header className="home-header">
        <div className="header-left">
          <button
            type="button"
            className="logo-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <img src="/logoIntersoftReducido.png" alt="Intersoft" />
          </button>
          <div className="login-logo">
          </div>
        </div>
        <div className="header-actions">
          {user && (
            <span className="user-name">
              {user.nombre} {user.apellido}
            </span>
          )}
          <button type="button" className="icon-button user-icon-button" aria-label="Usuario">
            👤
          </button>
        </div>
      </header>

      <main className="home-main">
        {/* MIS HORAS Section */}
        <section className="home-section">
          <h2 className="section-title">MIS HORAS</h2>
          <div className="hours-controls">
            <div className="date-selectors">
              <label className="form-field">
                <span>Mes</span>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Año</span>
                <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="hours-cards">
              <div className="hours-card hours-card-yellow">
                <div className="hours-card-icon">🕐</div>
                <div className="hours-card-content">
                  <div className="hours-card-label">TOTAL A CARGAR</div>
                  <div className="hours-card-value">{totalToLoad}</div>
                </div>
              </div>
              <div className="hours-card hours-card-yellow-orange">
                <div className="hours-card-icon">🕐</div>
                <div className="hours-card-content">
                  <div className="hours-card-label">CARGADAS</div>
                  <div className="hours-card-value">{loaded}</div>
                </div>
              </div>
              <div className="hours-card hours-card-orange">
                <div className="hours-card-icon">🕐</div>
                <div className="hours-card-content">
                  <div className="hours-card-label">FALTA CARGAR</div>
                  <div className="hours-card-value">{missingToLoad}</div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="primary-button load-hours-button"
              onClick={handleLoadMissingHours}
            >
              Cargar horas faltantes
            </button>
          </div>
        </section>

        {/* Project Status Section */}
        <section className="home-section">
          <div className="status-cards">
            <div className="status-card status-card-blue">
              <div className="status-card-icon">📄</div>
              <div className="status-card-content">
                <div className="status-card-label">PROYECTOS</div>
                <div className="status-card-value">{totalProjects}</div>
              </div>
            </div>
            <div className="status-card status-card-green">
              <div className="status-card-icon">📄</div>
              <div className="status-card-content">
                <div className="status-card-label">ACTIVOS</div>
                <div className="status-card-value">{activeProjectsCount}</div>
              </div>
            </div>
            <div className="status-card status-card-grey">
              <div className="status-card-icon">📄</div>
              <div className="status-card-content">
                <div className="status-card-label">INACTIVOS</div>
                <div className="status-card-value">{inactiveProjectsCount}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tables Section */}
        <section className="tables-section">
          {/* Active Projects Table */}
          <div className="table-container">
            <h3 className="table-title">PROYECTOS ACTIVOS</h3>
            <div className="table-filters">
              <label className="form-field">
                <span>Desde</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Hasta</span>
                <input
                  type="text"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="DD/MM/YYYY"
                />
              </label>
              <label className="form-field">
                <span>Proyecto</span>
                <input
                  type="text"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  placeholder="Buscar proyecto"
                />
              </label>
            </div>
            <div className="table-wrapper">
              <table className="home-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Proyecto</th>
                    <th>Depto.</th>
                    <th>HsContr</th>
                    <th>HsCarg</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProjects.map((project, index) => (
                    <tr key={index}>
                      <td>{project.cliente}</td>
                      <td>{project.proyecto}</td>
                      <td>{project.depto}</td>
                      <td>{project.hsContr}</td>
                      <td>{project.hsCarg.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <button
                type="button"
                className="pagination-button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                &lt;&lt;
              </button>
              <button
                type="button"
                className="pagination-button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <button
                type="button"
                className="pagination-button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
              <button
                type="button"
                className="pagination-button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                &gt;&gt;
              </button>
            </div>
          </div>

          {/* Hours by Professionals Table */}
          <div className="table-container">
            <h3 className="table-title">HORAS POR PROFESIONALES</h3>
            <div className="table-filters">
              <label className="form-field">
                <span>Profesional</span>
                <input
                  type="text"
                  value={professionalFilter}
                  onChange={(e) => setProfessionalFilter(e.target.value)}
                  placeholder="Buscar profesional"
                />
              </label>
            </div>
            <div className="table-wrapper">
              <table className="home-table">
                <thead>
                  <tr>
                    <th>Profesional</th>
                    <th>Horas Totales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="empty-table-message">
                      No hay datos disponibles
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Movements by Professional Table */}
          <div className="table-container">
            <h3 className="table-title">MOVIMIENTOS POR PROFESIONAL</h3>
            <div className="table-filters">
              <label className="form-field">
                <span>Profesional</span>
                <input
                  type="text"
                  value={professionalMovementFilter}
                  onChange={(e) => setProfessionalMovementFilter(e.target.value)}
                  placeholder="Buscar profesional"
                />
              </label>
            </div>
            <div className="table-wrapper">
              <table className="home-table">
                <thead>
                  <tr>
                    <th>Nombre y Apellido</th>
                    <th>Fecha</th>
                    <th>Horas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="3" className="empty-table-message">
                      No hay datos disponibles
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="version-info">Version 2.6 25/07/2023</div>
      </footer>
    </div>
  )
}

export default Home

