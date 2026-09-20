import { EmbedBuilder } from 'discord.js';
import { ROLES, CHANNELS, config } from '../../config.js';

/**
 * Tạo Embed chào mừng thành viên mới theo phong cách Konoha (tái sử dụng giữa Handler và Test Scripts)
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').GuildMember|import('discord.js').User} memberOrUser
 * @returns {EmbedBuilder}
 */
export function createWelcomeEmbed(guild, memberOrUser) {
  const guildName = config.guild?.name || guild?.name || '୨୧ 木ノ葉・KONOHA ୨୧';
  const guideMention = ROLES.GUIDE ? `<@&${ROLES.GUIDE}>` : '@案内役・GUIDE';
  const memberMention = `<@${memberOrUser.id}>`;

  const welcomeDescription = [
    `Hây yooooo chào mừng ${memberMention} đến với **${guildName}**.`,
    '',
    'Một hành trình mới vừa bắt đầu tại Konoha.',
    'Mong bạn sẽ tìm thấy những cuộc trò chuyện thú vị, những người bạn mới và thật nhiều khoảnh khắc đáng nhớ.',
    '',
    `${guideMention} ơi, ra chào đón khách quý nhé! Nếu cần hỗ trợ, đội ngũ Konoha luôn sẵn sàng.`,
    '',
    '「 Chúc bạn có một trải nghiệm thật đẹp tại Konoha. 」',
  ].join('\n');

  const avatar = typeof memberOrUser.displayAvatarURL === 'function' ? memberOrUser.displayAvatarURL({ dynamic: true }) : null;
  const thumbnailURL = guild?.iconURL({ dynamic: true, size: 512 }) || avatar;

  return new EmbedBuilder()
    .setColor('#f48fb1') // Màu hồng hoa anh đào phong cách Konoha
    .setDescription(welcomeDescription)
    .setThumbnail(thumbnailURL);
}

/**
 * Xử lý sự kiện khi có thành viên mới (hoặc bot mới) tham gia server
 * @param {import('discord.js').GuildMember} member
 */
export async function handleGuildMemberAdd(member) {
  try {
    const isBot = member.user.bot;
    const guild = member.guild;

    console.log(`[GuildMemberAdd] Phát hiện ${isBot ? 'Bot' : 'Thành viên'} mới: ${member.user.tag} (${member.id})`);

    // ==========================================
    // 1. CẤP ROLE TỰ ĐỘNG
    // ==========================================
    if (isBot) {
      if (ROLES.BOT) {
        await member.roles.add(ROLES.BOT).catch((err) => {
          console.error(`[AutoRole] Lỗi khi cấp role BOT cho ${member.user.tag}:`, err.message);
        });
        console.log(`[AutoRole] ✅ Đã cấp role BOT (${ROLES.BOT}) cho ${member.user.tag}`);
      }
      return;
    } else {
      if (ROLES.CUSTOM) {
        await member.roles.add(ROLES.CUSTOM).catch((err) => {
          console.error(`[AutoRole] Lỗi khi cấp role CUSTOM cho ${member.user.tag}:`, err.message);
        });
        console.log(`[AutoRole] ✅ Đã cấp role CUSTOM (${ROLES.CUSTOM}) cho ${member.user.tag}`);
      }
    }

    // ==========================================
    // 2. GỬI TIN NHẮN CHÀO MỪNG VÀO KÊNH CHAT CHUNG
    // ==========================================
    const mainChatChannel = guild.channels.cache.get(CHANNELS.MAIN_CHAT);
    if (!mainChatChannel) {
      console.error(`[Welcome] ❌ Không tìm thấy kênh main-chat ID: ${CHANNELS.MAIN_CHAT}`);
      return;
    }

    const welcomeEmbed = createWelcomeEmbed(guild, member);

    await mainChatChannel.send({
      embeds: [welcomeEmbed],
    });

    console.log(`[Welcome] ✅ Đã gửi tin nhắn chào mừng cho ${member.user.tag} tại #${mainChatChannel.name}`);
  } catch (error) {
    console.error('[Welcome] ❌ Lỗi xử lý chào mừng thành viên mới:', error);
  }
}
