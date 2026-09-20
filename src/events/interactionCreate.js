import { Events } from 'discord.js';
import {
  handleTicketCreate,
  handleTicketClose,
} from '../modules/ticket/ticketHandler.js';

export default {
  name: Events.InteractionCreate,
  once: false,
  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    // Xử lý các tương tác Button
    if (interaction.isButton()) {
      const customId = interaction.customId;

      // Nút tạo Ticket (ticket_booking, ticket_apply, ticket_support)
      if (
        customId === 'ticket_booking' ||
        customId === 'ticket_apply' ||
        customId === 'ticket_support'
      ) {
        await handleTicketCreate(interaction);
        return;
      }

      // Nút đóng Ticket (ticket_close)
      if (customId === 'ticket_close') {
        await handleTicketClose(interaction);
        return;
      }
    }
  },
};
