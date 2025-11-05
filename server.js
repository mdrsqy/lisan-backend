require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const userRoutes = require('./src/routes/userRoutes');

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Gateway server berjalan di http://localhost:${port}`);
});