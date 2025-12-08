FROM node:current-alpine

WORKDIR /app

# manually installing chrome
RUN apk add chromium
RUN apk update && apk add bash
# skips puppeteer installing chrome and points to correct binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package.json .

COPY waitforit.sh /waitforit.sh

RUN chmod +x /waitforit.sh

RUN npm install

COPY . .

CMD ["/waitforit.sh", "backend:80","-t", "5", "--", "npm", "start"]