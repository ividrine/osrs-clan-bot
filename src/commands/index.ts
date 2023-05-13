import {
  Interaction,
  InteractionType,
  EmbedBuilder,
  Embed,
  Message,
  ChannelType,
  Client,
  GuildMember
} from 'discord.js';
import config from '../config';

import { BaseCommand, CommandError } from '../models/commands';

import TokenCommand from './token';
import PreferenceCommand from './preference';
import { isAdmin } from '../models/discord';

export const COMMANDS: BaseCommand[] = [TokenCommand, PreferenceCommand];

export async function onMessage(message: Message) {
  if (message.channel.type != ChannelType.DM) return;
}

export async function onInteraction(interaction: Interaction) {
  if (!interaction.isCommand()) return;
  if (interaction.type !== InteractionType.ApplicationCommand) return;
  if (!interaction.isChatInputCommand()) return;

  const commandName = interaction.commandName;

  try {
    const targetCommand = COMMANDS.find(cmd => cmd.slashCommand.name === commandName);
    if (!targetCommand) {
      throw new Error(`Error: Command not implemented: ${commandName}`);
    }

    if (targetCommand.requiresAdmin && !isAdmin(interaction.member as GuildMember)) {
      const error = new CommandError('That command requires Admin permissions.');
      await interaction.followUp({ embeds: [buildErrorEmbed(error)] });
      return;
    }

    await targetCommand.execute(interaction);
  } catch (err) {
    console.log(err);
    await interaction.followUp({ embeds: [buildErrorEmbed(err)] });
  }
}

function buildErrorEmbed(error: Error) {
  const response = new EmbedBuilder().setColor(config.visuals.red);

  if (error instanceof CommandError) {
    response.setDescription(error.message);
    if (error.tip) response.setFooter({ text: error.tip });
  } else {
    response.setDescription('An unexpected error occurred.');
  }

  return response;
}
