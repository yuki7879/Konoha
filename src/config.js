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

// ID Roles chính
export const ROLES = {
  HOKAGE: rawConfig.roles['火影・HOKAGE'],
  ANBU: rawConfig.roles['暗部・ANBU'],
  GUARD: rawConfig.roles['護衛・GUARD'],
  GUIDE: rawConfig.roles['案内役・GUIDE'],
  PRINCE: rawConfig.roles['王子・PRINCE'],
  PRINCESS: rawConfig.roles['姫君・PRINCESS'],
  CUSTOM: rawConfig.roles['CUSTOM'],
  BOT: rawConfig.roles['機械・BOT'],
  TRAP: rawConfig.roles['罠・TRAP'],
  BOOSTER: rawConfig.roles['桜援・BOOSTER'] || '1506566737079042138',
};

// ID Channels chính
export const CHANNELS = {
  MAIN_CHAT: rawConfig.channels['•°•────•°• 茶屋 LOUNGE • °────•°•']?.['雑談処・main-chat'] || '1550524449617354856',
  BOOKING: rawConfig.channels['•°•────•°• 支援 SUPPORT • °────•°•']?.['依頼・booking'] || '1550524423331647591',
  OPEN_ORDERS: rawConfig.channels['•°•────•°• 業務 OPERATIONS • °────•°•']?.['募集・open-orders'] || '1550524466679906516',
  MEMBER_LOG: rawConfig.channels['•°•────•°• 記録 LOGS • °────•°•']?.['入退・member-log'] || '1550524473742987285',
  TRAP: rawConfig.channels['•°•────•°• 木ノ葉 KONOHA • °────•°•']?.['罠・trap'] || '1550524421045887156',
  BOOST: process.env.BOOST_CHANNEL_ID || rawConfig.channels['•°•────•°• 茶屋 LOUNGE • °────•°•']?.['桜援・boost'] || '1550859320349163691',
  TICKET: rawConfig.channels['•°•────•°• 支援 SUPPORT • °────•°•']?.['相談・ticket'] || '1550524428218146916',
  TICKET_LOG: rawConfig.channels['•°•────•°• 記録 LOGS • °────•°•']?.['相談・ticket-log'] || '1550524482383515759',
  SUPPORT_CATEGORY: rawConfig.categories?.['•°•────•°• 支援 SUPPORT • °────•°•'] || '1550524422140723260',
};
