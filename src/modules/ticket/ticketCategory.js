import { ChannelType, OverwriteType } from 'discord.js';
import { config } from '../../config.js';
import {
  getTicketRecords,
  setTicketRecord,
} from '../../utils/runtimeStore.js';

export const REQUESTS_CATEGORY_NAME = '•°•────•°• 受付 REQUESTS • °────•°•';
const LOUNGE_CATEGORY_NAME = '•°•────•°• 茶屋 LOUNGE • °────•°•';

function readLegacyTopic(channel) {
  const topic = channel.topic || '';
  if (!topic.includes('konoha:ticket')) return null;

  const type = topic.match(/type:([a-z]+)/)?.[1];
  const ownerId = topic.match(/owner:(\d+)/)?.[1];
  const performerType = topic.match(/performer:([a-z]+)/)?.[1] || null;

  if (!type || !ownerId) return null;

  return {
    type,
    ownerId,
    performerType,
    createdAt: Date.now(),
  };
}

function inferTicketFromChannel(channel, botUserId) {
  const type = ['booking', 'apply', 'support'].find((value) =>
    channel.name.startsWith(`${value}-`)
  );
  if (!type) return null;

  const ownerOverwrite = channel.permissionOverwrites.cache.find(
    (overwrite) =>
      overwrite.type === OverwriteType.Member &&
      overwrite.id !== botUserId
  );

  if (!ownerOverwrite) return null;

  return {
    type,
    ownerId: ownerOverwrite.id,
    performerType: null,
    createdAt: channel.createdTimestamp || Date.now(),
  };
}

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
      reason: 'Konoha ticket rooms',
    });

    console.log(`[Ticket Category] Đã tạo danh mục ${REQUESTS_CATEGORY_NAME}`);
  }

  if (loungeCategory && category.rawPosition !== loungeCategory.rawPosition + 1) {
    await category.setPosition(loungeCategory.rawPosition + 1).catch((error) => {
      console.warn('[Ticket Category] Không thể đặt vị trí danh mục:', error.message);
    });
  }

  // Chuyển dữ liệu ticket cũ khỏi Channel Topic rồi xóa topic kỹ thuật.
  for (const channel of guild.channels.cache.values()) {
    if (channel.type !== ChannelType.GuildText) continue;

    const legacyRecord = readLegacyTopic(channel);
    if (!legacyRecord) continue;

    setTicketRecord(channel.id, legacyRecord);

    if (channel.parentId !== category.id) {
      await channel.setParent(category.id, { lockPermissions: false }).catch(() => {});
    }

    if (channel.topic) {
      await channel.setTopic(null, 'Move Konoha ticket metadata to runtime storage').catch(() => {});
    }
  }

  const knownTickets = getTicketRecords();

  for (const [channelId] of Object.entries(knownTickets)) {
    const channel = guild.channels.cache.get(channelId);
    if (!channel || channel.type !== ChannelType.GuildText) continue;

    if (channel.parentId !== category.id) {
      await channel.setParent(category.id, { lockPermissions: false }).catch(() => {});
    }

    if (channel.topic) {
      await channel.setTopic(null, 'Keep ticket topic clean').catch(() => {});
    }
  }

  // Khôi phục metadata tối thiểu nếu runtime.json bị mất sau deploy/restart.
  for (const channel of guild.channels.cache.values()) {
    if (
      channel.type !== ChannelType.GuildText ||
      channel.parentId !== category.id ||
      knownTickets[channel.id]
    ) {
      continue;
    }

    const inferred = inferTicketFromChannel(channel, guild.client.user.id);
    if (inferred) {
      setTicketRecord(channel.id, inferred);
    }

    if (channel.topic) {
      await channel.setTopic(null, 'Keep ticket topic clean').catch(() => {});
    }
  }

  return category;
}
