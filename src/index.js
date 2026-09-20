import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { ENV, validateConfig } from './config.js';
import readyEvent from './events/ready.js';
import guildMemberAddEvent from './events/guildMemberAdd.js';
import guildMemberUpdateEvent from './events/guildMemberUpdate.js';
import interactionCreateEvent from './events/interactionCreate.js';
import messageDeleteEvent from './events/messageDelete.js';

// ==========================================
// 1. GLOBAL PROCESS ERROR HOOKS
// ==========================================
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection] 🚨 Có lỗi Promise chưa được xử lý:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception] 🚨 Có ngoại lệ chưa được xử lý:', error);
});

// ==========================================
// 2. CẤU HÌNH & VALIDATION PREFLIGHT
// ==========================================
try {
  validateConfig();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

// ==========================================
// 3. KHỞI TẠO DISCORD CLIENT (LEAST PRIVILEGE + PARTIALS)
// ==========================================
// Không dùng MessageContent intent vì bot hoạt động dựa trên Interactions và Guild Events thuần túy.
// Partials.Message & Partials.Channel giúp bắt sự kiện messageDelete ngay cả với tin nhắn chưa lưu cache.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
  ],
});

// ==========================================
// 4. ĐĂNG KÝ CÁC EVENT HANDLERS
// ==========================================
client.once(readyEvent.name, (...args) => readyEvent.execute(...args));
client.on(guildMemberAddEvent.name, (...args) => guildMemberAddEvent.execute(...args));
client.on(guildMemberUpdateEvent.name, (...args) => guildMemberUpdateEvent.execute(...args));
client.on(interactionCreateEvent.name, (...args) => interactionCreateEvent.execute(...args));
client.on(messageDeleteEvent.name, (...args) => messageDeleteEvent.execute(...args));

// ==========================================
// 5. ĐĂNG NHẬP BOT
// ==========================================
console.log('[Khởi động] Đang kết nối Discord Gateway...');
client.login(ENV.DISCORD_TOKEN).catch((err) => {
  console.error('[Lỗi] Không thể đăng nhập bot:', err.message);
});
