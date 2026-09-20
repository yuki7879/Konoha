/**
 * Smoke Test kiểm tra tính toàn vẹn hệ thống lõi:
 * 1. Validate cấu hình & môi trường
 * 2. Kiểm tra module runtimeStore (CRUD)
 * 3. Kiểm tra các hàm dựng giao diện (Ticket Panel V2, Welcome Embed, Boost Embed)
 * 4. Kiểm tra import của tất cả các Event Handlers
 * Chạy lệnh: npm run test:smoke
 */

import assert from 'node:assert';
import { ENV, ROLES, CHANNELS, config, validateConfig } from '../src/config.js';
import { getPanelMessageId, setPanelMessageId, getRuntimeState } from '../src/utils/runtimeStore.js';
import { createTicketPanelV2 } from '../src/modules/ticket/ticketPanel.js';
import { createWelcomeEmbed } from '../src/modules/welcome/welcomeHandler.js';
import { createBoostEmbed } from '../src/modules/boost/boostHandler.js';
import readyEvent from '../src/events/ready.js';
import guildMemberAddEvent from '../src/events/guildMemberAdd.js';
import guildMemberUpdateEvent from '../src/events/guildMemberUpdate.js';
import interactionCreateEvent from '../src/events/interactionCreate.js';
import messageDeleteEvent from '../src/events/messageDelete.js';

console.log('--- BẮT ĐẦU SMOKE TEST KONOHA BOT ---');

// Test 1: Config Validation
console.log('[Test 1] Kiểm tra tính hợp lệ của cấu hình...');
try {
  validateConfig();
  console.log('  ✅ validateConfig() hoàn tất không có lỗi.');
} catch (err) {
  console.error('  ❌ Cấu hình không hợp lệ:', err.message);
  process.exit(1);
}

// Test 2: RuntimeStore
console.log('[Test 2] Kiểm tra RuntimeStore...');
const currentPanelId = getPanelMessageId('ticket');
console.log(`  ℹ️ Ticket panel ID hiện tại: ${currentPanelId}`);
assert(currentPanelId !== undefined, 'Ticket panel ID không được undefined');

const testKey = 'test_smoke_panel';
setPanelMessageId(testKey, '999999999999999999');
assert.strictEqual(getPanelMessageId(testKey), '999999999999999999', 'RuntimeStore set/get phải khớp giá trị');

// Dọn dẹp key test
const state = getRuntimeState();
delete state.panels[testKey];
import('node:fs').then((fs) => {
  fs.writeFileSync('data/runtime.json', JSON.stringify(state, null, 2), 'utf-8');
});
console.log('  ✅ RuntimeStore hoạt động chính xác (CRUD thành công).');

// Test 3: Components & Embed Builders
console.log('[Test 3] Kiểm tra các hàm dựng Components & Embeds...');
const mockGuild = {
  name: '୨୧ 木ノ葉・KONOHA ୨୧',
  iconURL: () => 'https://cdn.discordapp.com/icons/example.png',
};
const mockUser = {
  id: '123456789012345678',
  tag: 'KonohaTester#0001',
  displayAvatarURL: () => 'https://cdn.discordapp.com/avatars/example.png',
};

const ticketPanel = createTicketPanelV2(mockGuild);
assert.strictEqual(ticketPanel.flags, 32768, 'Flags phải là IS_COMPONENTS_V2 (32768)');
assert.strictEqual(ticketPanel.components[0].type, 17, 'Component ngoài cùng phải là Container (type 17)');
assert.strictEqual(ticketPanel.components[0].components.length, 3, 'Container phải chứa 3 phần tử: Text, Separator, ActionRow');
console.log('  ✅ createTicketPanelV2() hợp lệ chuẩn Discord Components V2.');

const welcomeEmbed = createWelcomeEmbed(mockGuild, mockUser);
assert(welcomeEmbed.data.description.includes(mockUser.id), 'Welcome Embed phải chứa mention user ID');
console.log('  ✅ createWelcomeEmbed() hợp lệ.');

const boostEmbed = createBoostEmbed(mockGuild, mockUser);
assert(boostEmbed.data.description.includes(mockUser.id), 'Boost Embed phải chứa mention user ID');
console.log('  ✅ createBoostEmbed() hợp lệ.');

// Test 4: Event Handlers Integrity
console.log('[Test 4] Kiểm tra các Event Handlers...');
assert(readyEvent.name && typeof readyEvent.execute === 'function', 'readyEvent phải có name và execute');
assert(guildMemberAddEvent.name && typeof guildMemberAddEvent.execute === 'function', 'guildMemberAddEvent phải có name và execute');
assert(guildMemberUpdateEvent.name && typeof guildMemberUpdateEvent.execute === 'function', 'guildMemberUpdateEvent phải có name và execute');
assert(interactionCreateEvent.name && typeof interactionCreateEvent.execute === 'function', 'interactionCreateEvent phải có name và execute');
assert(messageDeleteEvent.name && typeof messageDeleteEvent.execute === 'function', 'messageDeleteEvent phải có name và execute');
console.log('  ✅ Tất cả 5 Event Handlers đều hợp lệ.');

console.log('-------------------------------------------');
console.log('🎉 TẤT CẢ CÁC BƯỚC SMOKE TEST ĐÃ ĐẠT 100%! 🎉');
