const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { Pool } = require('pg'); // PostgreSQL client library

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

// PostgreSQL Database connection pool
const pool = new Pool({
  host: 'terraform-20241117210759533700000001.cqfmxw48grex.us-east-1.rds.amazonaws.com', // Replace with your RDS endpoint
  user: 'master', // Replace with your database username
  password: 'securepassword', // Replace with your database password
  database: 'chat_app_db', // Replace with your database name
  port: 5432, // Default PostgreSQL port
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Connection idle timeout
  connectionTimeoutMillis: 2000, // Connection timeout
});

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

// Get users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat log between two users
app.post('/chatlog', authenticateCognitoToken, verifyUserMatch, async (req, res) => {
  const { loggedInUser, selectedUser } = req.body;
  if (!loggedInUser || !selectedUser) {
    return res.status(400).json({ error: 'Missing loggedInUser or selectedUser' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM chat_logs WHERE (from_user = $1 AND to_user = $2) OR (from_user = $2 AND to_user = $1)',
      [loggedInUser, selectedUser]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chat logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a new chat message
app.post('/chat', authenticateCognitoToken, verifyUserMatch, async (req, res) => {
  const { from, to, message } = req.body;
  if (!from || !to || !message) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    await pool.query('INSERT INTO chat_logs (from_user, to_user, message) VALUES ($1, $2, $3)', [from, to, message]);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(8080, () => console.log('Server running on http://localhost:8080'));
