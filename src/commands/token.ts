import { Client, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Command, CommandConfig } from '../util/commands';
import jwt from 'jsonwebtoken';
import config from '../config';

const CONFIG: CommandConfig = {
  name: 'token',
  description: 'Generate a new token for the runelite plugin.'
};

class TokenCommand extends Command {
  constructor() {
    super(CONFIG);
  }

  async execute(interaction: CommandInteraction) {
    if (!interaction.member?.user.id) return;

    const token = jwt.sign(
      { id: interaction.member?.user.id, guildId: interaction.guildId },
      config.privateKey
    );

    const response = new EmbedBuilder()
      .setColor(config.visuals.blue)
      .setTitle('Runelite Access Token')
      .setDescription(token)
      .setFooter({
        text: "Copy the above text and paste it into the runelite plugin. Please keep this safe and don't share it with anyone."
      });

    await interaction.reply({ embeds: [response], ephemeral: true });
  }
}

export default new TokenCommand();
