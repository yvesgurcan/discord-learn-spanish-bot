const sendAutonomousMessage = require('./sendAutonomousMessage');

module.exports = (bot, botData, targetChannel) => {
    let updated = false;
    bot.channels.cache.find(parentChannel => {
        if (parentChannel.type === 'category') {
            parentChannel.guild.channels.cache.find(childChannel => {
                if (childChannel.type === 'text') {
                    if (childChannel.name === targetChannel) {
                        updated = true;
                        botData.channelId = childChannel.id;
                        console.log(
                            `Target channel '${targetChannel}' ID: ${childChannel.id}`
                        );
                        sendAutonomousMessage({
                            message: '¿Cómo están? Soy aquí ahora.',
                            botData,
                            bot
                        });
                    }
                }
            });
        }

        // We're hacking the find function by simply getting to all the channels from the first channel we find
        return true;
    });

    if (!updated) {
        botData.channelId = undefined;
    }
};
