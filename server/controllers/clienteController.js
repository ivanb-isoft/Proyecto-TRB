import pool from '../config/database.js';

export const getClientes = async (req, res) => {
  try {
    const query = `
      SELECT
        clienteid,
        clientenombre,
        clienteactivo,
        clientefechaalta,
        clientefechabaja
      FROM public.cliente
      ORDER BY clienteid
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de clientes',
    });
  }
};
