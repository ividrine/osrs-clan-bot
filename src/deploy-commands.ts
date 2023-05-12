import { REST, Routes } from 'discord.js';
import { COMMANDS } from './commands';
const { DISCORD_CLIENT_ID, DISCORD_GUILD_ID, DISCORD_TOKEN } = process.env;

export async function deployCommands() {
  const guildCommands: Array<unknown> = [];
  const globalCommands: Array<unknown> = [];

  for (const command of COMMANDS) {
    const slashCommand = command.slashCommand;

    if (!slashCommand) {
      continue;
    }

    if (process.env.DISCORD_DEV_LOCAL) {
      guildCommands.push(slashCommand.setDescription(`[DEV 🧑‍💻]: ${slashCommand.description}`).toJSON());
    } else if (command.private) {
      guildCommands.push(slashCommand.toJSON());
    } else {
      globalCommands.push(slashCommand.toJSON());
    }
  }

  const restClient = new REST().setToken(DISCORD_TOKEN ?? '');

  if (guildCommands.length > 0) {
    try {
      await restClient.put(
        Routes.applicationGuildCommands(DISCORD_CLIENT_ID ?? '', DISCORD_GUILD_ID ?? ''),
        {
          body: guildCommands
        }
      );
      console.log(`Successfully registered ${guildCommands.length} guild slash commands.`);
    } catch (e) {
      console.log('Failed to register guild commands', e);
    }
  }

  if (globalCommands.length > 0) {
    try {
      await restClient.put(Routes.applicationCommands(DISCORD_CLIENT_ID ?? ''), {
        body: globalCommands
      });
      console.log(`Successfully registered ${globalCommands.length} global slash commands.`);
    } catch (e) {
      console.log('Failed to register global commands', e);
    }
  }
}
