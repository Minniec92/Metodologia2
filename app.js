import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import turnosRoutes from './src/routes/turnos.route.js';

const app = express();

// Necesario para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());

// 👉 Servir frontend correctamente (ruta absoluta)
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use('/api/turnos', turnosRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
