import {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { ROLES, CHANNELS } from '../../config.js';

const TICKET_TYPES = {
  ticket_booking: {
    name: 'booking',
    title: '💌 Đặt Lịch Hẹn (Booking)',
    color: '#f48fb1',
    rolesToPing: [ROLES.PRINCESS, ROLES.PRINCE, ROLES.ANBU],
    welcomeMessage:
      'Xin chào bạn! Đây là không gian riêng tư để bạn trao đổi và đặt lịch hẹn tâm sự/chơi game/hát cùng các Performer. Đội ngũ Làng Lá sẽ phản hồi ngay nhé.',
  },
  ticket_apply: {
    name: 'apply',
    title: '📝 Ứng Tuyển Gia Nhập Konoha',
    color: '#81c784',
    rolesToPing: [ROLES.HOKAGE, ROLES.ANBU],
    welcomeMessage:
      'Chào mừng bạn đến với mục Ứng Tuyển! Vui lòng để lại đôi nét giới thiệu về bản thân, vị trí bạn muốn ứng tuyển (PRINCE, PRINCESS, GUARD,...) và thời gian hoạt động nhé.',
  },
  ticket_support: {
    name: 'support',
    title: '🛠️ Hỗ Trợ & Khiếu Nại',
    color: '#64b5f6',
    rolesToPing: [ROLES.ANBU, ROLES.GUARD],
    welcomeMessage:
      'Chào bạn! Hãy mô tả chi tiết vấn đề bạn đang gặp phải hoặc khiếu nại cần hỗ trợ. Ban quản trị sẽ hỗ trợ bạn sớm nhất có thể.',
  },
};

/**
 * Xử lý tạo kênh Ticket riêng khi người dùng bấm nút
 * @param {import('discord.js').ButtonInteraction} interaction
 */
export async function handleTicketCreate(interaction) {
  const ticketConfig = TICKET_TYPES[interaction.customId];
  if (!ticketConfig) return;

  await interaction.deferReply({ ephemeral: true });

  const guild = interaction.guild;
  const user = interaction.user;

  // Kiểm tra xem người dùng đã có ticket cùng loại đang mở chưa (tránh spam)
  const existingChannel = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      c.name.startsWith(`${ticketConfig.name}-${user.username.toLowerCase()}`)
  );

  if (existingChannel) {
    return interaction.editReply({
      content: `⚠️ Bạn đã có một phòng ${ticketConfig.title} đang mở tại <#${existingChannel.id}>. Vui lòng chuyển qua đó nhé!`,
    });
  }

  try {
    // Thiết lập quyền riêng tư: chỉ người tạo ticket và các role liên quan mới thấy
    const permissionOverwrites = [
      {
        id: guild.id, // @everyone cấm xem
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: user.id, // Người tạo được xem và gửi tin nhắn
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      },
      {
        id: guild.client.user.id, // Bot
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ManageChannels,
          PermissionsBitField.Flags.EmbedLinks,
        ],
      },
    ];

    // Thêm quyền cho các role phụ trách
    for (const roleId of ticketConfig.rolesToPing) {
      if (roleId && guild.roles.cache.has(roleId)) {
        permissionOverwrites.push({
          id: roleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        });
      }
    }

    // Tạo kênh text riêng
    const channelName = `${ticketConfig.name}-${user.username}`.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const parentCategory = CHANNELS.SUPPORT_CATEGORY || null;

    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: parentCategory,
      permissionOverwrites,
    });

    // Embed chào mừng bên trong phòng ticket
    const pings = ticketConfig.rolesToPing
      .filter((id) => id && guild.roles.cache.has(id))
      .map((id) => `<@&${id}>`)
      .join(' ');

    const insideEmbed = new EmbedBuilder()
      .setColor(ticketConfig.color)
      .setTitle(ticketConfig.title)
      .setDescription(
        `Chào <@${user.id}>,\n\n${ticketConfig.welcomeMessage}\n\nNhấn nút **Đóng Ticket** bên dưới khi buổi trao đổi kết thúc.`
      )
      .setFooter({ text: 'Konoha Ticket System • Bảo mật 24/7' });

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_close')
        .setLabel('Đóng Ticket')
        .setEmoji('🔒')
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({
      content: `${pings} <@${user.id}>`,
      embeds: [insideEmbed],
      components: [closeRow],
    });

    // Ghi log vào kênh ticket-log
    const logChannel = guild.channels.cache.get(CHANNELS.TICKET_LOG);
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor(ticketConfig.color)
        .setTitle('📑 Ticket Mới Được Tạo')
        .setDescription(
          `• **Người tạo:** <@${user.id}> (${user.tag})\n• **Loại:** ${ticketConfig.title}\n• **Kênh:** <#${ticketChannel.id}>`
        )
        .setTimestamp();
      await logChannel.send({ embeds: [logEmbed] }).catch(() => {});
    }

    await interaction.editReply({
      content: `✅ Đã mở phòng trao đổi riêng cho bạn tại: <#${ticketChannel.id}>`,
    });
  } catch (error) {
    console.error('[Ticket] ❌ Lỗi khi tạo kênh ticket:', error);
    await interaction.editReply({
      content: '❌ Đã có lỗi xảy ra khi tạo phòng ticket. Vui lòng thử lại sau hoặc liên hệ Admin!',
    });
  }
}

/**
 * Xử lý đóng ticket
 * @param {import('discord.js').ButtonInteraction} interaction
 */
export async function handleTicketClose(interaction) {
  await interaction.reply({
    content: '🔒 Kênh này sẽ được đóng và tự động xóa sau 5 giây...',
  });

  const channel = interaction.channel;
  const guild = interaction.guild;
  const user = interaction.user;

  // Ghi log đóng ticket
  const logChannel = guild.channels.cache.get(CHANNELS.TICKET_LOG);
  if (logChannel) {
    const logEmbed = new EmbedBuilder()
      .setColor('#ef5350')
      .setTitle('🔒 Ticket Đã Đóng')
      .setDescription(
        `• **Người bấm đóng:** <@${user.id}> (${user.tag})\n• **Tên phòng:** \`#${channel.name}\``
      )
      .setTimestamp();
    await logChannel.send({ embeds: [logEmbed] }).catch(() => {});
  }

  setTimeout(async () => {
    await channel.delete().catch(() => {});
  }, 5000);
}
