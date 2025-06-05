const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Servidor test funcionando');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor test escuchando en puerto ${port}`);
});
