# 🔄 Shared Context & Work Log (Konoha)

Bản ghi nhật ký chung để cả hai AI (Antigravity & ChatGPT) nắm được tiến trình dự án, tránh bị quên ngữ cảnh.

---

## 🎯 Mục tiêu dự án Konoha
- *Tên dự án:* ୨୧ 木ノ葉・KONOHA ୨୧ (Discord Booking Bot)
- *Guild ID:* `1506518090228170832`
- *Tech stack chính:* Node.js (discord.js v14), `config.json`, KX1 Agent Bus (`agent_bus/`)
- *Nguyên tắc cốt lõi:* **Dual-Workflow** & **KX1 Protocol**
  1. **Bản Local:** Chạy trực tiếp với token thật trong `.env`, có các script test và debug tại máy.
  2. **Bản GitHub:** Code sạch, bảo mật, đồng bộ qua KX1 Agent Bus (`agent_bus/`) để ChatGPT và Antigravity phối hợp.

---

## 📋 Task Checklist

- [x] Khởi tạo Git repository và cấu hình remote GitHub `yuki7879/Konoha`
- [x] Tạo cấu trúc thư mục trao đổi AI (`ai_exchange/`) và giao thức KX1 (`agent_bus/`)
- [x] Nạp cấu trúc ID đầy đủ vào `config.json` (Roles, Categories, Channels)
- [x] Thiết lập `.env` (Local bí mật) và `.env.example` (GitHub an toàn)
- [x] Thiết lập bộ quy tắc [dual-workflow.md](../.agents/rules/dual-workflow.md)
- [x] Viết module Auto-Role & Welcome Embed (`src/modules/welcome/welcomeHandler.js`)
- [x] Viết module Server Boost Thank-You (`src/modules/boost/boostHandler.js`)
- [x] Triển khai Discord Components V2 Container Ticket Panel (`src/modules/ticket/ticketPanel.js`)
- [x] Triển khai cơ chế Self-Healing khôi phục panel tự động (`ticketRecovery.js`, `messageDelete.js`)
- [x] **Hoàn thành Block C002 (Core Stabilization):**
  - [x] P0: Ticket-key `userId + type` lưu trong topic; Concurrency Mutex lock; Phân quyền đóng ticket trong code.
  - [x] P1: Partials Message/Channel khôi phục panel; Bỏ MessageContent intent; Tách runtime state ra `data/runtime.json`; `validateConfig()`; Process error hooks & permission preflight.
  - [x] P2: Deduplication thông báo Boost (60s); Tái sử dụng Embed builders cho scripts test không drift; Node engines >= 18; `npm run test:smoke`; Runbook trong `README.md`.
  - [x] Sync bus: Cập nhật `agent_bus/C2A.kx` (Done), `A2C.kx` (Report A002), `STATE.kx`.
- [ ] **Giai đoạn tiếp theo:** Booking State Machine (`booking-flow > open-orders > atomic-claim > shift`)
