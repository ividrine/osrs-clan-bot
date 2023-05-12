import { Client } from 'discord.js';
import express from 'express';
import cors from 'cors';
import { expressjwt, Request as JWTRequest } from 'express-jwt';
import config from './config';
import { onNotification } from './notifications';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const port = process.env.PORT || 3000;

export function init(client: Client) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use('/api', expressjwt({ secret: config.privateKey, algorithms: ['HS256'] }));

  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).send();
    }
    next();
  });

  app.post(
    '/api/notifications',
    upload.single('screenshot'),
    async (req: JWTRequest & { file: any }, res: express.Response) => {
      await onNotification(client, req, res);
    }
  );

  app.listen(port, () => console.log(`Server running on port ${port}`));
}
