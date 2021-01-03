const setChannel = require('./setChannel');

module.exports = ({ setting, arguments, botData, bot }) => {
    switch (setting) {
        default: {
            console.log(`Unknown setting '${setting}'.`);
            return;
        }
        case 'channelId': {
            setChannel(bot, botData, arguments[0]);
            return;
        }
    }
};
