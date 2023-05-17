import { GuildMember, MessageCreateOptions } from 'discord.js';

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
  [NOTIFICATION_TYPE.COMBAT_ACHIEVEMENT]: 'Comabt Achievemnt',
  [NOTIFICATION_TYPE.DEATH]: 'Death',
  [NOTIFICATION_TYPE.GROUP_STORAGE]: 'Group Storage',
  [NOTIFICATION_TYPE.KILL_COUNT]: 'Kill Count',
  [NOTIFICATION_TYPE.LEVEL]: 'Level Up',
  [NOTIFICATION_TYPE.LOOT]: 'Loot',
  [NOTIFICATION_TYPE.PET]: 'Pet Drop',
  [NOTIFICATION_TYPE.PLAYER_KILL]: 'Player Kill',
  [NOTIFICATION_TYPE.SPEEDRUN]: 'Speed Run',
  [NOTIFICATION_TYPE.SLAYER]: 'Slayer Task',
  [NOTIFICATION_TYPE.QUEST]: 'Quest Complete'
};

export interface DiscordNotification {
  type: NOTIFICATION_TYPE;
  title: string;
  color: number;

  buildMessage(
    user: GuildMember,
    data: NotificationRequest,
    screenshot: Express.Multer.File | undefined
  ): MessageCreateOptions;
}

export interface NotificationRequest {
  type: NOTIFICATION_TYPE;
  content: string;
}
