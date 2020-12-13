FROM node:14.15.1

WORKDIR /app

COPY package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install --production

COPY ./src /app/src
COPY ./tsconfig.json /app/tsconfig.json
RUN npm run build

ENTRYPOINT ["npm", "run", "start"]
