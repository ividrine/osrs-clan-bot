import { ChannelType, Guild, PermissionsBitField, TextChannel } from 'discord.js';

export function findOpenChannel(guild: Guild) {
  const channel = guild.channels.cache.find(c => {
    return c.type === ChannelType.GuildText;
  });

  return channel as TextChannel;
}
