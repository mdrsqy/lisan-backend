const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const userRoutes = require('../src/routes/userRoute');
const announcementRoutes = require('../src/routes/announcementRoute');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);

module.exports = app;
module.exports.handler = serverless(app);