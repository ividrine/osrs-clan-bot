import { DiscordNotification, NOTIFICATION_TYPE, NotificationRequest } from '../models/notification';
import config from '../config';
import { AttachmentBuilder, EmbedBuilder, GuildMember, MessageCreateOptions } from 'discord.js';

class Pet implements DiscordNotification {
  type: NOTIFICATION_TYPE;
  title: string;
  color: number;

  constructor() {
    this.type = NOTIFICATION_TYPE.PET;
    this.title = 'Pet Drop';
    this.color = config.visuals.gold;
  }

  buildMessage(
    user: GuildMember,
    data: NotificationRequest,
    screenshot: Express.Multer.File
  ): MessageCreateOptions {
    const files = [new AttachmentBuilder('static/img/helm.jpg')];

    const embed = new EmbedBuilder()
      .setTitle(`${this.title}`)
      .setAuthor({
        name: user.displayName,
        iconURL: `attachment://helm.jpg`
      })
      .setColor(this.color)
      .setFields({ name: '\u200B', value: `<@${user.id}>` })
      .setDescription(data.content)
      .setTimestamp()
      .setFooter({ text: 'Legend' });

    if (screenshot) {
      const attachment = new AttachmentBuilder(screenshot.buffer, { name: screenshot.originalname });
      files.push(attachment);
      embed.setImage(`attachment://${screenshot.originalname}`);
    }

    const msg: MessageCreateOptions = {
      embeds: [embed],
      files: files
    };

    return msg;
  }
}

export default new Pet();
