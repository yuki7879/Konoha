import { Client, GatewayIntentBits } from 'discord.js';
import { ENV } from './config.js';
import readyEvent from './events/ready.js';
import guildMemberAddEvent from './events/guildMemberAdd.js';
import guildMemberUpdateEvent from './events/guildMemberUpdate.js';
import interactionCreateEvent from './events/interactionCreate.js';
import messageDeleteEvent from './events/messageDelete.js';

if (!ENV.DISCORD_TOKEN) {
  console.error('[Lỗi] Không tìm thấy DISCORD_TOKEN trong file .env! Vui lòng kiểm tra lại cấu hình.');
  process.exit(1);
}

// Khởi tạo Discord Client với các quyền Gateway Intents cần thiết
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // BẮT BUỘC: Để lắng nghe sự kiện thành viên mới và cập nhật role/boost
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Đăng ký các sự kiện (Event Handlers)
client.once(readyEvent.name, (...args) => readyEvent.execute(...args));
client.on(guildMemberAddEvent.name, (...args) => guildMemberAddEvent.execute(...args));
client.on(guildMemberUpdateEvent.name, (...args) => guildMemberUpdateEvent.execute(...args));
client.on(interactionCreateEvent.name, (...args) => interactionCreateEvent.execute(...args));
client.on(messageDeleteEvent.name, (...args) => messageDeleteEvent.execute(...args));

// Đăng nhập Bot
console.log('[Khởi động] Đang kết nối Discord Gateway...');
client.login(ENV.DISCORD_TOKEN).catch((err) => {
  console.error('[Lỗi] Không thể đăng nhập bot:', err.message);
});
