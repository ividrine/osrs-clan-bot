import { ChannelType, Client } from 'discord.js';
import { Request as JWTRequest } from 'express-jwt';
import express from 'express';
import { findOpenChannel } from '../models/discord';
import { DiscordNotification } from '../models/notification';
import Clue from './clue';
import CofferDeposit from './coffer_deposit';
import CofferWithdraw from './coffer_withdraw';
import CollectionLog from './collection_log';
import CombatAchievement from './combat_achievement';
import Diary from './diary';
import Drop from './drop';
import HardcoreDeath from './hardcore_death';
import LevelUp from './levelup';
import PersonalBest from './personal_best';
import PVPDeath from './pvp_loss';
import PVPWin from './pvp_win';
import Quest from './quest_complete';
import Raid from './raid';
import { getNotificationPreference } from '../services/prisma';

const notifications: DiscordNotification[] = [
  Clue,
  CofferDeposit,
  CofferWithdraw,
  CollectionLog,
  CombatAchievement,
  Diary,
  Drop,
  HardcoreDeath,
  LevelUp,
  PersonalBest,
  PVPDeath,
  PVPWin,
  Quest,
  Raid
];

export async function onNotification(
  client: Client,
  req: JWTRequest & Express.Multer.File,
  res: express.Response
) {
  const server = client.guilds.cache.get(req.auth?.guildId);
  const user = await server?.members.fetch(req.auth?.id);

  if (!server || !user || !req.body.type || !req.body.message) {
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
