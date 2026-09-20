/**
 * Script chạy thử nghiệm tính năng Welcome trực tiếp trên server
 * Dùng để kiểm tra giao diện Embed trong kênh main-chat mà không cần chờ người mới tham gia.
 * Chạy lệnh: npm run test:welcome
 */

import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { ENV, CHANNELS, ROLES, config } from '../src/config.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', async () => {
  console.log(`[Test] Đã đăng nhập với tài khoản Bot: ${client.user.tag}`);

  try {
    const guild = client.guilds.cache.get(ENV.GUILD_ID);
    if (!guild) {
      console.error(`[Test] ❌ Không tìm thấy server ID: ${ENV.GUILD_ID}`);
      process.exit(1);
    }

    const channel = guild.channels.cache.get(CHANNELS.MAIN_CHAT);
    if (!channel) {
      console.error(`[Test] ❌ Không tìm thấy kênh chat chung ID: ${CHANNELS.MAIN_CHAT}`);
      process.exit(1);
    }

    console.log(`[Test] Đang gửi tin nhắn chào mừng thử nghiệm vào #${channel.name}...`);

    const guildName = config.guild?.name || guild.name;
    const guideMention = ROLES.GUIDE ? `<@&${ROLES.GUIDE}>` : '@案内役・GUIDE';
    const testUserMention = `<@${client.user.id}>`; // Dùng bot làm ví dụ test

    const welcomeDescription = [
      `Hây yooooo chào mừng ${testUserMention} đến với **${guildName}**.`,
      '',
      'Một hành trình mới vừa bắt đầu tại Konoha.',
      'Mong bạn sẽ tìm thấy những cuộc trò chuyện thú vị, những người bạn mới và thật nhiều khoảnh khắc đáng nhớ.',
      '',
      `${guideMention} ơi, ra chào đón khách quý nhé! Nếu cần hỗ trợ, đội ngũ Konoha luôn sẵn sàng.`,
      '',
      '「 Chúc bạn có một trải nghiệm thật đẹp tại Konoha. 」',
    ].join('\n');

    const thumbnailURL = guild.iconURL({ dynamic: true, size: 512 }) || client.user.displayAvatarURL();

    const welcomeEmbed = new EmbedBuilder()
      .setColor('#f48fb1')
      .setDescription(welcomeDescription)
      .setThumbnail(thumbnailURL);

    await channel.send({
      embeds: [welcomeEmbed],
    });

    console.log(`[Test] ✅ ĐÃ GỬI THÀNH CÔNG vào kênh #${channel.name}! Bạn có thể vào Discord xem kết quả.`);
  } catch (err) {
    console.error('[Test] ❌ Lỗi khi gửi tin nhắn test:', err);
  } finally {
    setTimeout(() => {
      client.destroy();
      process.exit(0);
    }, 2000);
  }
});

client.login(ENV.DISCORD_TOKEN);
