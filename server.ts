import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const app: Express = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';
const myIP = process.env.API_HOST || '192.168.96.142';
const dbName = process.env.DB_NAME || 'facefit_db';

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function md5Hash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

async function hashPassword(text: string): Promise<string> {
  return bcrypt.hash(text, 10);
}

async function verifyPassword(input: string, storedHash: string): Promise<boolean> {
  if (!storedHash) {
    return false;
  }

  if (storedHash.startsWith('$2')) {
    return bcrypt.compare(input, storedHash);
  }

  if (storedHash === input) {
    return true;
  }

  return storedHash === md5Hash(input);
}

async function initializeDatabase() {
  try {
    const adminConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await adminConnection.end();

    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin','user','hairstylist') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS haircuts (
        haircut_id INT AUTO_INCREMENT PRIMARY KEY,
        haircut_name VARCHAR(150) NOT NULL,
        category VARCHAR(80),
        gender VARCHAR(30),
        description TEXT,
        price DECIMAL(10,2),
        duration_minutes INT,
        status VARCHAR(50)
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS salons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200),
        rating VARCHAR(10),
        reviews INT,
        category VARCHAR(120),
        years_in_business VARCHAR(60),
        location VARCHAR(255),
        status VARCHAR(80),
        phone VARCHAR(40),
        website BOOLEAN DEFAULT 0,
        onsite_services BOOLEAN DEFAULT 0,
        description TEXT
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS scans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        haircut_id INT NULL,
        face_shape VARCHAR(50),
        hair_type VARCHAR(50),
        match_percentage INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS saved_styles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        haircut_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        salon_id INT NOT NULL,
        haircut_id INT NULL,
        appointment_at DATETIME,
        status VARCHAR(40) DEFAULT 'pending',
        price DECIMAL(10,2) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    const [rows]: any = await connection.query('SELECT COUNT(*) AS count FROM users');
    if (rows[0].count === 0) {
      const adminPasswordHash = await hashPassword('Admin123!');
      await connection.query(
        'INSERT INTO users (full_name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin User', 'admin', 'admin@facefit.test', adminPasswordHash, 'admin']
      );
    }

    connection.release();
    console.log('Database initialized successfully.');
  } catch (error: any) {
    console.error('Database initialization failed:', error.message);
  }
}

initializeDatabase();

app.get('/api/test', (req: Request, res: Response) => {
  const oras = new Date().toISOString();
  res.json({ status: 'FaceFit API is live!', oras });
});

