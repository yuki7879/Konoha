import { createCanvas, loadImage } from '@napi-rs/canvas';
import { fileURLToPath } from 'node:url';

const TEMPLATE_PATH = fileURLToPath(
  new URL('../../../assets/tickets/ticket-panel-template.jpg', import.meta.url)
);

const WIDTH = 1536;
const HEIGHT = 864;
const FONT_FAMILY = '"Noto Serif","Times New Roman",Georgia,serif';
const TEXT_COLOR = '#f4e2be';

// Safe text areas measured from the 1536x864 source image.
// Coordinates intentionally stay inside the visible borders.
export const TICKET_PANEL_LAYOUT = Object.freeze({
  creator: { x: 342, y: 320, w: 418, h: 31, maxSize: 22, minSize: 14 },
  staff: { x: 342, y: 402, w: 418, h: 31, maxSize: 22, minSize: 14 },
  created: { x: 342, y: 488, w: 418, h: 30, maxSize: 21, minSize: 13 },
  content: {
    x: 342, y: 585, w: 416, h: 103,
    maxSize: 21, minSize: 14, lineGap: 4, maxLines: 3,
  },
  type: { x: 938, y: 336, w: 376, h: 31, maxSize: 22, minSize: 14 },
  status: { x: 938, y: 441, w: 376, h: 31, maxSize: 21, minSize: 13 },
  note: {
    x: 938, y: 566, w: 372, h: 118,
    maxSize: 20, minSize: 13, lineGap: 4, maxLines: 4,
  },
});

let templatePromise;

function getTemplate() {
  if (!templatePromise) {
    templatePromise = loadImage(TEMPLATE_PATH);
  }
  return templatePromise;
}

function clean(value, fallback = '') {
  const text = String(value ?? fallback)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return text || fallback;
}

function setFont(ctx, size) {
  ctx.font = `${size}px ${FONT_FAMILY}`;
}

function clipWithEllipsis(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;

  const ellipsis = '…';
  let value = text;

  while (value.length > 1 && ctx.measureText(value + ellipsis).width > maxWidth) {
    value = value.slice(0, -1);
  }

  return value.trimEnd() + ellipsis;
}

function fitSingleLine(ctx, text, box) {
  for (let size = box.maxSize; size >= box.minSize; size -= 1) {
    setFont(ctx, size);
    if (ctx.measureText(text).width <= box.w) {
      return { size, text };
    }
  }

  setFont(ctx, box.minSize);
  return {
    size: box.minSize,
    text: clipWithEllipsis(ctx, text, box.w),
  };
}

function splitLongToken(ctx, token, maxWidth) {
  const parts = [];
  let part = '';

  for (const char of token) {
    const candidate = part + char;

    if (part && ctx.measureText(candidate).width > maxWidth) {
      parts.push(part);
      part = char;
    } else {
      part = candidate;
    }
  }

  if (part) parts.push(part);
  return parts;
}

function wrapAtCurrentFont(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  for (const word of words) {
    if (ctx.measureText(word).width > maxWidth) {
      const pieces = splitLongToken(ctx, word, maxWidth);

      if (line) {
        lines.push(line);
        line = '';
      }

      lines.push(...pieces.slice(0, -1));
      line = pieces.at(-1) || '';
      continue;
    }

    const candidate = line ? `${line} ${word}` : word;

    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function fitWrapped(ctx, text, box) {
  for (let size = box.maxSize; size >= box.minSize; size -= 1) {
    setFont(ctx, size);
    const lines = wrapAtCurrentFont(ctx, text, box.w);
    const lineHeight = size + box.lineGap;
    const totalHeight = lines.length * lineHeight - box.lineGap;

    if (lines.length <= box.maxLines && totalHeight <= box.h) {
      return { size, lines, lineHeight };
    }
  }

  setFont(ctx, box.minSize);
  const lines = wrapAtCurrentFont(ctx, text, box.w);
  const visible = lines.slice(0, box.maxLines);

  if (lines.length > box.maxLines && visible.length) {
    visible[visible.length - 1] = clipWithEllipsis(
      ctx,
      visible[visible.length - 1],
      box.w
    );
  }

  return {
    size: box.minSize,
    lines: visible,
    lineHeight: box.minSize + box.lineGap,
  };
}

function applyTextStyle(ctx) {
  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.82)';
  ctx.shadowBlur = 1;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
}

function drawSingle(ctx, value, box) {
  const text = clean(value, '—');
  const fitted = fitSingleLine(ctx, text, box);
  setFont(ctx, fitted.size);

  const metrics = ctx.measureText(fitted.text);
  const ascent = metrics.actualBoundingBoxAscent || fitted.size * 0.78;
  const descent = metrics.actualBoundingBoxDescent || fitted.size * 0.22;
  const glyphHeight = ascent + descent;
  const baseline = box.y + (box.h - glyphHeight) / 2 + ascent;

  ctx.fillText(fitted.text, box.x, Math.round(baseline));
}

function drawWrapped(ctx, value, box) {
  const text = clean(value, '—');
  const fitted = fitWrapped(ctx, text, box);
  setFont(ctx, fitted.size);

  const blockHeight =
    fitted.lines.length * fitted.lineHeight - box.lineGap;
  const top = box.y + Math.max(0, (box.h - blockHeight) / 2);

  fitted.lines.forEach((line, index) => {
    const baseline = top + fitted.size + index * fitted.lineHeight;
    ctx.fillText(line, box.x, Math.round(baseline));
  });
}

export function formatTicketTime(timestamp = Date.now()) {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(new Date(timestamp))
    .replace(', ', ' • ');
}

export async function renderTicketPanel({
  creator,
  staff = 'Chưa tiếp nhận',
  createdAt = Date.now(),
  type,
  status = 'Đang chờ tiếp nhận',
  content,
  note = 'Không có ghi chú',
}) {
  const template = await getTemplate();
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(template, 0, 0, WIDTH, HEIGHT);
  applyTextStyle(ctx);

  drawSingle(ctx, creator, TICKET_PANEL_LAYOUT.creator);
  drawSingle(ctx, staff, TICKET_PANEL_LAYOUT.staff);
  drawSingle(ctx, formatTicketTime(createdAt), TICKET_PANEL_LAYOUT.created);
  drawSingle(ctx, type, TICKET_PANEL_LAYOUT.type);
  drawSingle(ctx, status, TICKET_PANEL_LAYOUT.status);
  drawWrapped(ctx, content, TICKET_PANEL_LAYOUT.content);
  drawWrapped(ctx, note, TICKET_PANEL_LAYOUT.note);

  return canvas.encode('png');
}
