# 🔄 Shared Context & Work Log (Konoha)

Bản ghi nhật ký chung để cả hai AI (Antigravity & ChatGPT) nắm được tiến trình dự án, tránh bị quên ngữ cảnh.

---

## 🎯 Mục tiêu dự án Konoha
- *Tên dự án:* ୨୧ 木ノ葉・KONOHA ୨୧ (Discord Booking Bot)
- *Guild ID:* `1506518090228170832`
- *Tech stack chính:* Node.js (discord.js v14), SQLite / better-sqlite3, `config.json`
- *Nguyên tắc cốt lõi:* **Dual-Workflow**
  1. **Bản Local:** Chạy trực tiếp với token thật trong `.env`, có các script test và debug tại máy.
  2. **Bản GitHub:** Code sạch, bảo mật, đầy đủ tài liệu và context để ChatGPT đọc, review và cùng phát triển.

---

## 📋 Task Checklist

- [x] Khởi tạo Git repository và cấu hình remote GitHub `yuki7879/Konoha`
- [x] Tạo cấu trúc thư mục trao đổi AI (`ai_exchange/`)
- [x] Nạp cấu trúc ID đầy đủ vào `config.json` (Roles, Categories, Channels)
- [x] Thiết lập `.env` (Local bí mật) và `.env.example` (GitHub an toàn)
- [x] Thiết lập bộ quy tắc [dual-workflow.md](../.agents/rules/dual-workflow.md)
- [ ] Bắt đầu viết cấu trúc khung Node.js (khi người dùng yêu cầu)
