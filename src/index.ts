import 'dotenv/config';
import * as api from './api';
import bot from './bot';
import { deployCommands } from './deploy-commands';

(async () => {
  await deployCommands();
  const client = await bot.init();
  api.init(client);
})();
