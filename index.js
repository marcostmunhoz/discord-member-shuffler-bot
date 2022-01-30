import { Client } from 'discord.js';
import shuffleArray from './utils/shuffle-array.js';

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES']
});

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

            const names = shuffleArray(list.map(member => member.displayName));

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