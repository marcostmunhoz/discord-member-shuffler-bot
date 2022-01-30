import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from './config.js'
import * as commands from './commands/index.js'

const rest = new REST({ version: '9' }).setToken(config.token);
const commandsArray = [];

for (const command of Object.values(commands)) {
    commandsArray.push(command.data.toJSON());
}

(async () => {
    try {
        console.log('Registering application commands...');

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commandsArray }
        );
    
        console.log('Application commands registered successfully.');
    } catch (e) {
        console.error('There was an error registering the application commands.', e);
    }
})();