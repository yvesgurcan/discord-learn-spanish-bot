const Discord = require('discord.js');

const getQuestion = require('./getQuestion');
const { botToken } = require('../config.json');
const checkAnswer = require('./checkAnswer');
const checkQuestion = require('./checkQuestion');

const ERROR_MESSAGE = 'Oops! I think I tripped. Silly me.';

const bot = new Discord.Client();

let botData = {
    ongoingQuestions: []
};

bot.login(botToken);

bot.once('ready', () => {
    console.log('Bot ready:', { username: bot.user.username, id: bot.user.id });
    botData.id = bot.user.id;
    botData.username = bot.user.username;
});

bot.on('message', async message => {
    try {
        if (message.author.bot) {
            return;
        }

        console.log(`Raw message content: ${message.content}`);

        const commands = /^(!quiz|!pregunta|!answer|!respuesta|!key|!clave)/g;

        const commandMatch = message.content.match(commands);

        if (!commandMatch) {
            return;
        }

        console.log(`Command: ${commandMatch}`);
        const formattedMessage = message.content
            .replace(commandMatch[0], '')
            .replace(' ', '');

        switch (commandMatch[0]) {
            case '!quiz':
            case '!pregunta': {
                const question = await getQuestion({
                    message: formattedMessage,
                    botData
                });

                console.log(`Question: ${question}`);
                message.channel.send(question);
                return;
            }
            case '!answer':
            case '!respuesta': {
                if (botData.ongoingQuestions.length === 0) {
                    message.channel.send('Please ask for a question first.');
                    return;
                }

                if (!formattedMessage) {
                    message.channel.send('Please enter your answer.');
                    return;
                }

                const answer = await checkAnswer({
                    message: formattedMessage,
                    botData
                });

                message.channel.send(answer);
                return;
            }
            case '!key':
            case '!clave': {
                if (botData.ongoingQuestions.length === 0) {
                    message.channel.send('Please ask for a question first.');
                    return;
                }

                if (!formattedMessage) {
                    message.channel.send('Please enter the question key.');
                    return;
                }

                const key = await checkQuestion({
                    message: formattedMessage,
                    botData
                });

                message.channel.send(key);
                return;
            }
            default: {
                message.channel.send('Unknown command.');
                return;
            }
        }
    } catch (error) {
        console.error(error);
        message.channel.send(
            `${ERROR_MESSAGE}. Somebody knows what "${error}" means?`
        );
    }
});
