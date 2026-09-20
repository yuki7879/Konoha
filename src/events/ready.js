import { Events, ActivityType } from 'discord.js';
import { CHANNELS, ROLES, config } from '../config.js';
import { ensureTicketPanel } from '../modules/ticket/ticketRecovery.js';

export default {
  name: Events.ClientReady,
  once: true,
  /**
   * @param {import('discord.js').Client} client
   */
  async execute(client) {
    console.log('==================================================');
    console.log(`🍃 Konoha Bot đã online thành công với tên: ${client.user.tag}`);
    console.log(`🆔 Bot ID: ${client.user.id}`);
    console.log('==================================================');

    // Cài đặt trạng thái Bot mang phong cách Konoha
    client.user.setPresence({
      activities: [
        {
          name: '୨୧ 木ノ葉・KONOHA ୨୧',
          type: ActivityType.Watching,
        },
      ],
      status: 'online',
    });

    // Kiểm tra kênh Chat chung và Guild
    const guildId = config.guild?.id;
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      console.warn(`[Cảnh báo] Bot chưa tham gia Guild có ID: ${guildId}. Hãy mời Bot vào server!`);
      return;
    }

    console.log(`[Kiểm tra] Đã kết nối với Guild: "${guild.name}" (${guild.id})`);

    const mainChat = guild.channels.cache.get(CHANNELS.MAIN_CHAT);
    if (mainChat) {
      console.log(`[Kiểm tra] ✅ Đã tìm thấy kênh main-chat: #${mainChat.name}`);
    } else {
      console.warn(`[Cảnh báo] ⚠️ Chưa tìm thấy kênh main-chat ID ${CHANNELS.MAIN_CHAT} trong cache.`);
    }

    const customRole = guild.roles.cache.get(ROLES.CUSTOM);
    console.log(`[Kiểm tra] Role CUSTOM: ${customRole ? `✅ ${customRole.name}` : '⚠️ Chưa tìm thấy'}`);

    const botRole = guild.roles.cache.get(ROLES.BOT);
    console.log(`[Kiểm tra] Role BOT: ${botRole ? `✅ ${botRole.name}` : '⚠️ Chưa tìm thấy'}`);

    // Tự động kiểm tra và đảm bảo Container Ticket luôn tồn tại trên server
    await ensureTicketPanel(guild);
  },
};
