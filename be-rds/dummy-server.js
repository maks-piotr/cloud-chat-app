const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // For decoding tokens
const jwkToPem = require('jwk-to-pem'); // Converts JWKs to PEM for verification
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // To fetch Cognito JWKs

const app = express();

app.use(cors());
app.use(express.json());

// Replace with your Cognito User Pool details
const COGNITO_REGION = 'us-east-1'; // Replace with your region
const COGNITO_USER_POOL_ID = 'us-east-1_uqVYJ45ln'; // Replace with your user pool ID
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

let cognitoKeys = {};

// Load Cognito JWKS keys on server start
(async function loadCognitoKeys() {
  const response = await fetch(JWKS_URL);
  const { keys } = await response.json();
  cognitoKeys = keys.reduce((agg, key) => {
    agg[key.kid] = jwkToPem(key);
    return agg;
  }, {});
})();

// Middleware to validate access token and match user claims
async function authenticateCognitoToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Get the Bearer token
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Decode token to find the `kid` (key ID)
  const decodedHeader = jwt.decode(token, { complete: true });
  const kid = decodedHeader?.header?.kid;
  if (!kid || !cognitoKeys[kid]) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const pem = cognitoKeys[kid];

  // Verify the token against the PEM
  jwt.verify(token, pem, { algorithms: ['RS256'] }, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token', details: err.message });
    }

    // Attach user claims to the request object
    req.user = decodedToken;
    next();
  });
}

// Validate loggedInUser matches token's username claim
function verifyUserMatch(req, res, next) {
  const { loggedInUser, from } = req.body;

  if (req.user['cognito:username'] !== loggedInUser && req.user['cognito:username'] !== from) {
    return res.status(403).json({ error: 'User mismatch' });
  }

  next();
}

// Dummy data
let users = [
  { id: 1, username: 'Alice' },
  { id: 2, username: 'Bob' },
];

let chatLogs = [
  { from: 'Alice', to: 'Bob', message: 'Hi Bob!' },
  { from: 'Bob', to: 'Alice', message: 'Hey Alice!' },
  { from: 'Alice', to: 'Charlie', message: 'Hi Charlie!' },
  { from: 'test2', to: 'Alice', message: 'Hi Alice, I\'m test2!' },
  { from: 'Alice', to: 'test2', message: 'Hi test2, I\'m Alice :)!' }
];

// Get users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get chat log between two users
app.post('/chatlog', authenticateCognitoToken, verifyUserMatch, (req, res) => {
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
app.post('/chat', authenticateCognitoToken, verifyUserMatch, (req, res) => {
  const { from, to, message } = req.body;
  if (!from || !to || !message) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  chatLogs.push({ from, to, message });
  res.status(201).json({ success: true });
});

app.listen(8080, () => console.log('Dummy server running on http://localhost:8080'));
