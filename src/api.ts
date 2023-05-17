import { Client } from 'discord.js';
import express from 'express';
import cors from 'cors';
import { expressjwt, Request as JWTRequest } from 'express-jwt';
import config from './config';
import { onNotification } from './notifications';
import multer, { Multer } from 'multer';
import { getTokenByValue } from './services/prisma';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const port = process.env.PORT || 3000;

const isRevoked = async req => {
  const token = getToken(req);
  const record = await getTokenByValue(token);
  return record == null;
};

const getToken = req => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

export function init(client: Client) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use(
    '/api',
    expressjwt({
      secret: config.privateKey,
      algorithms: ['HS256'],
      getToken: getToken,
      isRevoked: isRevoked
    })
  );

  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      return res.sendStatus(401);
    }
    next();
  });

  app.post(
    '/api/notifications',
    upload.single('file'),
    async (req: JWTRequest & Express.Multer.File, res: express.Response) => {
      try {
        await onNotification(client, req, res);
      } catch (error) {
        res.sendStatus(500);
      }
    }
  );

  app.listen(port, () => console.log(`Server running on port ${port}`));
}
