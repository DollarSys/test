require('dotenv').config();

module.exports = {
    token: process.env.CLIENT_TOKEN,
    mongo: process.env.MONGO_URI,
    prefix: '!',
    login_link: 'http://domain.com/login/redirect',
    owners: ['796166572104089631', '728154147094003782'],

    guilds: {
        'server id': {
            roles: ['role id']
        },
        'server id 2': {
            roles: ['role id']
        },
    }
}