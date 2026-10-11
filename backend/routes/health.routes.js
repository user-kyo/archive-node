const express = require('express');
const prisma = require('../config/db');
const { getDaemonStatus } = require('../services/nltkService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let dbStatus = 'ok';
    let noteCount = 0;
    try {
      noteCount = await prisma.note.count();
    } catch (err) {
      dbStatus = 'error: ' + err.message;
    }

    const nltkStatus = (typeof getDaemonStatus === 'function')
      ? getDaemonStatus()
      : { isReady: false, cacheSize: 0, pythonBin: 'py' };

    res.json({
      status: dbStatus === 'ok' ? 'healthy' : 'degraded',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        totalNotes: noteCount
      },
      nlpDaemon: {
        status: nltkStatus.isReady ? 'ready' : 'initializing',
        cacheSize: nltkStatus.cacheSize,
        pythonBin: nltkStatus.pythonBin
      }
    });
  } catch (error) {
    console.error('Healthcheck error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
