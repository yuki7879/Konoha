import { Events, ActivityType, PermissionFlagsBits } from 'discord.js';
import { CHANNELS, ROLES, ENV, config } from '../config.js';
import { ensureTicketPanel } from '../modules/ticket/ticketRecovery.js';

export default {
  name: Events.ClientReady,
  once: true,
  /**
   * @param {import('discord.js').Client} client
   */
  async execute(client) {
    console.log('==================================================');
    console.log(`🍃 Konoha Bot đã online thành công: ${client.user.tag}`);
    console.log(`🆔 Bot ID: ${client.user.id}`);
    console.log('==================================================');

    client.user.setPresence({
      activities: [
        {
          name: config.guild?.name || '୨୧ 木ノ葉・KONOHA ୨୧',
          type: ActivityType.Watching,
        },
      ],
      status: 'online',
    });

    // ==========================================
    // 1. KIỂM TRA SERVER THEO ENV.GUILD_ID
    // ==========================================
    const guildId = ENV.GUILD_ID;
    const guild = await client.guilds.fetch(guildId).catch(() => null);
    if (!guild) {
      console.error(`[Preflight] ❌ Bot chưa tham gia hoặc không tìm thấy Guild ID: ${guildId}`);
      return;
    }

    console.log(`[Preflight] 🏰 Kết nối thành công tới Guild: "${guild.name}" (${guild.id})`);

    // ==========================================
    // 2. PERMISSION PREFLIGHT CHECK
    // ==========================================
    const me = await guild.members.fetchMe().catch(() => null);
    if (me) {
      const requiredPermissions = [
        { name: 'ViewChannel', flag: PermissionFlagsBits.ViewChannel },
        { name: 'SendMessages', flag: PermissionFlagsBits.SendMessages },
        { name: 'EmbedLinks', flag: PermissionFlagsBits.EmbedLinks },
        { name: 'ManageChannels', flag: PermissionFlagsBits.ManageChannels },
        { name: 'ManageRoles', flag: PermissionFlagsBits.ManageRoles },
        { name: 'ReadMessageHistory', flag: PermissionFlagsBits.ReadMessageHistory },
      ];

      console.log('[Preflight] 🛡️ Kiểm tra quyền hạn Bot trên server:');
      const missingPermissions = [];
      for (const perm of requiredPermissions) {
        const has = me.permissions.has(perm.flag);
        console.log(`  - ${perm.name.padEnd(20)}: ${has ? '✅ HỢP LỆ' : '❌ THIẾU'}`);
        if (!has) missingPermissions.push(perm.name);
      }

      if (missingPermissions.length > 0) {
        console.warn(`[Preflight] ⚠️ CẢNH BÁO: Bot đang thiếu các quyền sau: ${missingPermissions.join(', ')}`);
      }
    }

    // ==========================================
    // 3. XÁC MINH CÁC KÊNH & CATEGORY CHÍNH
    // ==========================================
    console.log('[Preflight] 📁 Xác minh các kênh & danh mục cần thiết:');
    const checkedChannels = [
      { key: 'MAIN_CHAT', id: CHANNELS.MAIN_CHAT, label: 'Chat chung' },
      { key: 'TICKET', id: CHANNELS.TICKET, label: 'Kênh Ticket Panel' },
      { key: 'SUPPORT_CATEGORY', id: CHANNELS.SUPPORT_CATEGORY, label: 'Danh mục Support' },
      { key: 'TICKET_LOG', id: CHANNELS.TICKET_LOG, label: 'Log Ticket' },
      { key: 'BOOST', id: CHANNELS.BOOST, label: 'Kênh thông báo Boost' },
    ];

    for (const item of checkedChannels) {
      if (!item.id) {
        console.warn(`  - [${item.key}] ⚠️ Chưa cấu hình ID`);
        continue;
      }
      const ch = guild.channels.cache.get(item.id);
      console.log(`  - [${item.key}] (${item.label}): ${ch ? `✅ #${ch.name}` : `⚠️ Không tìm thấy kênh ID ${item.id}`}`);
    }

    // ==========================================
    // 4. XÁC MINH CÁC ROLE QUAN TRỌNG
    // ==========================================
    console.log('[Preflight] 🎭 Xác minh các Role hệ thống:');
    const checkedRoles = [
      { key: 'CUSTOM', id: ROLES.CUSTOM, label: 'Role thành viên mới' },
      { key: 'BOT', id: ROLES.BOT, label: 'Role Bot' },
      { key: 'BOOSTER', id: ROLES.BOOSTER, label: 'Role Nitro Booster' },
      { key: 'HOKAGE', id: ROLES.HOKAGE, label: 'Role Hokage' },
      { key: 'ANBU', id: ROLES.ANBU, label: 'Role Anbu' },
      { key: 'GUARD', id: ROLES.GUARD, label: 'Role Guard' },
    ];

    for (const item of checkedRoles) {
      if (!item.id) {
        console.warn(`  - [${item.key}] ⚠️ Chưa cấu hình ID`);
        continue;
      }
      const r = guild.roles.cache.get(item.id);
      console.log(`  - [${item.key}] (${item.label}): ${r ? `✅ @${r.name}` : `⚠️ Không tìm thấy Role ID ${item.id}`}`);
    }

    // ==========================================
    // 5. TỰ ĐỘNG KHÔI PHỤC PANEL TICKET V2 NẾU CẦN
    // ==========================================
    console.log('[Preflight] 🎫 Kiểm tra trạng thái Ticket Panel V2...');
    await ensureTicketPanel(guild);
    console.log('==================================================');
    console.log('🍃 Konoha Bot đã sẵn sàng hoạt động 100%!');
    console.log('==================================================');
  },
};
