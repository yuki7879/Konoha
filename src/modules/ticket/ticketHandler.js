import {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { ROLES, CHANNELS } from '../../config.js';
import { createBookingModal, readBookingModal } from './bookingForm.js';
import { ensureTicketCategory } from './ticketCategory.js';
import {
  deleteTicketRecord,
  findTicketRecord,
  getTicketRecord,
  setTicketRecord,
} from '../../utils/runtimeStore.js';

const pendingCreations = new Set();
const closingChannels = new Set();

export const TICKET_TYPES = {
  ticket_booking: {
    name: 'booking',
    title: '💌 Đặt Lịch Hẹn (Booking)',
    color: '#f48fb1',
    rolesToPing: [ROLES.ANBU, ROLES.GUARD],
    welcomeMessage:
      'Yêu cầu booking của bạn đã được ghi nhận. Guard và nhóm đào phù hợp sẽ tiếp nhận tại phòng này.',
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

export async function handleBookingStart(interaction) {
  try {
    await interaction.showModal(createBookingModal());
  } catch (error) {
    console.error('[Booking] ❌ Không thể mở form booking:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: '❌ Không thể mở form booking lúc này. Vui lòng thử lại.',
        ephemeral: true,
      }).catch(() => {});
    }
  }
}

export async function handleBookingModalSubmit(interaction) {
  const bookingData = readBookingModal(interaction);

  if (!bookingData.service) {
    return interaction.reply({
      content: '❌ Dịch vụ là thông tin bắt buộc.',
      ephemeral: true,
    });
  }

  if (!['prince', 'princess'].includes(bookingData.performerType)) {
    return interaction.reply({
      content: '❌ Vui lòng chọn PRINCE hoặc PRINCESS.',
      ephemeral: true,
    });
  }

  return handleTicketCreate(interaction, {
    ticketTypeId: 'ticket_booking',
    bookingData,
  });
}

/**
 * Tạo ticket cho Booking / Apply / Support.
 * Booking có thể kèm dữ liệu đã lấy từ modal.
 * @param {import('discord.js').RepliableInteraction} interaction
 * @param {{ticketTypeId?: string, bookingData?: {service:string, performerType:string, budget:string|null, time:string|null}|null}} options
 */
export async function handleTicketCreate(interaction, options = {}) {
  const ticketTypeId = options.ticketTypeId || interaction.customId;
  const bookingData = options.bookingData || null;
  const ticketConfig = TICKET_TYPES[ticketTypeId];
  if (!ticketConfig) return;

  const user = interaction.user;
  const ticketKey = `${user.id}:${ticketConfig.name}`;

  if (pendingCreations.has(ticketKey)) {
    return interaction.reply({
      content: `⚠️ Đang xử lý tạo phòng ${ticketConfig.title} cho bạn, vui lòng đợi trong giây lát...`,
      ephemeral: true,
    });
  }

  pendingCreations.add(ticketKey);

  try {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const requestsCategory = await ensureTicketCategory(guild);

    const existingRecord = findTicketRecord({
      ownerId: user.id,
      type: ticketConfig.name,
    });
    const existingChannel = existingRecord
      ? guild.channels.cache.get(existingRecord.channelId)
      : null;

    if (existingRecord && !existingChannel) {
      deleteTicketRecord(existingRecord.channelId);
    }

    if (existingChannel) {
      if (existingChannel.parentId !== requestsCategory.id) {
        await existingChannel.setParent(requestsCategory.id, { lockPermissions: false }).catch(() => {});
      }

      return interaction.editReply({
        content: `Bạn đã có một phòng đang mở tại <#${existingChannel.id}>.`,
      });
    }

    const dynamicPerformerRole =
      bookingData?.performerType === 'prince'
        ? ROLES.PRINCE
        : bookingData?.performerType === 'princess'
          ? ROLES.PRINCESS
          : null;

    const roleIds = [...new Set([
      ...ticketConfig.rolesToPing,
      dynamicPerformerRole,
    ].filter(Boolean))];

    const permissionOverwrites = [
      {
        id: guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      },
      {
        id: guild.client.user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ManageChannels,
          PermissionsBitField.Flags.EmbedLinks,
        ],
      },
    ];

    for (const roleId of roleIds) {
      if (guild.roles.cache.has(roleId)) {
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

    const sanitizedUsername =
      user.username.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20) || 'user';
    const channelName = `${ticketConfig.name}-${sanitizedUsername}`;
    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: requestsCategory.id,
      permissionOverwrites,
    });

    setTicketRecord(ticketChannel.id, {
      ownerId: user.id,
      type: ticketConfig.name,
      performerType: bookingData?.performerType || null,
      createdAt: Date.now(),
    });

    const staffPings = ticketConfig.rolesToPing
      .filter((id) => id && guild.roles.cache.has(id))
      .map((id) => `<@&${id}>`)
      .join(' ');

    const insideEmbed = new EmbedBuilder()
      .setColor(ticketConfig.color)
      .setTitle(ticketConfig.title)
      .setDescription(
        `Chào <@${user.id}>,\n\n${ticketConfig.welcomeMessage}\n\nNhấn nút **Đóng Ticket** khi trao đổi kết thúc.`
      )
      .setFooter({ text: 'Konoha Ticket System' })
      .setTimestamp();

    if (bookingData) {
      const performerLabel =
        bookingData.performerType === 'prince'
          ? '王子・PRINCE'
          : '姫君・PRINCESS';

      insideEmbed.addFields(
        {
          name: 'Dịch vụ',
          value: bookingData.service,
        },
        {
          name: 'Đào',
          value: performerLabel,
          inline: true,
        },
        {
          name: 'Ngân sách',
          value: bookingData.budget || 'Không ghi',
          inline: true,
        },
        {
          name: 'Thời gian',
          value: bookingData.time || 'Linh hoạt',
        }
      );
    }

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_close')
        .setLabel('Đóng Ticket')
        .setEmoji('🔒')
        .setStyle(ButtonStyle.Danger)
    );

    await ticketChannel.send({
      content: `${staffPings} <@${user.id}>`.trim(),
      embeds: [insideEmbed],
      components: [closeRow],
    });

    if (CHANNELS.TICKET_LOG) {
      const logChannel = guild.channels.cache.get(CHANNELS.TICKET_LOG);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(ticketConfig.color)
          .setTitle('📑 Ticket Mới Được Tạo')
          .setDescription(
            `• **Người tạo:** <@${user.id}> (${user.tag})\n• **Loại:** ${ticketConfig.title}\n• **Kênh:** <#${ticketChannel.id}>`
          )
          .setTimestamp();

        if (bookingData) {
          logEmbed.addFields(
            { name: 'Dịch vụ', value: bookingData.service },
            {
              name: 'Nhóm đào',
              value: bookingData.performerType === 'prince' ? '王子・PRINCE' : '姫君・PRINCESS',
              inline: true,
            },
            { name: 'Ngân sách', value: bookingData.budget || 'Không ghi', inline: true },
            { name: 'Thời gian', value: bookingData.time || 'Linh hoạt' }
          );
        }

        await logChannel.send({ embeds: [logEmbed] }).catch(() => {});
      }
    }

    const successText =
      ticketConfig.name === 'booking'
        ? 'Đã tạo phòng đặt lịch'
        : ticketConfig.name === 'apply'
          ? 'Đã tạo phòng ứng tuyển'
          : 'Đã tạo phòng hỗ trợ';

    await interaction.editReply({
      content: `${successText} tại <#${ticketChannel.id}>.`,
    });
  } catch (error) {
    console.error('[Ticket] ❌ Lỗi khi tạo kênh ticket:', error);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: '❌ Đã có lỗi xảy ra khi tạo phòng. Vui lòng thử lại hoặc liên hệ Admin.',
      }).catch(() => {});
    }
  } finally {
    pendingCreations.delete(ticketKey);
  }
}

