FROM node:19-alpine
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
EXPOSE 8091
CMD yarn start:dev