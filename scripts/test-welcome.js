/**
 * Script chạy thử nghiệm tính năng Welcome trực tiếp trên server
 * Tái sử dụng trực tiếp hàm createWelcomeEmbed từ src/modules/welcome/welcomeHandler.js
 * Chạy lệnh: npm run test:welcome
 */

import { Client, GatewayIntentBits } from 'discord.js';
import { ENV, CHANNELS } from '../src/config.js';
import { createWelcomeEmbed } from '../src/modules/welcome/welcomeHandler.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`[Test] Đã đăng nhập với tài khoản Bot: ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(ENV.GUILD_ID).catch(() => null);
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

    // Tái sử dụng trực tiếp Embed builder của production
    const welcomeEmbed = createWelcomeEmbed(guild, client.user);

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
    }, 1500);
  }
});

client.login(ENV.DISCORD_TOKEN);
