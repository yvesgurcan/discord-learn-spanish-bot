const Discord = require('discord.js');

const getQuestion = require('./getQuestion');
const { botToken, targetChannel } = require('../config.json');
const checkAnswer = require('./checkAnswer');
const checkQuestion = require('./checkQuestion');

const ERROR_MESSAGE = 'Oops! I think I tripped. Silly me.';

const bot = new Discord.Client();

let botData = {
    channelId: null,
    ongoingQuestions: []
};

bot.login(botToken);

bot.on('ready', () => {
    console.log('Bot ready:', { username: bot.user.username, id: bot.user.id });
    botData.id = bot.user.id;
    botData.username = bot.user.username;

    bot.channels.cache.find(parentChannel => {
        if (parentChannel.type === 'category') {
            parentChannel.guild.channels.cache.find(childChannel => {
                if (childChannel.type === 'text') {
                    if (childChannel.name === targetChannel) {
                        botData.channelId = childChannel.id;
                        console.log(
                            `Target channel '${targetChannel}' ID: ${childChannel.id}`
                        );
                    }
                }
            });
        }

        // We're hacking the find function by simply getting to all the channels from the first channel we find
        return true;
    });

    if (botData.channelId) {
        const channel = bot.channels.cache.get(botData.channelId);
        channel.send('¡Hola! Estoy conectado.');
    }
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

async function exitGracefully() {
    if (botData.channelId) {
        const channel = bot.channels.cache.get(botData.channelId);
        channel.send('Disconectando... ¡Adios!');
    }
}

process
    .once('SIGUSR2', exitGracefully)
    // cleanup when process is terminated
    .on('SIGINT', exitGracefully)
    .on('SIGTERM', exitGracefully)
    // cleanup when process is restarted
    .on('SIGHUP', exitGracefully);
