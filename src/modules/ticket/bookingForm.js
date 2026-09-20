import {
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

export const BOOKING_MODAL_ID = 'booking_request_modal';

export const BOOKING_FIELDS = {
  SERVICE: 'booking_service',
  PERFORMER_TYPE: 'booking_performer_type',
  BUDGET: 'booking_budget',
  TIME: 'booking_time',
};

export function createBookingModal() {
  const serviceInput = new TextInputBuilder()
    .setCustomId(BOOKING_FIELDS.SERVICE)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ví dụ: tâm sự, chơi game, hát...')
    .setRequired(true)
    .setMaxLength(200);

  const performerSelect = new StringSelectMenuBuilder()
    .setCustomId(BOOKING_FIELDS.PERFORMER_TYPE)
    .setPlaceholder('Chọn PRINCE hoặc PRINCESS')
    .setRequired(true)
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(
      {
        label: '王子・PRINCE',
        value: 'prince',
        description: 'Book đào nam',
      },
      {
        label: '姫君・PRINCESS',
        value: 'princess',
        description: 'Book đào nữ',
      }
    );

  const budgetInput = new TextInputBuilder()
    .setCustomId(BOOKING_FIELDS.BUDGET)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ví dụ: 100.000đ')
    .setRequired(false)
    .setMaxLength(100);

  const timeInput = new TextInputBuilder()
    .setCustomId(BOOKING_FIELDS.TIME)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ví dụ: 20:00 ngày 21/09 hoặc linh hoạt')
    .setRequired(false)
    .setMaxLength(150);

  return new ModalBuilder()
    .setCustomId(BOOKING_MODAL_ID)
    .setTitle('Đặt lịch Konoha')
    .addLabelComponents(
      new LabelBuilder()
        .setLabel('Dịch vụ *')
        .setDescription('Bạn muốn book dịch vụ gì?')
        .setTextInputComponent(serviceInput),
      new LabelBuilder()
        .setLabel('Chọn đào *')
        .setDescription('Chọn nhóm đào phù hợp')
        .setStringSelectMenuComponent(performerSelect),
      new LabelBuilder()
        .setLabel('Ngân sách')
        .setDescription('Tùy chọn')
        .setTextInputComponent(budgetInput),
      new LabelBuilder()
        .setLabel('Thời gian')
        .setDescription('Tùy chọn')
        .setTextInputComponent(timeInput)
    );
}

export function readBookingModal(interaction) {
  const service = interaction.fields.getTextInputValue(BOOKING_FIELDS.SERVICE).trim();
  const performerType = interaction.fields.getStringSelectValues(BOOKING_FIELDS.PERFORMER_TYPE)[0];
  const budget = interaction.fields.getTextInputValue(BOOKING_FIELDS.BUDGET).trim();
  const time = interaction.fields.getTextInputValue(BOOKING_FIELDS.TIME).trim();

  return {
    service,
    performerType,
    budget: budget || null,
    time: time || null,
  };
}
