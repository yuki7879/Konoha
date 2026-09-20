import { ChannelType } from 'discord.js';
import { config } from '../../config.js';

export const REQUESTS_CATEGORY_NAME = '•°•────•°• 受付 REQUESTS • °────•°•';
const LOUNGE_CATEGORY_NAME = '•°•────•°• 茶屋 LOUNGE • °────•°•';

export function findTicketCategory(guild) {
  return guild.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      channel.name === REQUESTS_CATEGORY_NAME
  ) || null;
}

export async function ensureTicketCategory(guild) {
  const loungeId = config.categories?.[LOUNGE_CATEGORY_NAME];
  const loungeCategory = loungeId ? guild.channels.cache.get(loungeId) : null;

  let category = findTicketCategory(guild);

  if (!category) {
    category = await guild.channels.create({
      name: REQUESTS_CATEGORY_NAME,
      type: ChannelType.GuildCategory,
      reason: 'Konoha: dedicated category for booking/apply/support tickets',
    });

    console.log(`[Ticket Category] ✅ Đã tạo danh mục: ${REQUESTS_CATEGORY_NAME}`);
  }

  if (loungeCategory && category.rawPosition !== loungeCategory.rawPosition + 1) {
    await category.setPosition(loungeCategory.rawPosition + 1).catch((error) => {
      console.warn('[Ticket Category] ⚠️ Không thể đặt danh mục ngay dưới LOUNGE:', error.message);
    });
  }

  const existingTickets = guild.channels.cache.filter(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.topic?.includes('konoha:ticket') &&
      channel.parentId !== category.id
  );

  for (const channel of existingTickets.values()) {
    await channel.setParent(category.id, { lockPermissions: false }).catch((error) => {
      console.warn(`[Ticket Category] ⚠️ Không thể chuyển #${channel.name}: ${error.message}`);
    });
  }

  return category;
}
