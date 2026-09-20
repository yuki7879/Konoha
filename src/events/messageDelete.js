import { Events } from 'discord.js';
import { ENV } from '../config.js';
import { getPanelMessageId } from '../utils/runtimeStore.js';
import { ensureTicketPanel } from '../modules/ticket/ticketRecovery.js';

export default {
  name: Events.MessageDelete,
  once: false,
  /**
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    const ticketPanelId = getPanelMessageId('ticket');
    if (!ticketPanelId) return;

    // Tin nhắn partial vẫn có message.id
    if (message.id === ticketPanelId) {
      console.log(`[Ticket Auto-Healing] 🚨 Phát hiện Container Ticket (ID: ${message.id}) vừa bị xóa!`);
      console.log('[Ticket Auto-Healing] 🔄 Đang tự động gửi lại Container Ticket mới ngay lập tức...');

      const guild = message.guild || message.client.guilds.cache.get(ENV.GUILD_ID);
      if (guild) {
        await ensureTicketPanel(guild);
      } else {
        console.error('[Ticket Auto-Healing] ❌ Không thể xác định Guild để tự phục hồi ticket panel.');
      }
    }
  },
};
