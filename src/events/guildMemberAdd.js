import { Events } from 'discord.js';
import { handleGuildMemberAdd } from '../modules/welcome/welcomeHandler.js';

export default {
  name: Events.GuildMemberAdd,
  once: false,
  /**
   * @param {import('discord.js').GuildMember} member
   */
  async execute(member) {
    await handleGuildMemberAdd(member);
  },
};
