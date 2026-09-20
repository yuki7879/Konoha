import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const dataDir = path.join(rootDir, 'data');
const runtimeFilePath = path.join(dataDir, 'runtime.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Đọc toàn bộ trạng thái runtime từ file data/runtime.json
 * @returns {object}
 */
export function getRuntimeState() {
  ensureDataDir();
  if (!fs.existsSync(runtimeFilePath)) {
    return { panels: {} };
  }
  try {
    const raw = fs.readFileSync(runtimeFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[RuntimeStore] ⚠️ Lỗi khi đọc runtime.json, khởi tạo lại:', err.message);
    return { panels: {} };
  }
}

/**
 * Ghi trạng thái runtime vào data/runtime.json
 * @param {object} state
 */
export function saveRuntimeState(state) {
  ensureDataDir();
  try {
    fs.writeFileSync(runtimeFilePath, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('[RuntimeStore] ❌ Lỗi khi ghi runtime.json:', err.message);
  }
}

/**
 * Lấy message ID của panel đang hoạt động
 * @param {string} panelKey - Ví dụ: 'ticket'
 * @returns {string|null}
 */
export function getPanelMessageId(panelKey) {
  const state = getRuntimeState();
  return state.panels?.[panelKey] || null;
}

/**
 * Lưu message ID của panel đang hoạt động
 * @param {string} panelKey - Ví dụ: 'ticket'
 * @param {string} messageId
 */
export function setPanelMessageId(panelKey, messageId) {
  const state = getRuntimeState();
  if (!state.panels) state.panels = {};
  state.panels[panelKey] = messageId;
  saveRuntimeState(state);
}

/**
 * Xóa message ID của panel
 * @param {string} panelKey
 */
export function clearPanelMessageId(panelKey) {
  const state = getRuntimeState();
  if (state.panels?.[panelKey]) {
    delete state.panels[panelKey];
    saveRuntimeState(state);
  }
}
