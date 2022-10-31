FROM node:12.22.12
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
EXPOSE 8091
CMD yarn start:dev