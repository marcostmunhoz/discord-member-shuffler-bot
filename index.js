const { Client } = require('discord.js')

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES']
});

/**
 * Shuffles array in place. ES6 version
 * 
 * @param {Array} array items An array containing the items.
 * @returns {Array}
 * 
 * @see https://stackoverflow.com/a/6274381
 */
 function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

try {
    client.on('ready', () => {
        console.log(`Bot started successfully. Currently logged in as '${client.user.tag}'`);
    })

    client.on('messageCreate', async message => {
        const {content, guild} = message;

        if (content.startsWith('!shuffle')) {
            const {members} = guild;
            const argument = content.substr(8).trim() || 'members';
            const list = await members.fetch();
            let response = null;

            switch (argument) {
                case 'member':
                case 'members':
                    list.sweep(member => member.user.bot);
                    response = 'Here\'s the shuffled list of server members:\n';
                    break;
                case 'bot':
                case 'bots':
                    list.sweep(member => !member.user.bot);
                    response = 'Here\'s the shuffled list of server bots:\n';
                    break;
                case 'all':
                    response = 'Here\'s the shuffled list of server members (including bots):\n';
                    break;
                default:
                    await message.reply(`Invalid argument '${argument}'`);
                    return;
            }

            const names = shuffle(list.map(member => member.displayName));

            for (let index in names) {
                response += `\n${parseInt(index) + 1}) ${names[index]}`;
            }

            await message.reply(response);
        }
    })

    client.login(process.env.DISCORD_BOT_TOKEN)
} catch (e) {
    console.error('There was an error', e);
}