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

// Multer config
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
  limits: { fileSize: 5 * 1024 * 1024 },
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

// 🔍 SCAN A PEST
app.post('/api/scan', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const userId = '00000000-0000-0000-0000-000000000000';

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

    await pool.query(
      `INSERT INTO scans (user_id, image_url, pest_id, confidence_percent, ai_raw_response, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        imageUrl,
        pestId,
        confidencePercent,
        JSON.stringify({ detected: commonName, confidence: confidencePercent }),
        'pending'
      ]
    );

    res.json({
      common_name: commonName,
      treatment_guidance: treatmentGuidance,
      confidence_percent: confidencePercent,
    });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: 'Scan processing failed' });
  }
});

// 📜 GET SCAN HISTORY
app.get('/api/history', async (req, res) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000000';
    const result = await pool.query(`
      SELECT 
        s.id,
        s.image_url,
        s.confidence_percent,
        s.scanned_at,
        s.status,
        p.common_name AS pest_name,
        p.treatment_guidance
      FROM scans s
      LEFT JOIN pests p ON s.pest_id = p.id
      WHERE s.user_id = $1
      ORDER BY s.scanned_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ✏️ UPDATE SCAN STATUS
app.patch('/api/scans/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'treated') {
    return res.status(400).json({ error: 'Only "treated" status is allowed' });
  }

  try {
    const userId = '00000000-0000-0000-0000-000000000000';
    const result = await pool.query(
      'UPDATE scans SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING id',
      [status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    res.json({ success: true, status });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ☁️ LOG WEATHER REPORT
app.post('/api/weather-report', async (req, res) => {
  try {
    const { location, summary } = req.body;
    const userId = '00000000-0000-0000-0000-000000000000';

    await pool.query(
      `INSERT INTO weather_reports (user_id, location, summary)
       VALUES ($1, $2, $3)`,
      [userId, location, summary]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Weather report log error:', err);
    res.status(500).json({ error: 'Failed to log weather report' });
  }
});

// 👤 GET PROFILE + FULL ACTIVITY LOG
app.get('/api/profile', async (req, res) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000000';

    // User
    const userResult = await pool.query(
      'SELECT name, email, location, farm_type FROM users WHERE id = $1',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    // Stats
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*)::int AS total_scans,
        COUNT(DISTINCT pest_id) FILTER (WHERE pest_id IS NOT NULL)::int AS pests_identified,
        COUNT(*) FILTER (WHERE status = 'treated')::int AS treatment_applied
      FROM scans 
      WHERE user_id = $1
    `, [userId]);
    const stats = statsResult.rows[0];

    // Activity
    const activity = [];

    // Pest scans
    const scans = await pool.query(`
      SELECT scanned_at, confidence_percent, p.common_name
      FROM scans s
      LEFT JOIN pests p ON s.pest_id = p.id
      WHERE s.user_id = $1
      ORDER BY s.scanned_at DESC
      LIMIT 3
    `, [userId]);
    scans.rows.forEach(row => {
      activity.push({
        action: 'Pest Scan',
        details: row.common_name 
          ? `${row.common_name} identified (${row.confidence_percent}% confidence)`
          : 'Unknown pest scanned',
        time: new Date(row.scanned_at).toISOString()
      });
    });

    // Weather reports
    const weather = await pool.query(`
      SELECT location, summary, created_at
      FROM weather_reports
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 2
    `, [userId]);
    weather.rows.forEach(row => {
      activity.push({
        action: 'Weather Report',
        details: row.summary,
        time: new Date(row.created_at).toISOString()
      });
    });

    // Profile update (simulated)
    activity.push({
      action: 'Profile Updated',
      details: `Farm location changed to ${user.location || 'your area'}`,
      time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Sort & format
    activity.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivity = activity.slice(0, 6).map(item => ({
      ...item,
      time: new Date(item.time).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));

    res.json({ user, stats, recentActivity });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// Serve uploaded images
app.use('/uploads', express.static(UPLOADS_DIR));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Crop Shield backend running on http://localhost:${PORT}`);
});