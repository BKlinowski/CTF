FROM node:19.0.0

WORKDIR /app

COPY package.json .

COPY waitforit.sh /waitforit.sh

RUN chmod +x /waitforit.sh

RUN npm install

COPY . .

EXPOSE 3000

CMD ["/waitforit.sh", "pg:3306","-t", "5", "--", "npm", "start"]