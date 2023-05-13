import { Channel, Client, CommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command, CommandConfig, CommandError } from '../models/commands';
import jwt from 'jsonwebtoken';
import config from '../config';
import { NOTIFICATION_TYPE, NotificationNames } from '../models/notification';
import { InteractionType } from 'discord.js';
import { getMissingPermissions, isChannelSendable } from '../models/discord';
import { updateNotificationPreferences } from '../services/prisma';

const CONFIG: CommandConfig = {
  name: 'preference',
  description: 'Set notfication preferences.',
  options: [
    {
      type: 'string',
      required: true,
      name: 'notification_type',
      description: 'The type of notification.',
      choices: [
        ...Object.values(NOTIFICATION_TYPE).map(type => ({
          name: NotificationNames[type],
          value: type
        }))
      ]
    },
    {
      type: 'channel',
      required: true,
      name: 'notification_channel',
      description: 'The channel for notifications to be sent',
      channelType: 0 //  Only add text channels
    },
    {
      type: 'string',
      name: 'status',
      description: `Enable or disable notifications of a certain type.`,
      choices: [
        { name: 'Enable', value: 'enable' },
        { name: 'Disable', value: 'disable' }
      ]
    }
  ]
};

class PreferenceCommand extends Command {
  constructor() {
    super(CONFIG);
    this.requiresAdmin = true;
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();

    const guildId = interaction.guild?.id || '';

    if (!guildId || guildId.length === 0) {
      throw new CommandError('This command can only be used in a Discord server.');
    }

    if (!interaction.isCommand()) return;
    if (interaction.type !== InteractionType.ApplicationCommand) return;
    if (!interaction.isChatInputCommand()) return;

    const status: unknown = interaction.options.getString('status', true);
    const channel = interaction.options.getChannel('notification_channel', true) as Channel;
    const notificationType = interaction.options.getString(
      'notification_type',
      true
    ) as NOTIFICATION_TYPE;
    const notificationName = NotificationNames[notificationType as NOTIFICATION_TYPE];

    if (status !== 'disable') {
      if (!isChannelSendable(channel)) {
        throw new CommandError(`Error: <#${channel.id}> is not a valid text channel.`);
      }

      const channelPermissions =
        channel.client.user !== null ? channel.permissionsFor(channel.client.user) : null;

      if (channelPermissions !== null && !channelPermissions.has(PermissionFlagsBits.ViewChannel)) {
        throw new CommandError(`Error: The bot does not have access to <#${channel.id}>.`);
      }

      const missingPermissions = getMissingPermissions(channel);

      if (missingPermissions.length > 0) {
        const missingPermissionsList = missingPermissions.map(p => `\`${p}\``).join(', ');

        throw new CommandError(
          `Error: The bot is missing the following permissions on <#${channel.id}>: \n\n${missingPermissionsList}`
        );
      }

      // As a last test, send an empty message to the channel to test permissions and delete it immediately afterwards
      await channel
        .send('​') // whitespace character
        .then(message => {
          return message.delete();
        })
        .catch(() => {
          throw new CommandError(
            `Error: <#${channel.id}> can't be selected. Please try another channel.`
          );
        });
    }

    let description = '';

    if (status === 'disable') {
      await updateNotificationPreferences(guildId, notificationType, null);
      description = `"${notificationName}" notifications have now been disabled.`;
    } else {
      await updateNotificationPreferences(guildId, notificationType, channel.id);
      description = `"${notificationName}" notifications will now be sent to <#${channel.id}>`;
    }

    const response = new EmbedBuilder()
      .setColor(config.visuals.green)
      .setTitle(`✅ Notification Preferences Updated`)
      .setDescription(description);

    await interaction.editReply({ embeds: [response] });
  }
}

export default new PreferenceCommand();
