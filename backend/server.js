require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const adminRoutes = require('./routes/admin');

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://tu-app.netlify.app', // ⬅️ Agrega tu URL de Netlify
    'https://cruz-verde-sistema.netlify.app' // Ejemplo
  ],
  credentials: true
};

app.use(cors(corsOptions));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🏥 API Cruz Verde funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});