const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, username: 'Alice' },
  { id: 2, username: 'Bob' },
];

let chatLogs = [
  { from: 'Alice', to: 'Bob', message: 'Hi Bob!' },
  { from: 'Bob', to: 'Alice', message: 'Hey Alice!' },
];

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/chatlog', (req, res) => {
  res.json(chatLogs);
});

app.post('/chat', (req, res) => {
  const { from, to, message } = req.body;
  if (!from || !to || !message) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  chatLogs.push({ from, to, message });
  res.status(201).json({ success: true });
});

app.listen(8080, () => console.log('Dummy server running on http://localhost:8080'));
