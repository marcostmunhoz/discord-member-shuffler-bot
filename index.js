import { Client } from 'discord.js';
import * as commands from './commands/index.js'
import './deploy-commands.js';

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_PRESENCES']
});


client.on('ready', () => {
    console.log(`Bot started successfully. Currently logged in as '${client.user.tag}'`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) {
        return;
    }

    for (const command of Object.values(commands)) {
        if (command.data.name !== interaction.commandName) {
            continue;
        }

        try {
            await command.execute(interaction);
        } catch (e) {
            console.error(`There was an error during the '${interaction.commandName}' command execution.`, e);

            await interaction.reply({
                content: 'Sorry... I think I messed up :face_with_spiral_eyes:',
                ephemeral: true
            });
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);