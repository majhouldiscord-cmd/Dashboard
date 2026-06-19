const axios = require('axios');

exports.handler = async (event, context) => {
  const { code } = event.queryStringParameters;
  
  if (!code) {
    return {
      statusCode: 400,
      body: "No code provided"
    };
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    // Get user info from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    // Get user guilds
    const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    // Store auth data in a secure cookie (for demo purposes, in production use a proper DB!)
    const authCookie = `user=${encodeURIComponent(JSON.stringify({
      user: userResponse.data,
      guilds: guildsResponse.data,
      accessToken: access_token
    }))}; Path=/; Max-Age=${expires_in}; HttpOnly; SameSite=Lax`;

    return {
      statusCode: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': authCookie
      }
    };
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to complete login' })
    };
  }
};