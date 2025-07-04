require('dotenv').config()

//prueba de githubaction prueba webhook 1800

const express = require('express');
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(express.json()); // importante para parsear JSON en el body

// Aquí agregar la ruta para el webhook
app.post('/github-webhook', (req, res) => {
  console.log('Webhook recibido:', req.body);
  // Aquí puedes hacer lo que quieras con la data del webhook
  res.status(200).send('Webhook recibido');
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});