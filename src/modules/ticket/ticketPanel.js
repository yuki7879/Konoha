import { ROLES, config } from '../../config.js';

/**
 * Tạo giao diện Ticket chuẩn Discord Components V2:
 * Nút bấm (ActionRow) nằm TRỰC TIẾP BÊN TRONG Container (type: 17)
 * cùng với TextDisplay (type: 10) và Separator (type: 14).
 * Sử dụng flag IS_COMPONENTS_V2 (32768).
 */
export function createTicketPanelV2(guild) {
  const guildName = config.guild?.name || guild?.name || '୨୧ 木ノ葉・KONOHA ୨୧';
  const princessMention = ROLES.PRINCESS ? `<@&${ROLES.PRINCESS}>` : '@姫君・PRINCESS';
  const princeMention = ROLES.PRINCE ? `<@&${ROLES.PRINCE}>` : '@王子・PRINCE';
  const anbuMention = ROLES.ANBU ? `<@&${ROLES.ANBU}>` : '@暗部・ANBU';
  const guardMention = ROLES.GUARD ? `<@&${ROLES.GUARD}>` : '@護衛・GUARD';

  const textContent = [
    '### ╭・୨୧ ―――― 木ノ葉 TICKET ―――― ୨୧・╮',
    '',
    `Trạm tiếp nhận yêu cầu & hỗ trợ của **${guildName}**.`,
    '',
    '💌 **Đặt lịch hẹn (Booking)**',
    `Nhập dịch vụ, chọn ${princeMention} / ${princessMention}; ngân sách và thời gian có thể để trống.`,
    '',
    '📝 **Ứng tuyển (Apply)**',
    'Đăng ký gia nhập và trở thành một phần của đại gia đình Konoha.',
    '',
    '🛠️ **Hỗ trợ & Khiếu nại (Support)**',
    'Phản ánh dịch vụ, giải đáp thắc mắc hoặc cần trợ giúp các vấn đề khác.',
    '',
    `Đội ngũ ${anbuMention} và ${guardMention} luôn túc trực 24/7. Hãy chọn mục phù hợp bên dưới để mở kênh trao đổi riêng nhé!`,
    '',
    '「 *Konoha luôn trân trọng từng phút giây đồng hành cùng bạn.* 」',
  ].join('\n');

  return {
    flags: 32768, // IS_COMPONENTS_V2
    components: [
      {
        type: 17, // Container component
        accent_color: 16027569, // #f48fb1 (Hồng hoa anh đào Làng Lá)
        components: [
          {
            type: 10, // TextDisplay
            content: textContent,
          },
          {
            type: 14, // Separator
            divider: true,
          },
          {
            type: 1, // ActionRow NẰM BÊN TRONG CONTAINER
            components: [
              {
                type: 2, // Button
                style: 2, // Secondary
                label: 'Booking',
                emoji: { name: '💌' },
                custom_id: 'ticket_booking',
              },
              {
                type: 2, // Button
                style: 2, // Secondary
                label: 'Apply',
                emoji: { name: '📝' },
                custom_id: 'ticket_apply',
              },
              {
                type: 2, // Button
                style: 2, // Secondary
                label: 'Support',
                emoji: { name: '🛠️' },
                custom_id: 'ticket_support',
              },
            ],
          },
        ],
      },
    ],
  };
}
