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

## 2. Bản đồng bộ GitHub
- Tuyệt đối không để lộ dữ liệu nhạy cảm (token, credentials); mọi cấu hình phải thông qua `.env.example` và `config.json`.
- Mã nguồn rõ ràng, module hóa, tránh comment dài nếu code đã tự giải thích.

## 3. ChatGPT <-> Antigravity: KX1 Agent Bus
- Kênh chính: `agent_bus/`.
- Đọc `agent_bus/PROTO.md` một lần mỗi session.
- Trước mỗi handoff chỉ đọc `agent_bus/STATE.kx` + block mới nhất trong `agent_bus/C2A.kx`.
- Sau khi xử lý, ghi block ngắn mới nhất lên đầu `agent_bus/A2C.kx`.
- Chỉ cập nhật `STATE.kx` khi trạng thái bền vững của dự án thay đổi.
- Tuân thủ KX1: không chào hỏi, không lặp context, ưu tiên path/ID/commit/reference thay vì prose.
- Mục tiêu <=20 dòng cho mỗi message; chi tiết lớn phải nằm trong file code/docs và chỉ reference path.
- `ai_exchange/` là kênh legacy/human-readable; không cập nhật lặp lại nếu cùng dữ liệu đã có trong KX1.
