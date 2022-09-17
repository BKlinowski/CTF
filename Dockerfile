FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install

RUN echo -n "test123321" > /home/flag

COPY . .

EXPOSE 3000

CMD ["npm", "start"]