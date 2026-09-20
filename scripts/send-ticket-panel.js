/**
 * Script gửi hoặc cập nhật Container Ticket V2 trong kênh 相談・ticket (1550524428218146916)
 * Chạy lệnh: npm run send:ticket
 */

import { Client, GatewayIntentBits } from 'discord.js';
import { ENV } from '../src/config.js';
import { ensureTicketPanel } from '../src/modules/ticket/ticketRecovery.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`[Ticket Setup] Đã kết nối bot: ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(ENV.GUILD_ID).catch(() => null);
    if (!guild) {
      console.error(`[Ticket Setup] ❌ Không tìm thấy server ID: ${ENV.GUILD_ID}`);
      await client.destroy();
      process.exit(1);
    }

    await ensureTicketPanel(guild);
    console.log('[Ticket Setup] ✅ Đã hoàn tất xử lý Container V2!');
  } catch (error) {
    console.error('[Ticket Setup] ❌ Lỗi:', error);
  } finally {
    await client.destroy();
    process.exit(0);
  }
});

client.login(ENV.DISCORD_TOKEN);
