import { GuildMember, MessageCreateOptions } from 'discord.js';

export enum NOTIFICATION_TYPE {
  BOSSDROP = 'BOSSDROP',
  RAIDLOOT = 'RAIDLOOT',
  CLUEITEM = 'CLUEITEM',
  COFFERDEPOSIT = 'COFFERDEPOSIT',
  COFFERWITHDRAW = 'COFFERWITHDRAW',
  COLLECTIONLOG = 'COLLECTIONLOG',
  COMBATACHIEVEMENT = 'COMBATACHIEVEMENT',
  DIARYCOMPLETION = 'DIARYCOMPLETION',
  HARDCOREDEATH = 'HARDCOREDEATH',
  LEVELUP = 'LEVELUP',
  PERSONALBEST = 'PERSONALBEST',
  PKLOSE = 'PKLOSE',
  PKWIN = 'PKWIN',
  QUESTCOMPLETION = 'QUESTCOMPLETION'
}

export const NotificationNames = {
  [NOTIFICATION_TYPE.BOSSDROP]: 'Drop',
  [NOTIFICATION_TYPE.RAIDLOOT]: 'Raid Loot',
  [NOTIFICATION_TYPE.CLUEITEM]: 'Clue Scroll Item',
  [NOTIFICATION_TYPE.COFFERDEPOSIT]: 'Coffer Deposit',
  [NOTIFICATION_TYPE.COFFERWITHDRAW]: 'Coffer Withdraw',
  [NOTIFICATION_TYPE.COLLECTIONLOG]: 'Collection Log',
  [NOTIFICATION_TYPE.COMBATACHIEVEMENT]: 'Comabt Achievemnt',
  [NOTIFICATION_TYPE.DIARYCOMPLETION]: 'Diary',
  [NOTIFICATION_TYPE.HARDCOREDEATH]: 'Hardcore Death',
  [NOTIFICATION_TYPE.LEVELUP]: 'Level Up',
  [NOTIFICATION_TYPE.PKLOSE]: 'PVP Death',
  [NOTIFICATION_TYPE.PKWIN]: 'PVP Win',
  [NOTIFICATION_TYPE.PERSONALBEST]: 'Personal Best',
  [NOTIFICATION_TYPE.QUESTCOMPLETION]: 'Quest Complete'
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
  message: string;
  rsn: string;
}
