module.exports = ({ message, botData, bot, callback }) => {
    if (botData.channelId) {
        const channel = bot.channels.cache.get(botData.channelId);
        channel.send(message);
        if (callback) {
            setTimeout(callback, 500);
        }
    }
};
