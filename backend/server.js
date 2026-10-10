const os = require('os');
const app = require('./app');
const prisma = require('./config/db');

const hostFlagIdx = process.argv.indexOf('--host');
const portFlagIdx = process.argv.indexOf('--port');

const HOST = process.env.HOST || (hostFlagIdx !== -1 && process.argv[hostFlagIdx + 1] ? process.argv[hostFlagIdx + 1] : '0.0.0.0');
const PORT = process.env.PORT || (portFlagIdx !== -1 && process.argv[portFlagIdx + 1] ? process.argv[portFlagIdx + 1] : 3000);

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`ArchiveNode backend running at:`);
  console.log(`  > Local:   http://localhost:${PORT}`);
  if (HOST === '0.0.0.0') {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`  > Network: http://${net.address}:${PORT}`);
        }
      }
    }
  } else {
    console.log(`  > Network: http://${HOST}:${PORT}`);
  }
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;
