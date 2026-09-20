# ୨୧ 木ノ葉・KONOHA ୨୧ - Discord Bot System 🍃

Hệ thống Bot Discord cho server **୨୧ 木ノ葉・KONOHA ୨୧** (Guild ID: `1506518090228170832`), được phát triển theo mô hình phối hợp kép giữa **ChatGPT** (Architect) và **Antigravity** (Local Coding Agent) qua giao thức siêu nén **KX1 Agent Bus**.

---

## 🛠️ Yêu Cầu Hệ Thống (Engines)
- **Node.js**: `>= 18.0.0`
- **discord.js**: `^14.17.3`
- **Hệ điều hành**: Windows / Linux / macOS

---

## 🚀 Hướng Dẫn Cài Đặt & Vận Hành (Runbook)

### 1. Chuẩn bị môi trường
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```
Cấu hình các biến môi trường thiết yếu:
- `DISCORD_TOKEN`: Token bot Discord (bảo mật tuyệt đối, không chia sẻ).
- `CLIENT_ID`: ID của ứng dụng Bot.
- `GUILD_ID`: ID máy chủ Discord Konoha (`1506518090228170832`).

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Kiểm tra tính toàn vẹn (Smoke Test)
Chạy script kiểm tra cấu hình, runtimeStore, các hàm dựng giao diện và event handlers mà không cần kết nối Gateway:
```bash
npm run test:smoke
```

### 4. Khởi chạy Bot
- **Chế độ phát triển (Auto reload)**:
  ```bash
  npm run dev
  ```
- **Chế độ vận hành (Production)**:
  ```bash
  npm start
  ```

---

## 🧪 Các Lệnh Kiểm Thử & Quản Trị (Scripts)

| Lệnh | Mục đích |
|---|---|
| `npm run test:smoke` | Chạy smoke test toàn bộ core modules và cấu hình |
| `npm run send:ticket` | Gửi mới hoặc cập nhật Container Ticket V2 trong `#相談・ticket` |
| `npm run test:welcome` | Gửi thử nghiệm tin nhắn chào mừng (Welcome Embed) vào `#雑談処・main-chat` |
| `npm run test:boost` | Gửi thử nghiệm tin nhắn cảm ơn Boost vào `#桜援・boost` |
| `npm run push` | Đẩy mã nguồn sạch lên GitHub qua helper script an toàn |

---

## 📐 Kiến Trúc Kỹ Thuật & Tính Năng Nổi Bật

### 1. Discord Components V2 Container
- Toàn bộ giao diện Ticket Panel sử dụng chuẩn **Discord Components V2** (`flags: 32768`).
- Nút bấm (`ActionRow` type 1 chứa các `Button` type 2) nằm **trực tiếp bên trong Container** (`type: 17`), không dùng text ngoài embed.

### 2. Cơ chế Tự Phục Hồi & Lưu Trữ Độc Lập
- ID tin nhắn của Ticket Panel được lưu độc lập tại `data/runtime.json` (được đưa vào `.gitignore` để tránh dirty git commits).
- `src/index.js` cấu hình `Partials: [Partials.Message, Partials.Channel]`. Khi panel bị xóa (kể cả sau khi bot khởi động lại), sự kiện `messageDelete` sẽ tự động phát hiện và sinh panel mới ngay lập tức.

### 3. Bảo Vệ Ticket Toàn Diện (P0 Security & Mutex)
- **Ticket Key Deterministic**: Cặp `userId + type` được mã hóa vào Channel Topic (`konoha:ticket | type:${type} | owner:${userId}`). Tên kênh chỉ đóng vai trò hiển thị trực quan (`booking-${username}`).
- **Concurrency Mutex**: Khóa in-memory ngăn chặn spam tạo nhiều ticket đồng thời khi bấm liên tiếp.
- **Code-level Authorization**: Kiểm tra quyền đóng ticket ngay trong mã nguồn. Chỉ chủ phòng hoặc ban quản trị (`HOKAGE`, `ANBU`, `GUARD` / `ManageChannels`) mới có thể đóng.

### 4. Nguyên Tắc Least Privilege & Deduplication
- **Bỏ `MessageContent` Intent**: Bot giao tiếp hoàn toàn qua Interactions và Events, không cần quyền đọc nội dung tin nhắn.
- **Boost Deduplication**: Bộ nhớ tạm 60s ngăn gửi thông báo trùng khi Discord cập nhật `premiumSince` và gán role booster đồng thời.
- **Chống Copy Drift**: Các script kiểm thử (`scripts/test-*.js`) tái sử dụng trực tiếp Embed builder của mã nguồn chính (`src/modules/*`).

---

## 🤖 Giao Thức Phối Hợp Agent Bus (KX1)
Dự án sử dụng chuẩn bus KX1 tại thư mục `agent_bus/`:
- `agent_bus/PROTO.md`: Đặc tả cú pháp trao đổi dữ liệu gọn nhẹ.
- `agent_bus/STATE.kx`: Trạng thái hệ thống được chia sẻ chung.
- `agent_bus/C2A.kx`: Nhiệm vụ và yêu cầu từ ChatGPT chuyển giao cho Antigravity.
- `agent_bus/A2C.kx`: Báo cáo kết quả và xác nhận hoàn thành từ Antigravity gửi ChatGPT.
