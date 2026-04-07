import express from 'express';
import cors from 'cors';
import { 
  mockUsers, 
  activityCategories, 
  activities, 
  notifications, 
  badges, 
  certificates, 
  feedbacks, 
  participationStats, 
  adminStats 
} from './data/mockData.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Users endpoints
app.get('/api/users', (req, res) => {
  res.json(mockUsers);
});

app.post('/api/users', (req, res) => {
  const { name, email, role, department, year } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  const id = `user-${Date.now()}`;
  const newUser = {
    id,
    name,
    email,
    role: role || 'student',
    department: department || '',
    year: year || '',
    avatar: null,
    badges: [],
    registeredActivities: [],
    completedActivities: []
  };
  
  const userKey = email.split('@')[0] || id;
  mockUsers[userKey] = newUser;
  
  res.status(201).json(newUser);
});

app.put('/api/users/:email', (req, res) => {
  const { email } = req.params;
  const userKey = email.split('@')[0];
  
  if (mockUsers[userKey]) {
    mockUsers[userKey] = { ...mockUsers[userKey], ...req.body };
    res.json(mockUsers[userKey]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  res.json(activityCategories);
});

// Activities endpoints
app.get('/api/activities', (req, res) => {
  res.json(activities);
});

app.post('/api/activities', (req, res) => {
  const newActivity = { ...req.body, id: `act-${Date.now()}` };
  activities.push(newActivity);
  res.status(201).json(newActivity);
});

app.put('/api/activities/:id', (req, res) => {
  const index = activities.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    activities[index] = { ...activities[index], ...req.body };
    res.json(activities[index]);
  } else {
    res.status(404).json({ message: 'Activity not found' });
  }
});

app.delete('/api/activities/:id', (req, res) => {
  const index = activities.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    const deleted = activities.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: 'Activity not found' });
  }
});

app.get('/api/activities/:id', (req, res) => {
  const activity = activities.find(a => a.id === req.params.id);
  if (activity) {
    res.json(activity);
  } else {
    res.status(404).json({ message: 'Activity not found' });
  }
});

// Notifications endpoint
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// Badges endpoint
app.get('/api/badges', (req, res) => {
  res.json(badges);
});

// Certificates endpoint
app.get('/api/certificates', (req, res) => {
  res.json(certificates);
});

// Feedbacks endpoint
app.get('/api/feedbacks', (req, res) => {
  res.json(feedbacks);
});

// Stats endpoints
app.get('/api/stats/student', (req, res) => {
  res.json(participationStats);
});

app.get('/api/stats/admin', (req, res) => {
  res.json(adminStats);
});

// Basic auth endpoint simulation
app.post('/api/auth/login', (req, res) => {
  const { email, role, secret } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Enforce Admin Authentication
  if (role === 'admin' && secret !== 'admin123' && secret !== '123456') {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
  
  let baseUser = role === 'admin' 
    ? mockUsers.admin 
    : role === 'faculty' 
      ? mockUsers.faculty 
      : mockUsers.student;
      
  res.json({
    ...baseUser,
    email,
    role: role || baseUser.role
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, role, department, year } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  const id = `user-${Date.now()}`;
  const newUser = {
    id,
    name,
    email,
    role: role || 'student',
    department: department || '',
    year: year || '',
    avatar: null,
    badges: [],
    registeredActivities: [],
    completedActivities: []
  };
  
  const userKey = email.split('@')[0] || id;
  mockUsers[userKey] = newUser;
  
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
