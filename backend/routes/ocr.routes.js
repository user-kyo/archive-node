const express = require('express');
const { processImageOcr } = require('../services/ocrService');

const router = express.Router();

// POST /api/ocr - Extract clean text and bounding boxes from image
router.post('/', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const cleanBase64 = image
      .replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '')
      .replace(/[\s\r\n]+/g, '');
    const imgBuffer = Buffer.from(cleanBase64, 'base64');

    if (!imgBuffer || imgBuffer.length === 0) {
      return res.status(400).json({ error: 'Invalid image buffer' });
    }

    const ocrResult = await processImageOcr(imgBuffer);
    res.json(ocrResult);
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Failed to process image with OCR' });
  }
});

module.exports = router;
