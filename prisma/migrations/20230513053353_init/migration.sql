-- CreateTable
CREATE TABLE "NotificationPreferences" (
    "guildId" VARCHAR(256) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "channelId" VARCHAR(256),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "NotificationPreferences_pkey" PRIMARY KEY ("guildId","type")
);

-- CreateTable
CREATE TABLE "IssuedTokens" (
    "guildId" VARCHAR(256) NOT NULL,
    "userId" VARCHAR(256) NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "IssuedTokens_pkey" PRIMARY KEY ("guildId","userId")
);
