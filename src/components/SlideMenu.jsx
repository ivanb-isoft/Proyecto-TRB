import { useState } from 'react'
import './SlideMenu.css'

const menuStructure = [
  {
    id: 'home',
    label: 'Inicio',
    icon: 'home',
    type: 'item',
  },
  {
    id: 'maestros',
    label: 'Maestros',
    icon: 'checklist',
    type: 'section',
    items: [
      { id: 'concepto', label: 'Concepto', icon: 'cog' },
      { id: 'departamentos', label: 'Departamentos', icon: 'grid' },
      { id: 'proveedores', label: 'Proveedores', icon: 'cart' },
      { id: 'profesionales', label: 'Profesionales', icon: 'user' },
      { id: 'proyectos', label: 'Proyectos', icon: 'folder' },
      { id: 'clientes', label: 'Clientes', icon: 'briefcase' },
    ],
  },
  {
    id: 'costos',
    label: 'Costos',
    icon: 'dollar',
    type: 'section',
    items: [
      { id: 'carga-horas', label: 'Carga de Horas', icon: 'clock' },
      { id: 'reportes', label: 'Reportes', icon: 'report' },
      { id: 'detalle-horas-profesional', label: 'Detalle de Horas por Profesional', icon: 'user-clock' },
      { id: 'detalle-horas', label: 'Detalle de Horas', icon: 'hours' },
      { id: 'reportes-calidad', label: 'Reportes de Calidad', icon: 'quality' },
    ],
  },
]

function SlideMenu({ isOpen, onClose, currentView, onNavigate }) {
  const [expandedSections, setExpandedSections] = useState(['maestros'])

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleItemClick = (itemId) => {
    if (itemId === 'home' && currentView !== 'home') {
      onNavigate?.('home')
      onClose()
    } else if (itemId === 'carga-horas' && currentView !== 'timesheet') {
      onNavigate?.('timesheet')
      onClose()
    } else if (itemId === 'clientes' && currentView !== 'clientes') {
      onNavigate?.('clientes')
      onClose()
    } else {
      onClose()
    }
  }

  const isItemActive = (itemId) => {
    if (itemId === 'home' && currentView === 'home') return true
    if (itemId === 'carga-horas' && currentView === 'timesheet') return true
    if (itemId === 'clientes' && currentView === 'clientes') return true
    return false
  }

  return (
    <>
      <div className={`slide-menu ${isOpen ? 'open' : ''}`}>
        <div className="slide-menu__header">
          <div className="menu-brand">
            <img src="/logoIntersoftSinBordes.png" alt="Intersoft" className="menu-logo-img" />
          </div>
          <button type="button" className="icon-button close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <nav className="slide-menu__nav">
          <ul>
            {menuStructure.map((item) => {
              if (item.type === 'item') {
                return (
                  <li key={item.id} className={isItemActive(item.id) ? 'active' : ''}>
                    <button type="button" onClick={() => handleItemClick(item.id)}>
                      <span className={`menu-icon icon-${item.icon}`} aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              }

              if (item.type === 'section') {
                const isExpanded = expandedSections.includes(item.id)
                return (
                  <li key={item.id} className="menu-section">
                    <button
                      type="button"
                      className="menu-section-header"
                      onClick={() => toggleSection(item.id)}
                    >
                      <span className={`menu-icon icon-${item.icon}`} aria-hidden="true" />
                      <span>{item.label}</span>
                      <span className={`menu-section-toggle ${isExpanded ? 'expanded' : ''}`}></span>
                    </button>
                    {isExpanded && (
                      <ul className="menu-section-items">
                        {item.items.map((subItem) => (
                          <li
                            key={subItem.id}
                            className={isItemActive(subItem.id) ? 'active' : ''}
                          >
                            <button
                              type="button"
                              onClick={() => handleItemClick(subItem.id)}
                            >
                              <span className={`menu-icon icon-${subItem.icon}`} aria-hidden="true" />
                              <span>{subItem.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              }
              return null
            })}
          </ul>
        </nav>
      </div>
      <div className={`slide-menu__backdrop ${isOpen ? 'visible' : ''}`} onClick={onClose} />
    </>
  )
}

export default SlideMenu

