const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
let users = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2024-01-01'
  }
];

// Mock JWT secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Public routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/announcements', (req, res) => {
  res.json([
    { id: 1, title: 'Welcome to our platform!', content: 'We\'re excited to have you here.' },
    { id: 2, title: 'New features coming soon', content: 'Stay tuned for amazing updates.' }
  ]);
});

// Protected routes
app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.email === req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.put('/api/users/me', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(u => u.email === req.user.email);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { firstName, lastName } = req.body;
  users[userIndex] = { ...users[userIndex], firstName, lastName };
  
  res.json(users[userIndex]);
});

// Admin-only routes
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.put('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { firstName, lastName, role } = req.body;
  users[userIndex] = { ...users[userIndex], firstName, lastName, role };
  
  res.json(users[userIndex]);
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

// Admin statistics
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const regularUsers = users.filter(u => u.role === 'user').length;

  res.json({
    totalUsers,
    adminUsers,
    regularUsers,
    createdAt: new Date().toISOString()
  });
});

app.get('/api/admin/analytics/users', authenticateToken, requireAdmin, (req, res) => {
  const userGrowth = users.map(user => ({
    date: user.createdAt,
    count: 1
  }));

  res.json({
    userGrowth,
    totalUsers: users.length
  });
});

// Bulk operations
app.put('/api/admin/users/bulk', authenticateToken, requireAdmin, (req, res) => {
  const { userIds, updates } = req.body;
  
  if (!userIds || !Array.isArray(userIds) || !updates) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const updatedUsers = [];
  userIds.forEach(id => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      updatedUsers.push(users[userIndex]);
    }
  });

  res.json({ message: `${updatedUsers.length} users updated`, users: updatedUsers });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
