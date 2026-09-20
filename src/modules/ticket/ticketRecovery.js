import { Routes } from 'discord.js';
import { CHANNELS } from '../../config.js';
import { createTicketPanelV2 } from './ticketPanel.js';
import { getPanelMessageId, setPanelMessageId } from '../../utils/runtimeStore.js';

/**
 * Đảm bảo Container Ticket V2 luôn tồn tại:
 * - Dùng Discord Components V2 (Container type 17 chứa các nút bên trong).
 * - Tự động Edit nếu đã có ID trong runtimeStore, hoặc gửi mới & lưu ID vào data/runtime.json nếu bị mất.
 * @param {import('discord.js').Guild} guild
 */
export async function ensureTicketPanel(guild) {
  try {
    const channel = guild.channels.cache.get(CHANNELS.TICKET);
    if (!channel) {
      console.warn(`[Ticket Recovery] ⚠️ Không tìm thấy kênh ticket ID: ${CHANNELS.TICKET}`);
      return null;
    }

    const payload = createTicketPanelV2(guild);
    const existingMessageId = getPanelMessageId('ticket');

    if (existingMessageId) {
      try {
        const updated = await guild.client.rest.patch(
          Routes.channelMessage(CHANNELS.TICKET, existingMessageId),
          { body: payload }
        );
        if (updated) {
          console.log(`[Ticket Recovery] ✅ Đã cập nhật (EDIT) container V2 ID: ${existingMessageId}`);
          return updated;
        }
      } catch (err) {
        console.warn(`[Ticket Recovery] ⚠️ Container cũ (ID: ${existingMessageId}) không tìm thấy trên kênh, chuẩn bị gửi mới...`);
      }
    }

    // Nếu chưa có hoặc tin nhắn cũ bị xóa: Gửi mới qua REST API
    console.log(`[Ticket Recovery] 🔄 Đang tự động gửi lại Container V2 mới vào #${channel.name}...`);
    const newMessage = await guild.client.rest.post(
      Routes.channelMessages(CHANNELS.TICKET),
      { body: payload }
    );

    // Cập nhật ID mới vào data/runtime.json (không đụng vào config.json)
    setPanelMessageId('ticket', newMessage.id);
    console.log(`[Ticket Recovery] ✅ Đã gửi Container V2 mới thành công và lưu ID: ${newMessage.id} vào data/runtime.json!`);

    return newMessage;
  } catch (error) {
    console.error('[Ticket Recovery] ❌ Lỗi khi khôi phục container ticket V2:', error);
    return null;
  }
}