app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const loginValue = username || email;

    if (!loginValue || !password) {
      return res.status(400).json({ success: false, message: 'Username/email and password are required.' });
    }

    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [loginValue, loginValue]);
    connection.release();

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Wrong email or password.' });
    }

    const user = rows[0];
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: 'Wrong email or password.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { full_name, email, username, password, role } = req.body;

    if (!full_name || !email || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const normalizedRole = typeof role === 'string' ? role.toLowerCase() : 'user';
    const validRoles = ['admin', 'user', 'hairstylist'];
    const selectedRole = validRoles.includes(normalizedRole) ? normalizedRole : 'user';

    const hashedPassword = await hashPassword(password);
    const connection = await pool.getConnection();

    const [existing]: any = await connection.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (Array.isArray(existing) && existing.length > 0) {
      connection.release();
      return res.status(409).json({ success: false, message: 'An account with that username or email already exists.' });
    }

    await connection.query(
      'INSERT INTO users (full_name, username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [full_name, username, email, hashedPassword, selectedRole]
    );
    connection.release();

    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT id, full_name, username, email, role, created_at FROM users');
    connection.release();

    res.json({ success: true, users: rows, total: rows.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT id, full_name, username, email, role, created_at FROM users WHERE id = ?', [id]);
    connection.release();

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users/:id/scans', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(
      `SELECT s.id, s.haircut_id, h.haircut_name, s.face_shape, s.hair_type, s.match_percentage, s.created_at
       FROM scans s
       LEFT JOIN haircuts h ON s.haircut_id = h.haircut_id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC
       LIMIT 50`,
      [id]
    );
    connection.release();

    res.json({ success: true, scans: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users/:id/saved', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(
      `SELECT ss.id, ss.haircut_id, h.haircut_name, ss.created_at
       FROM saved_styles ss
       LEFT JOIN haircuts h ON ss.haircut_id = h.haircut_id
       WHERE ss.user_id = ?
       ORDER BY ss.created_at DESC
       LIMIT 50`,
      [id]
    );
    connection.release();

    res.json({ success: true, saved: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users/:id/bookings', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(
      `SELECT b.id, b.appointment_at, b.status, b.price, h.haircut_name, s.name AS salon_name, s.location
       FROM bookings b
       LEFT JOIN haircuts h ON b.haircut_id = h.haircut_id
       LEFT JOIN salons s ON b.salon_id = s.id
       WHERE b.user_id = ?
       ORDER BY b.appointment_at DESC
       LIMIT 50`,
      [id]
    );
    connection.release();

    res.json({ success: true, bookings: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/recommendations', async (req: Request, res: Response) => {
  try {
    const faceShape = (req.query.faceShape as string) || 'Oval';
    const hairType = (req.query.hairType as string) || 'Straight';
    const gender = (req.query.gender as string) || 'Unisex';

    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT haircut_id, haircut_name, category, gender, description, price, duration_minutes, status FROM haircuts');
    connection.release();

    const recommendations = (rows as any[])
      .filter((cut) => cut.status === 'Available')
      .map((cut) => {
        let matchPercentage = 72;
        const name = cut.haircut_name.toLowerCase();

        if (faceShape === 'Oval') matchPercentage += 12;
        if (faceShape === 'Round') matchPercentage += 8;
        if (faceShape === 'Square') matchPercentage += 10;
        if (faceShape === 'Heart') matchPercentage += 9;

        if (hairType === 'Straight') matchPercentage += 8;
        if (hairType === 'Wavy') matchPercentage += 5;
        if (hairType === 'Curly') matchPercentage += 3;

        if (gender === 'Unisex' || cut.gender === gender || cut.gender === 'Unisex') matchPercentage += 6;

        if (name.includes('fade') || name.includes('crop') || name.includes('bob') || name.includes('layer')) matchPercentage += 3;

        return {
          id: cut.haircut_id,
          name: cut.haircut_name,
          category: cut.category,
          gender: cut.gender,
          description: cut.description,
          price: Number(cut.price),
          durationMinutes: cut.duration_minutes,
          matchPercentage: Math.min(98, Math.max(75, matchPercentage)),
          reason: `Recommended for ${faceShape.toLowerCase()} faces with ${hairType.toLowerCase()} hair.`,
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 6);

    res.json({
      success: true,
      faceShape,
      hairType,
      gender,
      recommendations,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/salons', async (req: Request, res: Response) => {
  try {
    const haircutName = (req.query.haircut as string) || '';
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query('SELECT * FROM salons');
    connection.release();

    console.log('salons query rows', Array.isArray(rows) ? rows.length : 'not-array', rows?.slice?.(0, 3));

    const keywords = haircutName.toLowerCase();
    const matchedSalons = (rows as any[])
      .filter((salon) => {
        const text = `${salon.name || ''} ${salon.description || ''} ${salon.category || ''}`.toLowerCase();
        if (!keywords) return true;
        return text.includes(keywords);
      })
      .slice(0, 8);

    const salons = matchedSalons.length > 0 ? matchedSalons : (rows as any[]).slice(0, 8);

    res.json({ success: true, salons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new scan record
app.post('/api/scans', async (req: Request, res: Response) => {
  try {
    const { user_id, haircut_id, face_shape, hair_type, match_percentage } = req.body;
    if (!user_id) return res.status(400).json({ success: false, message: 'user_id is required' });

    const connection = await pool.getConnection();
    const [result]: any = await connection.query(
      'INSERT INTO scans (user_id, haircut_id, face_shape, hair_type, match_percentage, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [user_id, haircut_id || null, face_shape || null, hair_type || null, match_percentage || null]
    );
    const insertedId = result.insertId;
    const [rows]: any = await connection.query('SELECT s.id, s.haircut_id, h.haircut_name, s.face_shape, s.hair_type, s.match_percentage, s.created_at FROM scans s LEFT JOIN haircuts h ON s.haircut_id = h.haircut_id WHERE s.id = ?', [insertedId]);
    connection.release();

    res.status(201).json({ success: true, scan: rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Save a style for a user
app.post('/api/saved', async (req: Request, res: Response) => {
  try {
    const { user_id, haircut_id } = req.body;
    if (!user_id || !haircut_id) return res.status(400).json({ success: false, message: 'user_id and haircut_id are required' });

    const connection = await pool.getConnection();
    // prevent duplicate saved styles
    const [exists]: any = await connection.query('SELECT id FROM saved_styles WHERE user_id = ? AND haircut_id = ?', [user_id, haircut_id]);
    if (Array.isArray(exists) && exists.length > 0) {
      connection.release();
      return res.status(200).json({ success: true, message: 'Already saved', savedId: exists[0].id });
    }

    const [result]: any = await connection.query('INSERT INTO saved_styles (user_id, haircut_id, created_at) VALUES (?, ?, NOW())', [user_id, haircut_id]);
    const insertedId = result.insertId;
    const [rows]: any = await connection.query('SELECT ss.id, ss.haircut_id, h.haircut_name, ss.created_at FROM saved_styles ss LEFT JOIN haircuts h ON ss.haircut_id = h.haircut_id WHERE ss.id = ?', [insertedId]);
    connection.release();

    res.status(201).json({ success: true, saved: rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a booking
app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const { user_id, salon_id, haircut_id, appointment_at, price } = req.body;
    if (!user_id || !salon_id) return res.status(400).json({ success: false, message: 'user_id and salon_id are required' });

    const connection = await pool.getConnection();
    const [result]: any = await connection.query(
      'INSERT INTO bookings (user_id, salon_id, haircut_id, appointment_at, price, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [user_id, salon_id, haircut_id || null, appointment_at || null, price || null]
    );
    const insertedId = result.insertId;
    const [rows]: any = await connection.query(
      `SELECT b.id, b.appointment_at, b.status, b.price, h.haircut_name, s.name AS salon_name, s.location
       FROM bookings b
       LEFT JOIN haircuts h ON b.haircut_id = h.haircut_id
       LEFT JOIN salons s ON b.salon_id = s.id
       WHERE b.id = ?`,
      [insertedId]
    );
    connection.release();

    res.status(201).json({ success: true, booking: rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`API server running at http://${myIP}:${PORT}`);
  console.log(`Health check: http://${myIP}:${PORT}/api/test`);
});
