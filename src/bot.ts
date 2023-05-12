import { Client, Events, GatewayIntentBits } from 'discord.js';

import * as commands from './commands';

class Bot {
  client: Client;
  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
  }

  async init() {
    this.client.once(Events.ClientReady, () => {
      this.client.user?.setActivity('OSRS');

      this.client.on(Events.InteractionCreate, commands.onInteraction);

      //   this.client.on(Events.GuildCreate, guild => {
      //     const openChannel = findOpenChannel(guild);
      //     if (openChannel) openChannel.send({ embeds: [buildJoinMessage()] });
      //   });

      console.log('Bot is running.');
    });

    await this.client.login(process.env.DISCORD_TOKEN);

    return this.client;
  }
}

export default new Bot();
