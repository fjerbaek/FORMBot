FROM node
COPY . /app
WORKDIR /app
RUN npm install nodemon -g
RUN npm install
CMD ["nodemon", "bot.js"]
