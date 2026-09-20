---
trigger: always_on
description: Quy chuẩn phát triển song song giữa môi trường Local và bản đồng bộ GitHub/ChatGPT
---

# Quy tắc phát triển: Dual-Environment (Local & GitHub)

Khi viết bất kỳ module hoặc tính năng nào cho dự án Konoha, luôn tuân thủ phân tách rõ ràng 2 mục tiêu:

## 1. Môi trường Local (Chạy thực tế & Test)
- Sử dụng trực tiếp tệp `.env` cục bộ (chứa token thật).
- Đi kèm các script kiểm thử, runner test độc lập (`npm test`, `npm run dev`) để kiểm tra logic ngay trên máy.
- Ghi log chi tiết và có cơ chế xử lý lỗi rõ ràng để kiểm tra tính ổn định.

## 2. Bản đồng bộ GitHub & ChatGPT (Dự án & Phối hợp)
- Tuyệt đối không để lộ dữ liệu nhạy cảm (token, credentials); mọi cấu hình phải thông qua `.env.example` và `config.json`.
- Mã nguồn viết rõ ràng, module hóa cao, có comment chuẩn tiếng Việt/Anh để ChatGPT dễ dàng đọc hiểu cấu trúc.
- Cập nhật định kỳ trạng thái, file mới và sơ đồ luồng vào `ai_exchange/antigravity_to_chatgpt.md` để người dùng có thể gửi ngay cho ChatGPT xem và tiếp tục phân tích/phát triển.
