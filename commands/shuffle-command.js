import { SlashCommandBuilder } from '@discordjs/builders';
import { Guild, Interaction, GuildMember } from 'discord.js';
import shuffleArray from '../utils/shuffle-array.js';

/**
 * @param {Guild} guild 
 * 
 * @returns {Promise<GuildMember[]>}
 */
const getShuffledMemberList = async (guild) => {
    
    const members = (await guild.members.fetch())
        .filter(member => {
            // only non bot users
            if (member.user.bot) {
                return false;
            }

            return true;
        })
        .toJSON();

    return shuffleArray(members);
} 

export default {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Returns a shuffled list of server members.'),
    /**
     * @param {Interaction} interaction 
     * 
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const members = await getShuffledMemberList(interaction.guild);

        if (members.length === 0) {
            await interaction.reply('Hmmm.. I can\'t find anyone... :frowning:')

            return;
        }

        let response = 'There it is:\n';

        for (const member of members) {
            response += `\n<@${member.id}>`;
        }

        await interaction.reply(response);
    }
}