import { useMemo, useState } from 'react'
import SlideMenu from './SlideMenu'

const clients = ['Intersoft', 'Cliente Demo']

const projects = [
  { id: 'pe-gestion-interna', client: 'Intersoft', label: 'PE | Gestión Interna' },
  { id: 'capacitacion', client: 'Intersoft', label: 'CAPA | Capacitación' },
  { id: 'gespo', client: 'Intersoft', label: 'GESPO | Gestión/Seguime' },
  { id: 'demo-mejora', client: 'Cliente Demo', label: 'MEJORA | Proyecto Demo' },
]

const concepts = ['Horas profesionales', 'Capacitación', 'Gestión interna']

const tasks = [
  { id: 'mecon-mejora', label: 'MECON | Mejora Continua' },
  { id: 'gespo-revision', label: 'GESPO | Gestión/Seguime' },
  { id: 'daily-scrum', label: 'DSCRUM | Daily Scrum' },
  { id: 'capacitacion', label: 'CAPA | Capacitación' },
]

const stepMinutes = 15

const formatDate = (date) => date.toISOString().split('T')[0]

const getDayName = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
  })
    .format(date)
    .replace(/^\w/, (c) => c.toUpperCase())
}

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `entry-${Math.random().toString(16).slice(2)}`

const createEmptyEntry = (overrides = {}) => {
  const today = overrides.date ?? formatDate(new Date())
  const defaultClient = overrides.client ?? clients[0]
  const defaultProject =
    overrides.project ??
    projects.find((project) => project.client === defaultClient)?.id ??
    projects[0].id

  return {
    id: generateId(),
    day: getDayName(today),
    date: today,
    client: defaultClient,
    project: defaultProject,
    concept: overrides.concept ?? concepts[0],
    hours: overrides.hours ?? '01:00',
    task: overrides.task ?? tasks[0].id,
    description: overrides.description ?? '',
    ...overrides,
  }
}

