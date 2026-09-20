import { Events } from 'discord.js';
import { handleServerBoost } from '../modules/boost/boostHandler.js';
import { ROLES } from '../config.js';

export default {
  name: Events.GuildMemberUpdate,
  once: false,
  /**
   * @param {import('discord.js').GuildMember} oldMember
   * @param {import('discord.js').GuildMember} newMember
   */
  async execute(oldMember, newMember) {
    // 1. Kiểm tra trạng thái premiumSince (Discord Nitro Server Boost chính thức)
    const justBoostedOfficial = !oldMember.premiumSince && Boolean(newMember.premiumSince);

    // 2. Kiểm tra nhận thêm role 桜援・BOOSTER
    const boosterRoleId = ROLES.BOOSTER || '1506566737079042138';
    const justGotBoosterRole =
      !oldMember.roles.cache.has(boosterRoleId) && newMember.roles.cache.has(boosterRoleId);

    if (justBoostedOfficial || justGotBoosterRole) {
      console.log(`[Boost Event] Phát hiện thành viên vừa Boost server: ${newMember.user.tag}`);
      await handleServerBoost(newMember);
    }
  },
};
