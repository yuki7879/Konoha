import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const dataDir = path.join(rootDir, 'data');
const runtimeFilePath = path.join(dataDir, 'runtime.json');

function emptyState() {
  return { panels: {}, tickets: {} };
}

function normalizeState(state = {}) {
  return {
    panels: state.panels || {},
    tickets: state.tickets || {},
  };
}

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function getRuntimeState() {
  ensureDataDir();

  if (!fs.existsSync(runtimeFilePath)) {
    return emptyState();
  }

  try {
    const raw = fs.readFileSync(runtimeFilePath, 'utf-8');
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    console.error('[RuntimeStore] Không thể đọc dữ liệu runtime:', error.message);
    return emptyState();
  }
}

export function saveRuntimeState(state) {
  ensureDataDir();

  try {
    fs.writeFileSync(
      runtimeFilePath,
      JSON.stringify(normalizeState(state), null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('[RuntimeStore] Không thể lưu dữ liệu runtime:', error.message);
  }
}

export function getPanelMessageId(panelKey) {
  const state = getRuntimeState();
  return state.panels?.[panelKey] || null;
}

export function setPanelMessageId(panelKey, messageId) {
  const state = getRuntimeState();
  state.panels[panelKey] = messageId;
  saveRuntimeState(state);
}

export function clearPanelMessageId(panelKey) {
  const state = getRuntimeState();

  if (state.panels?.[panelKey]) {
    delete state.panels[panelKey];
    saveRuntimeState(state);
  }
}

export function getTicketRecord(channelId) {
  const state = getRuntimeState();
  return state.tickets?.[channelId] || null;
}

export function getTicketRecords() {
  const state = getRuntimeState();
  return state.tickets || {};
}

export function setTicketRecord(channelId, record) {
  const state = getRuntimeState();
  state.tickets[channelId] = {
    ...record,
    channelId,
  };
  saveRuntimeState(state);
}

export function deleteTicketRecord(channelId) {
  const state = getRuntimeState();

  if (state.tickets?.[channelId]) {
    delete state.tickets[channelId];
    saveRuntimeState(state);
  }
}

export function findTicketRecord({ ownerId, type }) {
  const tickets = Object.values(getTicketRecords());

  return tickets.find(
    (ticket) => ticket.ownerId === ownerId && ticket.type === type
  ) || null;
}