function Timesheet({ user, onLogout, onNavigateToHome, onNavigateToClientes }) {
  const today = useMemo(() => new Date(), [])
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [filters, setFilters] = useState({
    client: clients[0],
    project: projects[0].id,
    concept: concepts[0],
    from: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    to: formatDate(today),
    assignDefaultHours: false,
  })

  const [entries, setEntries] = useState(() => [
    createEmptyEntry({ hours: '04:00', task: 'mecon-mejora' }),
    createEmptyEntry({
      date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
      hours: '04:00',
      task: 'mecon-mejora',
    }),
  ])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEntryChange = (id, field, value) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== id) {
          return entry
        }

        const updates = { ...entry, [field]: value }

        if (field === 'date') {
          updates.day = getDayName(value)
        }

        if (field === 'client') {
          const clientProjects = projects.filter((project) => project.client === value)
          if (!clientProjects.some((project) => project.id === updates.project)) {
            updates.project = clientProjects.length ? clientProjects[0].id : projects[0].id
          }
        }

        return updates
      }),
    )
  }

  const addEntryAfter = (index) => {
    setEntries((prev) => {
      const newEntry = createEmptyEntry()
      const next = [...prev]
      next.splice(index + 1, 0, newEntry)
      return next
    })
  }

  const removeEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div className="timesheet-layout">
      <div className="brand-accent" />
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => setMenuOpen(false)}
        currentView="timesheet"
        onNavigate={(view) => {
          if (view === 'home' && onNavigateToHome) {
            onNavigateToHome()
          } else if (view === 'clientes' && onNavigateToClientes) {
            onNavigateToClientes()
          }
        }}
      />
      <header className="timesheet-header">
        <div className="header-left">
          <button
            type="button"
            className="icon-button burger-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <div className="login-logo">
            <span className="logo-mark">I</span>
            <span className="logo-text">Intersoft</span>
          </div>
        </div>
        <div className="header-actions">
          <span className="user-email">{user?.email}</span>
          <button type="button" className="secondary-button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="timesheet-main">
        <section className="filters-card">
          <div className="filters-row">
            <label className="form-field">
              <span>Cliente</span>
              <select
                value={filters.client}
                onChange={(event) => handleFilterChange('client', event.target.value)}
              >
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Proyecto</span>
              <select
                value={filters.project}
                onChange={(event) => handleFilterChange('project', event.target.value)}
              >
                {projects
                  .filter((project) => project.client === filters.client)
                  .map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.label}
                    </option>
                  ))}
              </select>
            </label>
            <label className="form-field">
              <span>Concepto</span>
              <select
                value={filters.concept}
                onChange={(event) => handleFilterChange('concept', event.target.value)}
              >
                {concepts.map((concept) => (
                  <option key={concept} value={concept}>
                    {concept}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="filters-row">
            <label className="form-field">
              <span>Desde</span>
              <input
                type="date"
                value={filters.from}
                max={filters.to}
                onChange={(event) => handleFilterChange('from', event.target.value)}
              />
            </label>
            <label className="form-field">
              <span>Hasta</span>
              <input
                type="date"
                value={filters.to}
                min={filters.from}
                onChange={(event) => handleFilterChange('to', event.target.value)}
              />
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={filters.assignDefaultHours}
                onChange={(event) => handleFilterChange('assignDefaultHours', event.target.checked)}
              />
              <span>Asignar horas default</span>
            </label>
            <div className="filters-actions">
              <button type="button" className="secondary-button">
                Recargar Grilla
              </button>
              <button type="button" className="secondary-button">
                Mis horas
              </button>
            </div>
          </div>
          <p className="filters-hint">Haga click en Editar y utilice este campo para agregar una descripción</p>
        </section>
        <section className="entries-card">
          <table className="entries-table">
            <thead>
              <tr>
                <th aria-label="Acciones" />
                <th>Día</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Proyecto</th>
                <th>Concepto</th>
                <th>Hs.</th>
                <th>Tarea</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id}>
                  <td className="table-actions">
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => removeEntry(entry.id)}
                      aria-label="Eliminar registro"
                    >
                      ×
                    </button>
                  </td>
                  <td className="table-day">{entry.day}</td>
                  <td>
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(event) => handleEntryChange(entry.id, 'date', event.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      value={entry.client}
                      onChange={(event) => handleEntryChange(entry.id, 'client', event.target.value)}
                    >
                      {clients.map((client) => (
                        <option key={client} value={client}>
                          {client}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={entry.project}
                      onChange={(event) => handleEntryChange(entry.id, 'project', event.target.value)}
                    >
                      {projects
                        .filter((project) => project.client === entry.client)
                        .map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.label}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={entry.concept}
                      onChange={(event) =>
                        handleEntryChange(entry.id, 'concept', event.target.value)
                      }
                    >
                      {concepts.map((concept) => (
                        <option key={concept} value={concept}>
                          {concept}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="hours-cell">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="^([01]\\d|2[0-3]):[0-5]\\d$"
                      maxLength={5}
                      value={entry.hours}
                      onChange={(event) => {
                        const value = event.target.value.replace(/[^0-9:]/g, '')
                        handleEntryChange(entry.id, 'hours', value)
                      }}
                      placeholder="00:00"
                    />
                  </td>
                  <td>
                    <select
                      value={entry.task}
                      onChange={(event) => handleEntryChange(entry.id, 'task', event.target.value)}
                    >
                      {tasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <textarea
                      value={entry.description}
                      onChange={(event) =>
                        handleEntryChange(entry.id, 'description', event.target.value)
                      }
                      placeholder="Agregar detalles de la tarea"
                      rows={2}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <button type="button" className="primary-button" onClick={() => addEntryAfter(entries.length - 1)}>
              Agregar fila
            </button>
            <button type="button" className="primary-button outlined">
              Guardar cambios
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Timesheet

