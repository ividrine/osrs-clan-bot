import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Command, CommandConfig } from '../models/commands';
import jwt from 'jsonwebtoken';
import config from '../config';
import { issueToken } from '../services/prisma';

const CONFIG: CommandConfig = {
  name: 'url',
  description: 'Generate a webhook url for the Dink runelite plugin.'
};

class TokenCommand extends Command {
  constructor() {
    super(CONFIG);
  }

  async execute(interaction: CommandInteraction) {
    if (!interaction.member?.user.id) return;

    if (!interaction.guildId) return;

    const token = jwt.sign(
      { id: interaction.member?.user.id, guildId: interaction.guildId },
      config.privateKey
    );

    await issueToken(interaction.guildId, interaction.member.user.id, token);

    const response = new EmbedBuilder()
      .setColor(config.visuals.blue)
      .setTitle('Webhook Url')
      .setDescription(`https://osrs-clan-bot.herokuapp.com/api/notifications?token=${token}`)
      .setFooter({
        text: "Copy the above url and paste it into the 'Primary Webhook URLs' section of the Dink runelite plugin. Please keep this safe and don't share it with anyone."
      });

    await interaction.reply({ embeds: [response], ephemeral: true });
  }
}

export default new TokenCommand();
