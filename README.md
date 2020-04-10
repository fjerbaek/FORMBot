# FORMBot
A discord bot for TÅGEKAMMERETs discord channel.
Created with [Discord.js](https://discord.js.org/#/)
To get understanding of the project, please follow [this guide] (https://discordjs.guide/)

# Dependencies
- [Node.js](https://nodejs.org/)
- [Mongodb](https://www.mongodb.com)

#Usage
To run this bot do either of the follwing:

### Without docker and docker-compose
- Install node.js
- Install mongodb
- OPTIONAL: `npm install nodemon --global` If you want nodemon to rerun bot on file changes
- `npm install`
- Setup `config.json_template` and rename to `config.json` 
- Run instance of `mongod`
- Run `mongo < dbsetup.js`
- Run `node bot.js` or `nodemon bot.js`

### With docker and docker-compose
- Run `docker-compose up`
- Run `docker-compose exec mongodb mongo < dbsetup.js` (Only on first run)
- Run `docker-compose down`  to stop the bot

### Nodemon configuration
If using nodemon (The docker setup does so), you can setup [nodemon.json](./nodemon.json) to watch files and automatically reload them on save.
To do so, delete the line `"ignore":"[*]"` and add files/paths to watch to `watch`.
