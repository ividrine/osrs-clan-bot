import { DiscordNotification, NOTIFICATION_TYPE, NotificationRequest } from '../models/notification';
import config from '../config';
import { AttachmentBuilder, EmbedBuilder, GuildMember, MessageCreateOptions } from 'discord.js';

class CofferDeposit implements DiscordNotification {
  type: NOTIFICATION_TYPE;
  title: string;
  color: number;

  constructor() {
    this.type = NOTIFICATION_TYPE.COFFERDEPOSIT;
    this.title = 'Coffer Deposit';
    this.color = config.visuals.orange;
  }

  buildMessage(
    user: GuildMember,
    data: NotificationRequest,
    screenshot: Express.Multer.File
  ): MessageCreateOptions {
    const files = [new AttachmentBuilder('static/img/helm.jpg')];

    const embed = new EmbedBuilder()
      .setTitle(this.title)
      .setAuthor({
        name: data.rsn,
        iconURL: `attachment://helm.jpg`,
        url: `https://wiseoldman.net/players/${data.rsn}`
      })
      .setColor(this.color)
      .setDescription(data.message)
      .setFields({ name: '\u200B', value: `<@${user.id}>` })
      .setTimestamp();

    const msg: MessageCreateOptions = {
      embeds: [embed],
      files: files
    };

    return msg;
  }
}

export default new CofferDeposit();
