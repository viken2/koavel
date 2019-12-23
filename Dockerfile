FROM node:10-alpine
LABEL maintainer="viken2011@gmail.com"

RUN apk --update upgrade && apk add curl tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

WORKDIR /app

COPY dist /app

EXPOSE 5600

CMD [ "node", "app.js" ]
