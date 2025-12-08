FROM node:19.0.0

WORKDIR /app

COPY package.json .

COPY waitforit.sh /waitforit.sh

RUN chmod +x /waitforit.sh

RUN npm install

COPY . .

EXPOSE 3000

CMD ["/waitforit.sh", "db:5432","-t", "5", "--", "npm", "start"]