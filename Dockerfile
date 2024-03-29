FROM node:18.16.0

WORKDIR /app

ENV NODE_ENV=development

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm i

# Copy the rest of the files into the container
COPY . .

# Transpile the TypeScript code into JavaScript
RUN npm run postinstall