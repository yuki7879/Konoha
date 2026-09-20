/**
 * Script chạy thử nghiệm tính năng Cảm ơn Boost trực tiếp trên server
 * Dùng để kiểm tra giao diện Embed cảm ơn Boost (chuẩn V2 không có text thừa bên ngoài).
 * Chạy lệnh: npm run test:boost
 */

import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { ENV, ROLES, config } from '../src/config.js';
import { resolveBoostChannel } from '../src/modules/boost/boostHandler.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', async () => {
  console.log(`[Test Boost] Đã đăng nhập với tài khoản Bot: ${client.user.tag}`);

  try {
    const guild = client.guilds.cache.get(ENV.GUILD_ID);
    if (!guild) {
      console.error(`[Test Boost] ❌ Không tìm thấy server ID: ${ENV.GUILD_ID}`);
      process.exit(1);
    }

    const boostChannel = resolveBoostChannel(guild);
    if (!boostChannel) {
      console.error('[Test Boost] ❌ Không tìm thấy kênh để gửi thông báo Boost!');
      process.exit(1);
    }

    console.log(`[Test Boost] Đang gửi tin nhắn cảm ơn Boost thử nghiệm vào #${boostChannel.name}...`);

    const guildName = config.guild?.name || guild.name;
    const guideMention = ROLES.GUIDE ? `<@&${ROLES.GUIDE}>` : '@案内役・GUIDE';
    const guardMention = ROLES.GUARD ? `<@&${ROLES.GUARD}>` : '@護衛・GUARD';
    const testUserMention = `<@${client.user.id}>`; // Dùng bot làm ví dụ test

    // Nội dung văn bản chuẩn xác theo ảnh
    const boostDescription = [
      `${guideMention} ${guardMention} đâu ra cảm ơn ${testUserMention} đã Boost cho **${guildName}** đi nào.`,
      '',
      'Một chiếc Boost nhỏ, nhưng là một sự ủng hộ thật lớn dành cho Konoha.',
      'Cảm ơn bạn vì đã góp phần giúp ngôi làng ngày càng đẹp và phát triển hơn.',
      '',
      '「 Konoha trân trọng sự đồng hành của bạn. 」',
    ].join('\n');

    const thumbnailURL = guild.iconURL({ dynamic: true, size: 512 }) || client.user.displayAvatarURL();

    // Chuẩn giao diện V2: Chỉ dùng duy nhất Embed màu hồng tím Nitro
    const boostEmbed = new EmbedBuilder()
      .setColor('#f47fff')
      .setDescription(boostDescription)
      .setThumbnail(thumbnailURL);

    await boostChannel.send({
      embeds: [boostEmbed],
    });

    console.log(`[Test Boost] ✅ ĐÃ GỬI THÀNH CÔNG vào kênh #${boostChannel.name}! Bạn hãy mở Discord kiểm tra.`);
  } catch (err) {
    console.error('[Test Boost] ❌ Lỗi khi gửi tin nhắn test boost:', err);
  } finally {
    setTimeout(() => {
      client.destroy();
      process.exit(0);
    }, 2000);
  }
});

client.login(ENV.DISCORD_TOKEN);
