const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 8000;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

app.use(express.json());
app.use(express.static(__dirname));

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
      await fs.writeFile(USERS_FILE, '[]');
      return [];
    }
    throw error;
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const users = await readUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const newUser = { id: Date.now(), name, email: email.toLowerCase(), password };
  users.push(newUser);
  await writeUsers(users);

  res.json({ message: 'Account created successfully.', user: { name: newUser.name, email: newUser.email } });
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = await readUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  res.json({ message: 'Signed in successfully.', user: { name: user.name, email: user.email } });
});

app.get('/api/locations', (req, res) => {
  res.json({
    city: 'Chennai',
    branch: 'KARTHI Jewellery Shop Chennai',
    address: '15, Anna Salai, Nungambakkam, Chennai - 600034',
    phone: '+91 86060 83922',
    hours: 'Mon - Sat: 10:00 AM to 8:00 PM',
    description: 'Visit our flagship Chennai showroom for premium gold, diamond, platinum and gemstone jewellery collections. Secure payments and in-store consultation available.'
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required.' });
  }
  res.json({ message: 'Thank you, we received your request. Our Chennai store team will contact you shortly.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
