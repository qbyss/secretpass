const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for secrets
// In production, consider using Redis with TTL
const secrets = new Map();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Create a new secret
app.post('/api/secret', (req, res) => {
  const { secret, expiresIn } = req.body;

  if (!secret || secret.trim().length === 0) {
    return res.status(400).json({ error: 'Secret cannot be empty' });
  }

  // Generate unique ID
  const id = uuidv4();

  // Store secret with metadata
  secrets.set(id, {
    content: secret,
    createdAt: Date.now(),
    expiresIn: expiresIn || 24 * 60 * 60 * 1000, // Default 24 hours
  });

  // Set auto-cleanup timer
  const ttl = expiresIn || 24 * 60 * 60 * 1000;
  setTimeout(() => {
    if (secrets.has(id)) {
      secrets.delete(id);
      console.log(`Secret ${id} expired and removed`);
    }
  }, ttl);

  // Return the secret ID
  res.json({
    id,
    url: `${req.protocol}://${req.get('host')}/view.html?id=${id}`,
  });

  console.log(`Secret created: ${id}`);
});

// Retrieve and delete a secret (one-time access)
app.get('/api/secret/:id', (req, res) => {
  const { id } = req.params;

  if (!secrets.has(id)) {
    return res.status(404).json({
      error: 'Secret not found',
      message: 'This secret does not exist or has already been viewed.',
    });
  }

  // Get the secret
  const secretData = secrets.get(id);

  // Delete it immediately (one-time access)
  secrets.delete(id);

  console.log(`Secret ${id} retrieved and destroyed`);

  // Return the secret
  res.json({
    secret: secretData.content,
    createdAt: secretData.createdAt,
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeSecrets: secrets.size,
    uptime: process.uptime(),
  });
});

// Serve index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`SecretPass server running on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
