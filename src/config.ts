export default {
  privateKey: process.env.PRIVATE_KEY || 'supersecretkey',
  algorithm: process.env.ALGORITHM || 'HS256',
  visuals: {
    purple: 0x7914a8,
    blue: 0x2980b9,
    red: 0xcc4242,
    green: 0x64d85b,
    orange: 0xecbf54
  },
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    guildId: process.env.DISCORD_DEV_GUILD_ID || '',
    clientId: process.env.DISCORD_DEV_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || ''
  }
};
