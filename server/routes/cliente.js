import express from 'express';
import { getClientes } from '../controllers/clienteController.js';

const router = express.Router();

// GET /api/clientes
router.get('/', getClientes);

export default router;
