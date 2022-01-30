import { SlashCommandBuilder } from '@discordjs/builders';
import { Guild, Interaction, GuildMember, Role } from 'discord.js';
import shuffleArray from '../utils/shuffle-array.js';

/**
 * @typedef {Object} MemberFilterOptions
 * @property {boolean} online Filters only "online" (!= offline) members
 * @property {Role} role Filters only members of a given role
 */

/**
 * @param {Guild} guild 
 * @param {MemberFilterOptions} options
 * 
 * @returns {Promise<GuildMember[]>}
 */
const getShuffledMemberList = async (guild, options = {}) => {
    const fetchOptions = {};

    if (options.online) {
        fetchOptions.withPresence = true;
    }

    const members = (await guild.members.fetch(fetchOptions))
        .filter(member => {
            // only non bot users
            if (member.user.bot) {
                return false;
            }

            
            // only online users
            let isStatusValid = true;
            if (options.online) {
                isStatusValid = member.presence &&
                    member.presence.status &&
                    member.presence.status.toString() !== 'offline';
            }

            // only with given role
            let isRoleValid = true;
            if (options.role) {
                isRoleValid = member.roles.cache.has(options.role.id);
            }

            return isStatusValid && isRoleValid;
        })
        .toJSON();

    return shuffleArray(members);
} 

export default {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Returns a shuffled list of server members.')
        .addBooleanOption(
            option => option.setName('offline')
                .setDescription('Include offline members.')
                .setRequired(false)
        )
        .addRoleOption(
            option => option.setName('role')
                .setDescription('Member role filter')
                .setRequired(false)
        ),
    /**
     * @param {Interaction} interaction 
     * 
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const includesOfflineMembers = interaction.options.getBoolean('offline');
        const role = interaction.options.getRole('role');
        const members = await getShuffledMemberList(interaction.guild, {
            online: !includesOfflineMembers,
            role: role,
        });

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