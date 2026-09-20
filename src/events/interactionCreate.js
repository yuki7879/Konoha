import { Events } from 'discord.js';
import {
  handleBookingStart,
  handleBookingModalSubmit,
  handleTicketCreate,
  handleTicketClose,
} from '../modules/ticket/ticketHandler.js';
import { BOOKING_MODAL_ID } from '../modules/ticket/bookingForm.js';

export default {
  name: Events.InteractionCreate,
  once: false,
  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    if (interaction.isButton()) {
      const customId = interaction.customId;

      if (customId === 'ticket_booking') {
        await handleBookingStart(interaction);
        return;
      }

      if (customId === 'ticket_apply' || customId === 'ticket_support') {
        await handleTicketCreate(interaction);
        return;
      }

      if (customId === 'ticket_close') {
        await handleTicketClose(interaction);
        return;
      }
    }

    if (interaction.isModalSubmit() && interaction.customId === BOOKING_MODAL_ID) {
      await handleBookingModalSubmit(interaction);
    }
  },
};
