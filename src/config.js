import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env
dotenv.config({ path: path.join(rootDir, '.env') });

// Load server config mapping
const configPath = path.join(rootDir, 'config.json');
const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

export const config = rawConfig;

export const ENV = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID || rawConfig.guild?.id,
};

// ID Roles chính (không dùng fallback ngầm để đảm bảo cấu hình minh bạch)
export const ROLES = {
  HOKAGE: rawConfig.roles?.['火影・HOKAGE'],
  ANBU: rawConfig.roles?.['暗部・ANBU'],
  GUARD: rawConfig.roles?.['護衛・GUARD'],
  GUIDE: rawConfig.roles?.['案内役・GUIDE'],
  PRINCE: rawConfig.roles?.['王子・PRINCE'],
  PRINCESS: rawConfig.roles?.['姫君・PRINCESS'],
  CUSTOM: rawConfig.roles?.['CUSTOM'],
  BOT: rawConfig.roles?.['機械・BOT'],
  TRAP: rawConfig.roles?.['罠・TRAP'],
  BOOSTER: rawConfig.roles?.['桜援・BOOSTER'],
};

// ID Channels chính (đọc trực tiếp từ config.json, không dùng silent fallbacks)
export const CHANNELS = {
  MAIN_CHAT: rawConfig.channels?.['•°•────•°• 茶屋 LOUNGE • °────•°•']?.['雑談処・main-chat'],
  BOOKING: rawConfig.channels?.['•°•────•°• 支援 SUPPORT • °────•°•']?.['依頼・booking'],
  OPEN_ORDERS: rawConfig.channels?.['•°•────•°• 業務 OPERATIONS • °────•°•']?.['募集・open-orders'],
  MEMBER_LOG: rawConfig.channels?.['•°•────•°• 記録 LOGS • °────•°•']?.['入退・member-log'],
  TRAP: rawConfig.channels?.['•°•────•°• 木ノ葉 KONOHA • °────•°•']?.['罠・trap'],
  BOOST: process.env.BOOST_CHANNEL_ID || rawConfig.channels?.['•°•────•°• 茶屋 LOUNGE • °────•°•']?.['桜援・boost'],
  TICKET: rawConfig.channels?.['•°•────•°• 支援 SUPPORT • °────•°•']?.['相談・ticket'],
  TICKET_LOG: rawConfig.channels?.['•°•────•°• 記録 LOGS • °────•°•']?.['相談・ticket-log'],
  SUPPORT_CATEGORY: rawConfig.categories?.['•°•────•°• 支援 SUPPORT • °────•°•'],
};

/**
 * Kiểm tra tính hợp lệ của các biến môi trường và ID thiết yếu
 */
export function validateConfig() {
  const errors = [];
  if (!ENV.DISCORD_TOKEN) errors.push('Thiếu DISCORD_TOKEN trong file .env');
  if (!ENV.GUILD_ID) errors.push('Thiếu GUILD_ID (trong .env hoặc guild.id của config.json)');

  const requiredRoles = ['CUSTOM', 'BOT', 'ANBU', 'GUARD'];
  for (const roleKey of requiredRoles) {
    if (!ROLES[roleKey]) {
      errors.push(`Thiếu cấu hình Role: ROLES.${roleKey}`);
    }
  }

  const requiredChannels = ['MAIN_CHAT', 'TICKET', 'SUPPORT_CATEGORY'];
  for (const chKey of requiredChannels) {
    if (!CHANNELS[chKey]) {
      errors.push(`Thiếu cấu hình Channel/Category: CHANNELS.${chKey}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`[Cấu hình không hợp lệ]\n- ${errors.join('\n- ')}`);
  }
}
