// backend/server.js
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(express.json());

// Multer config: save files to ./uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `pest-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Scan endpoint — now with real image upload and debug logs
app.post('/api/scan', upload.single('image'), async (req, res) => {
  console.log('🔍 Received request');
  console.log('📁 req.file:', req.file);
  console.log('📦 req.body:', req.body);

  if (!req.file) {
    console.log('❌ No file received!');
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    // Generate public URL (for local dev: use relative path)
    const imageUrl = `/uploads/${req.file.filename}`;

    // Simulate AI: pick random pest
    const pests = await pool.query('SELECT id, common_name, treatment_guidance FROM pests');
    let pestId = null;
    let commonName = 'Unknown Pest';
    let treatmentGuidance = 'No treatment available. Please consult an agronomist.';
    let confidencePercent = Math.floor(Math.random() * 30);

    if (pests.rows.length > 0 && Math.random() > 0.1) {
      const randomPest = pests.rows[Math.floor(Math.random() * pests.rows.length)];
      pestId = randomPest.id;
      commonName = randomPest.common_name;
      treatmentGuidance = randomPest.treatment_guidance;
      confidencePercent = 85 + Math.floor(Math.random() * 15);
    }

    // Save to scans table
    const userId = '00000000-0000-0000-0000-000000000000'; // placeholder
    await pool.query(
      `INSERT INTO scans (user_id, image_url, pest_id, confidence_percent, ai_raw_response)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        imageUrl,
        pestId,
        confidencePercent,
        JSON.stringify({ detected: commonName, confidence: confidencePercent })
      ]
    );

    // Return result to farmer
    res.json({
      common_name: commonName,
      treatment_guidance: treatmentGuidance,
      confidence_percent: confidencePercent,
    });

  } catch (err) {
    console.error('Scan error:', err);
    if (err.message === 'Only image files are allowed') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Scan processing failed' });
  }
});

// Serve uploaded images (for local dev only)
app.use('/uploads', express.static(UPLOADS_DIR));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📁 Uploads saved to: ${UPLOADS_DIR}`);
});

// Get scan history for current user (hardcoded for now)
app.get('/api/history', async (req, res) => {
  try {
    // For MVP: use test user ID
    const userId = '00000000-0000-0000-0000-000000000000';

    // Join scans with pests to get pest names and treatment guidance
    const result = await pool.query(`
      SELECT 
        s.id,
        s.image_url,
        s.confidence_percent,
        s.scanned_at,
        p.common_name AS pest_name,
        p.treatment_guidance
      FROM scans s
      JOIN pests p ON s.pest_id = p.id
      WHERE s.user_id = $1
      ORDER BY s.scanned_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});