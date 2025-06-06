require('dotenv').config()

//prueba de githubaction prueba webhook

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

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.post('/github-webhook/', (req, res) => {
  console.log('Payload recibido:', req.body);

  // Aquí puedes hacer lo que necesites con la información, por ejemplo:
  // validar el evento, ejecutar un script, disparar un CI/CD, etc.

  res.status(200).send('Webhook recibido correctamente');
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