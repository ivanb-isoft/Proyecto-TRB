const menuItems = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'concepto', label: 'Concepto', icon: 'cog' },
  { id: 'equipo', label: 'Equipo', icon: 'users' },
  { id: 'departamentos', label: 'Departamentos', icon: 'grid' },
  { id: 'proveedores', label: 'Proveedores', icon: 'cart' },
  { id: 'profesionales', label: 'Profesionales', icon: 'user' },
  { id: 'clientes', label: 'Clientes', icon: 'briefcase' },
  { id: 'proyectos', label: 'Proyectos', icon: 'folder' },
  { id: 'carga-horas', label: 'Carga de Horas', icon: 'clock' },
]

function SlideMenu({ isOpen, onClose, currentView, onNavigate }) {
  const handleItemClick = (itemId) => {
    if (itemId === 'home' && currentView !== 'home') {
      onNavigate?.('home')
      onClose()
    } else if (itemId === 'carga-horas' && currentView !== 'timesheet') {
      onNavigate?.('timesheet')
      onClose()
    } else {
      onClose()
    }
  }

  return (
    <>
      <div className={`slide-menu ${isOpen ? 'open' : ''}`}>
        <div className="slide-menu__header">
          <div className="menu-brand">
            <span className="menu-logo-mark">I</span>
            <span className="menu-logo-text">Intersoft</span>
          </div>
          <button type="button" className="icon-button close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <nav className="slide-menu__nav">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={
                  (item.id === 'home' && currentView === 'home') ||
                  (item.id === 'carga-horas' && currentView === 'timesheet')
                    ? 'active'
                    : ''
                }
              >
                <button type="button" onClick={() => handleItemClick(item.id)}>
                  <span className={`menu-icon icon-${item.icon}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`slide-menu__backdrop ${isOpen ? 'visible' : ''}`} onClick={onClose} />
    </>
  )
}

export default SlideMenu

