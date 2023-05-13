import { Prisma, PrismaClient } from '@prisma/client';
import { NOTIFICATION_TYPE } from '../models/notification';

const prisma = new PrismaClient();

async function getNotificationPreference(guildId: string, type: NOTIFICATION_TYPE) {
  return prisma.notificationPreferences.findUnique({
    where: { guildId_type: { guildId, type } }
  });
}

async function updateNotificationPreferences(guildId: string, type: string, channelId: string | null) {
  return prisma.notificationPreferences.upsert({
    where: { guildId_type: { guildId, type } },
    create: { guildId, type, channelId },
    update: { channelId }
  });
}

async function issueToken(guildId: string, userId: string, token: string) {
  return prisma.issuedTokens.upsert({
    where: { guildId_userId: { guildId, userId } },
    create: { guildId, userId, token },
    update: { token }
  });
}

async function getToken(guildId: string, userId: string) {
  return prisma.issuedTokens.findUnique({
    where: { guildId_userId: { guildId, userId } }
  });
}

async function getTokenByValue(token: string) {
  return prisma.issuedTokens.findFirst({
    where: { token: token }
  });
}

export default prisma;

export {
  getNotificationPreference,
  updateNotificationPreferences,
  issueToken,
  getToken,
  getTokenByValue
};
