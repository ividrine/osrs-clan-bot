import { DiscordNotification, NOTIFICATION_TYPE, NotificationRequest } from '../models/notification';
import config from '../config';
import { AttachmentBuilder, EmbedBuilder, GuildMember, MessageCreateOptions } from 'discord.js';

class PersonalBest implements DiscordNotification {
  type: NOTIFICATION_TYPE;
  title: string;
  color: number;

  constructor() {
    this.type = NOTIFICATION_TYPE.PERSONALBEST;
    this.title = 'Personal Best';
    this.color = config.visuals.green;
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
      .setFields({ name: '\u200B', value: `<@${user.id}>` })
      .setDescription(data.message)
      .setTimestamp();
    const msg: MessageCreateOptions = {
      embeds: [embed],
      files: files
    };

    return msg;
  }
}

export default new PersonalBest();