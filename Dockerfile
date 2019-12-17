FROM node:10-alpine

WORKDIR /app

COPY dist /app

EXPOSE 5600

CMD [ "node", "app.js" ]
