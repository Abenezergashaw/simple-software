require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('[CRASH] Uncaught Exception:', err.message, err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('[CRASH] Unhandled Rejection:', reason);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/projects');
const serviceRoutes = require('./src/routes/services');
const aboutRoutes = require('./src/routes/about');
const contactRoutes = require('./src/routes/contacts');
const financeRoutes = require('./src/routes/finance');
const userRoutes = require('./src/routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.on('error', (err) => console.error('[SERVER ERROR]', err.message));
