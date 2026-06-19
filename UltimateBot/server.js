require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// Discord OAuth2 config
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SCOPES = ['identify', 'guilds'];

// Serve static files
app.use(express.static(path.join(__dirname)));

// Login route - redirect to Discord OAuth2
app.get('/login/auth', (req, res) => {
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPES.join('%20')}`;
  res.redirect(authUrl);
});

// Callback route
app.get('/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.send('No code provided');

    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Redirect to dashboard after successful login
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.send('Error logging in');
  }
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Server dashboard route
app.get('/dashboard/server/:id', (req, res) => {
  console.log(`Serving server dashboard for ID: ${req.params.id}`);
  res.sendFile(path.join(__dirname, 'dashboard', 'server', `${req.params.id}.html`));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
