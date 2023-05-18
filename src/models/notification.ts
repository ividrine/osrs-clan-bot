import {
  AttachmentBuilder,
  ChannelType,
  Client,
  EmbedBuilder,
  GuildMember,
  MessageCreateOptions
} from 'discord.js';
import { Request as JWTRequest } from 'express-jwt';
import express from 'express';
import config from '../config';
import { getNotificationPreference } from '../services/prisma';

const wikiBaseUrl = 'https://oldschool.runescape.wiki/images';

const AccountTypeUrls = {
  GROUP_IRONMAN: `${wikiBaseUrl}/Group_ironman_chat_badge.png`,
  HARDCORE_GROUP_IRONMAN: `${wikiBaseUrl}/Hardcore_group_ironman_chat_badge.png`,
  HARDCORE_IRONMAN: `${wikiBaseUrl}/Hardcore_ironman_chat_badge.png`,
  IRONMAN: `${wikiBaseUrl}/Ironman_chat_badge.png`,
  NORMAL: `${wikiBaseUrl}/Combat_icon.png`,
  ULTIMATE_IRONMAN: `${wikiBaseUrl}/Ultimate_ironman_chat_badge.png`
};

export enum NOTIFICATION_TYPE {
  ACHIEVEMENT_DIARY = 'ACHIEVEMENT_DIARY',
  BARBARIAN_ASSAULT_GAMBLE = 'BARBARIAN_ASSAULT_GAMBLE',
  CLUE = 'CLUE',
  COFFER = 'COFFER',
  COLLECTION = 'COLLECTION',
  COMBAT_ACHIEVEMENT = 'COMBAT_ACHIEVEMENT',
  DEATH = 'DEATH',
  GROUP_STORAGE = 'GROUP_STORAGE',
  KILL_COUNT = 'KILL_COUNT',
  LEVEL = 'LEVEL',
  LOOT = 'LOOT',
  PET = 'PET',
  PLAYER_KILL = 'PLAYER_KILL',
  SPEEDRUN = 'SPEEDRUN',
  SLAYER = 'SLAYER',
  QUEST = 'QUEST'
}

export const NotificationNames = {
  [NOTIFICATION_TYPE.ACHIEVEMENT_DIARY]: 'Achievement Diary',
  [NOTIFICATION_TYPE.BARBARIAN_ASSAULT_GAMBLE]: 'Barbarian Asssault Gamble',
  [NOTIFICATION_TYPE.CLUE]: 'Clue Scroll Item',
  [NOTIFICATION_TYPE.COFFER]: 'Clan Coffer',
  [NOTIFICATION_TYPE.COLLECTION]: 'Collection Log',
  [NOTIFICATION_TYPE.COMBAT_ACHIEVEMENT]: 'Combat Achievemnt',
  [NOTIFICATION_TYPE.DEATH]: 'Death',
  [NOTIFICATION_TYPE.GROUP_STORAGE]: 'Group Storage',
  [NOTIFICATION_TYPE.KILL_COUNT]: 'Kill Count',
  [NOTIFICATION_TYPE.LEVEL]: 'Level Up',
  [NOTIFICATION_TYPE.LOOT]: 'Loot Drop',
  [NOTIFICATION_TYPE.PET]: 'Pet Drop',
  [NOTIFICATION_TYPE.PLAYER_KILL]: 'Player Kill',
  [NOTIFICATION_TYPE.SPEEDRUN]: 'Speed Run',
  [NOTIFICATION_TYPE.SLAYER]: 'Slayer Task',
  [NOTIFICATION_TYPE.QUEST]: 'Quest Complete'
};

export async function onNotification(
  client: Client,
  req: JWTRequest & (Express.Multer.File | undefined),
  res: express.Response
) {
  const server = client.guilds.cache.get(req.auth?.guildId);
  const user = await server?.members.fetch(req.auth?.id);

  if (!server || !user || !req.body.payload_json) {
    return res.sendStatus(400);
  }

  const data = JSON.parse(req.body.payload_json);

  if (!data.type) return res.sendStatus(400);

  const pref = await getNotificationPreference(req.auth?.guildId, data.type);

  if (!pref?.channelId) return res.sendStatus(400);

  const channel = await server.channels.fetch(pref.channelId);

  if (!channel || channel.type != ChannelType.GuildText) return res.sendStatus(500);

  const message = buildMessage(user, data, req.file);

  channel.send(message);

  res.sendStatus(200);
}

export function buildMessage(user: GuildMember, data: any, screenshot: Express.Multer.File | undefined) {
  const message: MessageCreateOptions = {
    embeds: [],
    files: []
  };

  if (data.embeds?.length > 0) {
    data.embeds[0].description = data.embeds[0].description.replace(data.playerName, `<@${user.id}>`);

    if (!data.embeds[0].author.iconUrl) data.embeds[0].author.iconUrl = AccountTypeUrls.NORMAL;

    message.embeds = data.embeds;

    if (screenshot) {
      const attachment = new AttachmentBuilder(screenshot.buffer, { name: screenshot.originalname });
      message.files?.push(attachment);
    }
  } else {
    const embed = new EmbedBuilder()
      .setTitle(`${NotificationNames[data.type]}`)
      .setAuthor({
        name: data.playerName,
        iconURL: AccountTypeUrls[data.accountType],
        url: `https://secure.runescape.com/m=hiscore_oldschool/hiscorepersonal?user1=${data.playerName}`
      })
      .setColor(config.visuals.purple)
      .setDescription(data.content.replace(data.playerName, `<@${user.id}>`))
      .setTimestamp()
      .setFooter({ text: 'Glory Seekers (t)' });

    if (screenshot) {
      const attachment = new AttachmentBuilder(screenshot.buffer, { name: screenshot.originalname });
      message.files?.push(attachment);
      embed.setImage(`attachment://${screenshot.originalname}`);
    }

    message.embeds?.push(embed);
  }

  return message;
}
