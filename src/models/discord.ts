import {
  Channel,
  ChannelType,
  DMChannel,
  Guild,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
  TextChannel
} from 'discord.js';
import config from '../config';

export function findOpenChannel(guild: Guild) {
  const channel = guild.channels.cache.find(c => {
    return c.type === ChannelType.GuildText;
  });

  return channel as TextChannel;
}

export function isAdmin(member: GuildMember | null): boolean {
  return member ? member?.permissions.has(PermissionFlagsBits.AddReactions) : false;
}

export function getMissingPermissions(channel: TextChannel) {
  return [...config.requiredPermissions, PermissionFlagsBits.SendMessages].filter(permission => {
    return !clientUserPermissions(channel)?.has(permission as PermissionResolvable);
  });
}

export function isChannelSendable(channel: Channel | undefined | null): channel is TextChannel {
  if (!channel) return false;
  if (channel.type != ChannelType.GuildText) return false;
  if (!('guild' in channel)) return true;

  const canView = clientUserPermissions(channel as TextChannel)?.has(PermissionFlagsBits.ViewChannel);

  if (!(channel instanceof DMChannel) && !(channel instanceof TextChannel) && canView) {
    return false;
  }

  return true;
}

const clientUserPermissions = (channel: TextChannel) =>
  channel.client.user ? channel.permissionsFor(channel.client.user) : null;
