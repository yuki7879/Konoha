import { Events } from 'discord.js';
import { config } from '../config.js';
import { ensureTicketPanel } from '../modules/ticket/ticketRecovery.js';

export default {
  name: Events.MessageDelete,
  once: false,
  /**
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    if (!message.guild) return;

    // Kiểm tra xem tin nhắn vừa bị xóa có phải là Container Ticket không
    const ticketPanelId = config.panels?.ticket;
    if (ticketPanelId && message.id === ticketPanelId) {
      console.log(`[Ticket Auto-Healing] 🚨 Phát hiện Container Ticket (ID: ${message.id}) vừa bị xóa khỏi kênh!`);
      console.log('[Ticket Auto-Healing] 🔄 Đang tự động gửi lại Container Ticket mới ngay lập tức...');
      await ensureTicketPanel(message.guild);
    }
  },
};
