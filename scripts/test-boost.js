/**
 * Script chạy thử nghiệm tính năng Cảm ơn Boost trực tiếp trên server
 * Tái sử dụng trực tiếp createBoostEmbed và resolveBoostChannel từ src/modules/boost/boostHandler.js
 * Chạy lệnh: npm run test:boost
 */

import { Client, GatewayIntentBits } from 'discord.js';
import { ENV } from '../src/config.js';
import { createBoostEmbed, resolveBoostChannel } from '../src/modules/boost/boostHandler.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`[Test Boost] Đã đăng nhập với tài khoản Bot: ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(ENV.GUILD_ID).catch(() => null);
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

    // Tái sử dụng trực tiếp Embed builder của production
    const boostEmbed = createBoostEmbed(guild, client.user);

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
    }, 1500);
  }
});

client.login(ENV.DISCORD_TOKEN);
