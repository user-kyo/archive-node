const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const ocrRoutes = require('./routes/ocr.routes');
const wordnetRoutes = require('./routes/wordnet.routes');
const notesRoutes = require('./routes/notes.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Process-level resilience for worker thread errors
process.on('uncaughtException', (err) => {
  console.error('Handled background exception:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('Handled background rejection:', reason);
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/wordnet', wordnetRoutes);
app.use('/api/notes', notesRoutes);

// Static file serving
const frontendDir = path.join(__dirname, '../frontend');
if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir));
}

// Fallback for SPA routing
app.use((req, res) => {
  const frontendIndex = path.join(frontendDir, 'index.html');
  if (fs.existsSync(frontendIndex)) {
    return res.sendFile(frontendIndex);
  }
  return res.status(404).send('Frontend not found');
});

module.exports = app;
