# 📤 Antigravity ➔ ChatGPT

> **Báo cáo tiến độ cập nhật cho ChatGPT:** Bạn có thể copy toàn bộ nội dung file này gửi sang ChatGPT để ChatGPT nắm bắt hiện trạng và cùng bạn phát triển tiếp.

---

## 📌 Báo cáo hiện trạng dự án Konoha Booking
- **Repository:** https://github.com/yuki7879/Konoha
- **Mục tiêu:** Xây dựng Discord Bot cho server `୨୧ 木ノ葉・KONOHA ୨୧` (Guild ID: `1506518090228170832`)
- **Ngôn ngữ & Framework:** Node.js (ES Module), `discord.js` v14, Node `>= 18.0.0`.
- **Giao thức phối hợp:** KX1 (`agent_bus/`)

---

### 1. Cấu trúc thư mục hiện tại:
```text
Konoha/
├── .env                              # Token & Client ID thật (chỉ lưu local, không commit)
├── .env.example                      # Mẫu biến môi trường đẩy lên GitHub
├── .gitignore                        # Đã bảo vệ .env, data/, node_modules
├── config.json                       # Bảng ánh xạ tĩnh ID Roles, Categories, Channels
├── package.json                      # Cấu hình dự án & scripts (engines >= 18)
├── agent_bus/
│   ├── PROTO.md                      # Đặc tả giao thức KX1
│   ├── STATE.kx                      # Trạng thái chia sẻ chung
│   ├── C2A.kx                        # ChatGPT -> Antigravity (C002: Done)
│   └── A2C.kx                        # Antigravity -> ChatGPT (A002: Report Done)
├── data/
│   └── runtime.json                  # Lưu trữ động panel IDs (gitignored)
├── scripts/
│   ├── test-welcome.js               # Chạy thử tin nhắn chào mừng (tái sử dụng prod builder)
│   ├── test-boost.js                 # Chạy thử tin nhắn cảm ơn Boost (tái sử dụng prod builder)
│   ├── test-smoke.js                 # Smoke test toàn bộ modules & config không cần Gateway
│   ├── send-ticket-panel.js          # Gửi/Edit Container V2 vào kênh #相談・ticket
│   └── git-push.js                   # Script đẩy code an toàn lên GitHub
├── src/
│   ├── index.js                      # Điểm khởi chạy Bot, Partials, Error Hooks, bỏ MessageContent
│   ├── config.js                     # Cấu hình nghiêm ngặt, validateConfig() không silent fallbacks
│   ├── events/
│   │   ├── ready.js                  # Online event, Permission Preflight & Channel/Role check
│   │   ├── guildMemberAdd.js         # Lắng nghe thành viên mới tham gia (Auto-role + Welcome)
│   │   ├── guildMemberUpdate.js      # Lắng nghe Boost server
│   │   ├── interactionCreate.js      # Bắt Button Interactions (Ticket Create/Close)
│   │   └── messageDelete.js          # Bắt xóa panel với Partials.Message để tự phục hồi
│   ├── utils/
│   │   └── runtimeStore.js           # Quản lý CRUD runtime.json tách biệt khỏi config.json
│   └── modules/
│       ├── welcome/
│       │   └── welcomeHandler.js     # Cấp role (CUSTOM / BOT) & createWelcomeEmbed tái sử dụng
│       ├── boost/
│       │   └── boostHandler.js       # Deduplication cache (60s) & createBoostEmbed tái sử dụng
│       └── ticket/
│           ├── ticketHandler.js      # Mutex lock, ticket-key userId+type trong topic, auth close
│           ├── ticketPanel.js        # Giao diện Container V2 (type 17 chứa 3 buttons trên 1 row)
│           └── ticketRecovery.js     # Đọc/ghi panel ID qua runtimeStore, tự edit/phục hồi
└── ai_exchange/
    ├── README.md
    ├── antigravity_to_chatgpt.md     # (File này)
    ├── chatgpt_to_antigravity.md     # Nhận chỉ dẫn từ ChatGPT
    └── context_sync.md               # Nhật ký tiến độ chung
```

---

### 2. Chi tiết hoàn thành Block C002 (Core Stabilization):
1. **P0: Ticket Key & Concurrency & Authorization**:
   - `ticket-key`: Cặp `userId + type` được mã hóa vào Channel Topic (`konoha:ticket | type:${type} | owner:${userId}`). Tên phòng chỉ mang tính hiển thị trực quan.
   - `concurrency mutex`: Khóa `Set` in-memory ngăn người dùng tạo ticket trùng lặp khi click đúp liên tục.
   - `authorize-close-in-code`: Chỉ cho phép đóng ticket nếu là chủ phòng (`ownerId === interaction.user.id`) hoặc ban quản trị (`HOKAGE`, `ANBU`, `GUARD`, hoặc có quyền `ManageChannels`/`Administrator`).
2. **P1: Phục hồi đáng tin cậy & Least Privilege**:
   - Bổ sung `Partials: [Partials.Message, Partials.Channel]` giúp `messageDelete` bắt được cả tin nhắn chưa cache sau restart bot.
   - Loại bỏ Intent `MessageContent` (chỉ giữ `Guilds`, `GuildMembers`, `GuildMessages`).
   - Tách trạng thái động của panel ID ra khỏi `config.json` sang `data/runtime.json` (được đưa vào `.gitignore`).
   - Xóa bỏ silent fallbacks trong `config.js`, bổ sung `validateConfig()` báo lỗi rõ ràng.
   - Thêm process error hooks (`unhandledRejection`, `uncaughtException`) và permission preflight check trong `ready.js`.
3. **P2: Deduplication & Chống Drift**:
   - Bổ sung Deduplication cache (TTL 60s) cho thông báo Nitro Boost.
   - Xuất khẩu `createWelcomeEmbed` và `createBoostEmbed` từ `src/modules/` để các script test tái sử dụng trực tiếp, xóa bỏ copy-drift.
   - Khai báo `"engines": { "node": ">=18" }`, tạo `scripts/test-smoke.js`, hoàn thiện Runbook trong `README.md`.
4. **KX1 Agent Bus**:
   - Đã đánh dấu task `@C002` thành `D` trong `agent_bus/C2A.kx`.
   - Đã xuất bản báo cáo `@A002|A>C|R|D` trong `agent_bus/A2C.kx`.
   - Đã cập nhật `agent_bus/STATE.kx`.

---

### 3. Sẵn sàng cho giai đoạn tiếp theo (Next Step):
Hệ thống lõi đã đạt độ ổn định và an toàn 100%. Sẵn sàng chuyển giao sang xây dựng **Booking State Machine** (`booking-state-machine > open-orders > atomic-claim > shift`).
