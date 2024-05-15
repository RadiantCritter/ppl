FROM node:alpine

ARG SEARXNG_API_URL

WORKDIR /home/ ash

COPY src /home/ ash/src
COPY tsconfig.json /home/ ash/
COPY config.toml /home/ ash/
COPY package.json /home/ ash/
COPY yarn.lock /home/ ash/

RUN sed -i "s|SEARXNG = \".*\"|SEARXNG = \"${SEARXNG_API_URL}\"|g" /home/ ash/config.toml

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]