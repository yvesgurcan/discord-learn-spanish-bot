const Discord = require('discord.js');

const getAnswer = require('./getAnswer');
const { botToken } = require('../config.json');

const ERROR_MESSAGE = 'Oops! I think I tripped. Silly me.';

const bot = new Discord.Client();

let botData = {};

bot.login(botToken);

bot.once('ready', () => {
    console.log('Bot ready:', { username: bot.user.username, id: bot.user.id });
    botData.id = bot.user.id;
    botData.username = bot.user.username;
});

bot.on('message', message => {
    try {
        if (message.author.bot) {
            return;
        }

        console.log(`Raw message content: ${message.content}`);
        // console.log(message);

        if (message.mentions.users.size === 0) {
            return;
        }

        // console.log(`Mentions:`, message.mentions.users);
        if (message.mentions.users.get(botData.id)) {
            console.log(`${botData.username} was mentioned.`);

            const answer = getAnswer({ message, botData });

            console.log(`Answer: ${answer}`);
            message.channel.send(answer);
            return;
        }
    } catch (error) {
        console.error(error);
        message.channel.send(
            `${ERROR_MESSAGE}. Somebody knows what "${error}" means?`
        );
    }
});
