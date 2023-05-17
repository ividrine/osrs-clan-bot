import { ChannelType, Client } from 'discord.js';
import { Request as JWTRequest } from 'express-jwt';
import express from 'express';
import { findOpenChannel } from '../models/discord';
import { DiscordNotification } from '../models/notification';
import Clue from './clue';
import Coffer from './coffer';
import Collection from './collection';
import CombatAchievement from './combat_achievement';
import AchievementDiary from './achievement_diary';
import Loot from './loot';
import Level from './level';
import Death from './death';
import PlayerKill from './player_kill';
import Quest from './quest';
import Slayer from './slayer';
import Pet from './pet';
import GroupStorage from './group_storage';
import Bag from './bag';
import KillCount from './kill_count';
import SpeedRun from './speed_run';

import { getNotificationPreference } from '../services/prisma';

const notifications: DiscordNotification[] = [
  Clue,
  Coffer,
  Collection,
  CombatAchievement,
  AchievementDiary,
  Loot,
  Death,
  Level,
  PlayerKill,
  Quest,
  Slayer,
  Pet,
  GroupStorage,
  Bag,
  KillCount,
  SpeedRun
];

export async function onNotification(
  client: Client,
  req: JWTRequest & Express.Multer.File,
  res: express.Response
) {
  const server = client.guilds.cache.get(req.auth?.guildId);
  const user = await server?.members.fetch(req.auth?.id);

  if (!server || !user || !req.body.type || !req.body.content) {
    return res.sendStatus(400);
  }

  const notification: DiscordNotification | undefined = notifications.find(x => {
    return x.type == req.body.type;
  });

  if (!notification) return res.sendStatus(500);

  const pref = await getNotificationPreference(req.auth?.guildId, notification.type);

  if (!pref?.channelId) return res.sendStatus(400);

  const channel = await server.channels.fetch(pref.channelId);

  if (!channel || channel.type != ChannelType.GuildText) return res.sendStatus(500);

  const message = notification.buildMessage(user, req.body, req.file);

  channel.send(message);

  res.sendStatus(200);
}
