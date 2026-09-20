import { EmbedBuilder } from 'discord.js';
import { ROLES, CHANNELS, config } from '../../config.js';

// Deduplication cache: lưu memberId -> timestamp lần gửi cuối để tránh thông báo trùng lặp
const recentBoostNotifications = new Map();
const BOOST_DEDUPE_WINDOW_MS = 60 * 1000; // 60 giây

/**
 * Tìm kênh boost phù hợp trong server
 * @param {import('discord.js').Guild} guild
 * @returns {import('discord.js').TextChannel|null}
 */
export function resolveBoostChannel(guild) {
  // 1. Kiểm tra ID cố định nếu đã cấu hình
  if (CHANNELS.BOOST) {
    const fixedChannel = guild.channels.cache.get(CHANNELS.BOOST);
    if (fixedChannel) return fixedChannel;
  }

  // 2. Tìm kênh có tên chứa "boost" hoặc "桜援"
  const namedChannel = guild.channels.cache.find(
    (c) => c.isTextBased() && (c.name.includes('boost') || c.name.includes('桜援'))
  );
  if (namedChannel) return namedChannel;

  // 3. Sử dụng systemChannel của server (nơi Discord thông báo boost mặc định)
  if (guild.systemChannel) return guild.systemChannel;

  // 4. Dự phòng: gửi vào kênh chat chung (main-chat)
  return guild.channels.cache.get(CHANNELS.MAIN_CHAT) || null;
}

/**
 * Tạo Embed cảm ơn Nitro Boost chuẩn phong cách Konoha (tái sử dụng giữa Handler và Test Scripts)
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').GuildMember|import('discord.js').User} memberOrUser
 * @returns {EmbedBuilder}
 */
export function createBoostEmbed(guild, memberOrUser) {
  const guildName = config.guild?.name || guild?.name || '୨୧ 木ノ葉・KONOHA ୨୧';
  const guideMention = ROLES.GUIDE ? `<@&${ROLES.GUIDE}>` : '@案内役・GUIDE';
  const guardMention = ROLES.GUARD ? `<@&${ROLES.GUARD}>` : '@護衛・GUARD';
  const memberMention = `<@${memberOrUser.id}>`;

  const boostDescription = [
    `${guideMention} ${guardMention} đâu ra cảm ơn ${memberMention} đã Boost cho **${guildName}** đi nào.`,
    '',
    'Một chiếc Boost nhỏ, nhưng là một sự ủng hộ thật lớn dành cho Konoha.',
    'Cảm ơn bạn vì đã góp phần giúp ngôi làng ngày càng đẹp và phát triển hơn.',
    '',
    '「 Konoha trân trọng sự đồng hành của bạn. 」',
  ].join('\n');

  const avatar = typeof memberOrUser.displayAvatarURL === 'function' ? memberOrUser.displayAvatarURL({ dynamic: true }) : null;
  const thumbnailURL = guild?.iconURL({ dynamic: true, size: 512 }) || avatar;

  return new EmbedBuilder()
    .setColor('#f47fff') // Màu hồng tím Nitro Boost
    .setDescription(boostDescription)
    .setThumbnail(thumbnailURL);
}

/**
 * Xử lý gửi lời cảm ơn khi có thành viên Boost server
 * @param {import('discord.js').GuildMember} member
 */
export async function handleServerBoost(member) {
  try {
    const memberId = member.id;
    const now = Date.now();

    // ==========================================
    // P2: DEDUPLICATE BOOST NOTIFY
    // ==========================================
    const lastNotified = recentBoostNotifications.get(memberId);
    if (lastNotified && now - lastNotified < BOOST_DEDUPE_WINDOW_MS) {
      console.log(`[Boost] ℹ️ Đã gửi cảm ơn boost cho ${member.user?.tag || memberId} gần đây, bỏ qua thông báo trùng.`);
      return;
    }

    const guild = member.guild;
    const boostChannel = resolveBoostChannel(guild);

    if (!boostChannel) {
      console.error('[Boost] ❌ Không tìm thấy kênh để gửi thông báo Boost!');
      return;
    }

    const boostEmbed = createBoostEmbed(guild, member);

    await boostChannel.send({
      embeds: [boostEmbed],
    });

    // Cập nhật timestamp vào deduplication cache
    recentBoostNotifications.set(memberId, now);

    // Tự động dọn dẹp cache sau thời gian TTL
    setTimeout(() => {
      recentBoostNotifications.delete(memberId);
    }, BOOST_DEDUPE_WINDOW_MS);

    console.log(`[Boost] ✅ Đã gửi lời cảm ơn Boost cho ${member.user?.tag || memberId} tại #${boostChannel.name}`);
  } catch (error) {
    console.error('[Boost] ❌ Lỗi xử lý cảm ơn Boost:', error);
  }
}
