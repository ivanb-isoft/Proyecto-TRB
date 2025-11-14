const API_BASE_URL = 'http://localhost:3001/api';

export const clienteService = {
  async getClientes() {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener clientes');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifique que el servidor esté ejecutándose.');
      }
      throw error;
    }
  },
};
