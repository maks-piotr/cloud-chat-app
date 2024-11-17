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
  { from: 'Alice', to: 'Charlie', message: 'Hi Charlie!' },
  { from: 'test2', to: 'Alice', message: 'Hi Alice, im test2!' },
  { from: 'Alice', to: 'test2', message: 'Hi test2, im Alice :)!' }
];

// Get users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get chat log between two users
app.post('/chatlog', (req, res) => {
  const { loggedInUser, selectedUser } = req.body;
  if (!loggedInUser || !selectedUser) {
    return res.status(400).json({ error: 'Missing loggedInUser or selectedUser' });
  }

  // Filter messages where loggedInUser is involved
  const filteredChatLogs = chatLogs.filter(
    (chat) =>
      (chat.from === loggedInUser && chat.to === selectedUser) ||
      (chat.from === selectedUser && chat.to === loggedInUser)
  );

  res.json(filteredChatLogs);
});

// Send a new chat message
app.post('/chat', (req, res) => {
  const { from, to, message } = req.body;
  if (!from || !to || !message) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  chatLogs.push({ from, to, message });
  res.status(201).json({ success: true });
});

app.listen(8080, () => console.log('Dummy server running on http://localhost:8080'));
