const {Client, Intents} = require('discord.js')

const { GUILDS, GUILD_MEMBERS, GUILD_MESSAGES } = Intents.FLAGS;
const client = new Client({
    intents: [GUILDS, GUILD_MEMBERS, GUILD_MESSAGES]
});


client.on('ready', () => {
    console.log(`Bot started successfully. Currently logged in as '${client.user.tag}'`);
})

client.on('messageCreate', async message => {
    const {content, guild} = message;

    if (content === '!shuffle members') {
        const {members} = guild;

        const list = await members.list()
        const names = list
            .map(member => member.displayName)
            .sort(() => 0.5 - Math.random());
        let response = 'Here\'s the shuffled list of server members:\n';

        for (let index in names) {
            response += `\n${parseInt(index) + 1}) ${names[index]}`;
        }

        await message.reply(response);
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)