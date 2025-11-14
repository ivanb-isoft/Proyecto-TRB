import { useEffect, useState } from 'react';
import SlideMenu from './SlideMenu';
import { clienteService } from '../services/clienteService';

function Clientes({ user, onLogout, onNavigateToHome }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await clienteService.getClientes();
        setClientes(result.data || []);
      } catch (err) {
        setError(err.message || 'Error al cargar clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  return (
    <div className="timesheet-layout">
      <div className="brand-accent" />
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => setMenuOpen(false)}
        currentView="clientes"
        onNavigate={(view) => {
          if (view === 'home' && onNavigateToHome) {
            onNavigateToHome();
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
        <section className="entries-card">
          <h2 className="section-title">Clientes</h2>
          {loading && <p>Cargando clientes...</p>}
          {error && !loading && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <div className="table-wrapper">
              <table className="entries-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Activo</th>
                    <th>Fecha Alta</th>
                    <th>Fecha Baja</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-table-message">
                        No hay clientes para mostrar
                      </td>
                    </tr>
                  ) : (
                    clientes.map((cliente) => (
                      <tr key={cliente.clienteid}>
                        <td>{cliente.clienteid}</td>
                        <td>{cliente.clientenombre}</td>
                        <td>{cliente.clienteactivo ? 'Sí' : 'No'}</td>
                        <td>{cliente.clientefechaalta}</td>
                        <td>{cliente.clientefechabaja || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Clientes;