export async function handleTicketClose(interaction) {
  const channel = interaction.channel;
  const guild = interaction.guild;
  const user = interaction.user;
  const member = interaction.member;

  if (closingChannels.has(channel.id)) {
    return interaction.reply({
      content: '⏳ Kênh này đang trong tiến trình đóng, vui lòng đợi...',
      ephemeral: true,
    });
  }

  const ticketRecord = getTicketRecord(channel.id);
  const ownerId = ticketRecord?.ownerId || null;

  const isOwner = ownerId && user.id === ownerId;
  const staffRoles = [ROLES.HOKAGE, ROLES.ANBU, ROLES.GUARD].filter(Boolean);
  const isStaff = member?.roles?.cache?.some((role) => staffRoles.includes(role.id));
  const hasAdminPerm =
    member?.permissions?.has(PermissionsBitField.Flags.ManageChannels) ||
    member?.permissions?.has(PermissionsBitField.Flags.Administrator);

  if (!isOwner && !isStaff && !hasAdminPerm) {
    return interaction.reply({
      content: '❌ Bạn không có quyền đóng ticket này.',
      ephemeral: true,
    });
  }

  closingChannels.add(channel.id);

  await interaction.reply({
    content: '🔒 Kênh này sẽ được đóng và tự động xóa sau 5 giây...',
  });

  if (CHANNELS.TICKET_LOG) {
    const logChannel = guild.channels.cache.get(CHANNELS.TICKET_LOG);
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#ef5350')
        .setTitle('🔒 Ticket Đã Đóng')
        .setDescription(
          `• **Người đóng:** <@${user.id}> (${user.tag})\n• **Tên phòng:** \`#${channel.name}\`\n• **Chủ phòng:** ${ownerId ? `<@${ownerId}>` : 'Không xác định'}`
        )
        .setTimestamp();
      await logChannel.send({ embeds: [logEmbed] }).catch(() => {});
    }
  }

  setTimeout(async () => {
    try {
      deleteTicketRecord(channel.id);
      await channel.delete();
    } catch (error) {
      console.error('[Ticket Close] ❌ Không thể xóa kênh ticket:', error.message);
    } finally {
      closingChannels.delete(channel.id);
    }
  }, 5000);
}
