const { getOcrWorker } = require('./services/ocrService');

(async () => {
  try {
    const worker = await getOcrWorker();
    console.log('Worker initialized successfully');
    process.exit(0);
  } catch (err) {
    console.error('Worker initialization failed:', err);
    process.exit(1);
  }
})();
