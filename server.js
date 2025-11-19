const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
// const announcementRoutes = require('./src/routes/announcementRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
// app.use('/api/announcements', announcementRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));