module.exports = ({ setting, botData, bot }) => {
    switch (setting) {
        default: {
            console.log(`Unknown setting '${setting}'.`);
            return;
        }
        case 'channelId': {
            let channelName = undefined;
            bot.channels.cache.find(parentChannel => {
                if (parentChannel.type === 'category') {
                    parentChannel.guild.channels.cache.find(childChannel => {
                        if (childChannel.type === 'text') {
                            if (childChannel.id === botData.channelId) {
                                channelName = childChannel.name;
                            }
                        }
                    });
                }

                // We're hacking the find function by simply getting to all the channels from the first channel we find
                return true;
            });

            return channelName;
        }
    }
};
