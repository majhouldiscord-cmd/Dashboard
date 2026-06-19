exports.handler = async (event, context) => {
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
  const SCOPES = "identify guilds";

  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPES.replace(/ /g, "%20")}`;

  return {
    statusCode: 302,
    headers: {
      Location: authUrl
    }
  };
};