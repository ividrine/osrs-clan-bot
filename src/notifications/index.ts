import { AttachmentBuilder, Client, EmbedBuilder } from 'discord.js';
import { Request as JWTRequest } from 'express-jwt';
import express from 'express';
import { findOpenChannel } from '../util/discord';
import config from '../config';
import { getTitle } from '../util/notification';

export async function onNotification(
  client: Client,
  req: JWTRequest & { file: any },
  res: express.Response
) {
  const server = client.guilds.cache.get(req.auth?.guildId);
  const user = await server?.members.fetch(req.auth?.id);

  if (!server || !user || !req.body.type || !req.body.message) {
    return res.sendStatus(400);
  }

  const channel = findOpenChannel(server);

  if (channel) {
    const response = new EmbedBuilder()
      .setTitle(`\n${getTitle(req.body.type)}`)
      .setAuthor({
        name: req.body.rsn,
        iconURL: `attachment://helm.jpg`,
        url: `https://wiseoldman.net/players/${req.body.rsn}`
      })
      .setColor(config.visuals.purple)
      .setFields({ name: '\u200B', value: `Congrats, <@${user.id}>` })
      .setDescription(req.body.message)
      .setTimestamp()
      .setFooter({ text: 'Legend' });

    const msg: any = {
      embeds: [response],
      files: [new AttachmentBuilder('static/img/helm.jpg')]
    };

    if (req.file?.buffer) {
      const attachment = new AttachmentBuilder(req.file.buffer, { name: req.file.originalname });
      msg.files = [...msg.files, attachment];
      response.setImage(`attachment://${req.file.originalname}`);
    }

    channel.send(msg);
  }

  res.sendStatus(200);
}
