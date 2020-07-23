const moment = require('moment');
const formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().calendar()
    }
};

module.exports = formatMessage;