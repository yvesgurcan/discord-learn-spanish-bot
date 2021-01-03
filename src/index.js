const Discord = require('discord.js');

const getQuestion = require('./getQuestion');
const { botToken, targetChannel } = require('../config.json');
const checkAnswer = require('./checkAnswer');
const checkQuestion = require('./checkQuestion');
const sendAutonomousMessage = require('./sendAutonomousMessage');
const setConfig = require('./setConfig');
const getConfig = require('./getConfig');
const setChannel = require('./setChannel');

const ERROR_MESSAGE = 'Oops! I think I tripped. Silly me.';

const bot = new Discord.Client();

let botData = {
    channelId: undefined,
    ongoingQuestions: []
};

bot.login(botToken);

bot.on('ready', () => {
    console.log('Bot ready:', { username: bot.user.username, id: bot.user.id });
    botData.id = bot.user.id;
    botData.username = bot.user.username;

    setChannel(bot, botData, targetChannel);

    if (botData.channelId) {
        sendAutonomousMessage({
            message: '¡Hola! Estoy conectado.',
            botData,
            bot
        });
    }
});

bot.on('message', async message => {
    try {
        if (message.author.bot) {
            return;
        }

        // If bot is assigned to a channel, only respond from messages coming from that channel
        if (botData.channelId && message.channel.id !== botData.channelId) {
            return;
        }

        console.log(`Raw message content: ${message.content}`);

        const commands = /^(!config|!quiz|!pregunta|!answer|!respuesta|!key|!clave)/g;

        const commandMatch = message.content.match(commands);

        if (!commandMatch) {
            return;
        }

        console.log(`Command: ${commandMatch}`);
        const formattedMessage = message.content
            .replace(commandMatch[0], '')
            .replace(' ', '');

        switch (commandMatch[0]) {
            case '!config': {
                if (!formattedMessage) {
                    message.channel.send(
                        `Type one of the following commands: \n\`!config get channel\`: Gets where the bot sends general messages. \n\`!config set channel CHANNEL_NAME\`: Sets where the bot sends general messages.
                        `
                    );
                    return;
                }

                const arguments = formattedMessage.split(' ');
                console.log(`Config arguments: ${arguments}`);

                switch (arguments[0]) {
                    default: {
                        message.channel.send(
                            `Unknown argument \`${arguments[0]}\`. Should be \`get\` or \`set\`.`
                        );
                        return;
                    }
                    case 'set': {
                        if (arguments.length < 2) {
                            message.channel.send(
                                `Command expects at least 2 arguments: \`!config set SETTING\``
                            );
                            return;
                        }

                        switch (arguments[1]) {
                            default: {
                                message.channel.send(
                                    `Unknown setting \`${arguments[1]}\`. Should be \`channel\`.`
                                );
                                return;
                            }
                            case 'channel': {
                                if (!arguments[2]) {
                                    message.channel.send(
                                        `Command expects at least 3 arguments: \`!config set channel CHANNEL_NAME\``
                                    );
                                    return;
                                }

                                setConfig({
                                    setting: 'channelId',
                                    arguments: [arguments[2]],
                                    botData,
                                    bot
                                });

                                if (botData.channelId === undefined) {
                                    message.channel.send(
                                        `Channel \`${arguments[2]}\` not found.`
                                    );
                                }
                                return;
                            }
                        }
                    }
                    case 'get': {
                        if (arguments.length < 2) {
                            message.channel.send(
                                `Command expects at least 2 arguments: \`!config get SETTING\``
                            );
                            return;
                        }

                        switch (arguments[1]) {
                            default: {
                                message.channel.send(
                                    `Unknown setting \`${arguments[1]}\`. Should be \`channel\`.`
                                );
                                return;
                            }
                            case 'channel': {
                                const setting = getConfig({
                                    setting: 'channelId',
                                    botData,
                                    bot
                                });
                                message.channel.send(setting || 'undefined');
                            }
                        }
                        return;
                    }
                }
            }
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
    sendAutonomousMessage({
        message: 'Disconectando... ¡Adios!',
        botData,
        bot,
        callback: () => {
            console.log('Exiting process.');
            process.exit(0);
        }
    });
}

process
    .once('SIGUSR2', exitGracefully)
    // cleanup when process is terminated
    .on('SIGINT', exitGracefully)
    .on('SIGTERM', exitGracefully)
    // cleanup when process is restarted
    .on('SIGHUP', exitGracefully);
