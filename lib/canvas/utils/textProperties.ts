import { TextObject } from "./types";

/**
 * Draws text on the canvas context.
 * @param ctx The canvas rendering context.
 * @param textOptions The options for the text.
 */
export function drawText(ctx: any, textOptions: TextObject) {
    ctx.save();
    ctx.font = `${textOptions.isBold ? 'bold ' : ''}${textOptions.fontSize || 16}px ${textOptions.fontName || "Arial"}`;
    ctx.textAlign = textOptions.textAlign || 'left';
    ctx.textBaseline = textOptions.textBaseline || 'alphabetic';

    if (textOptions.shadow) {
        const { color, offsetX, offsetY, blur } = textOptions.shadow;
        ctx.shadowColor = color || "transparent";
        ctx.shadowOffsetX = offsetX || 0;
        ctx.shadowOffsetY = offsetY || 0;
        ctx.shadowBlur = blur || 0;
    }

    ctx.fillStyle = textOptions.color || 'darkgray';

    if (textOptions.maxWidth) {
        WrappedText(ctx, textOptions.text || 'Hello World', textOptions.x || 0, textOptions.y || 0, textOptions.maxWidth, textOptions);
    } else {
        ctx.fillText(textOptions.text, textOptions.x, textOptions.y);
    }

    if (textOptions.stroke && textOptions.stroke.color && textOptions.stroke.width) {
        ctx.strokeStyle = textOptions.stroke.color;
        ctx.lineWidth = textOptions.stroke.width;
        ctx.strokeText(textOptions.text, textOptions.x, textOptions.y);
    }
    ctx.restore();
}

/**
 * Draws wrapped text on the canvas context.
 * @param ctx The canvas rendering context.
 * @param text The text to be drawn.
 * @param x The x-coordinate of the starting point of the text.
 * @param y The y-coordinate of the starting point of the text.
 * @param maxWidth The maximum width for wrapping the text.
 * @param textOptions The options for the text.
 */
export function WrappedText(ctx: any, text: string, x: number, y: number, maxWidth: number, textOptions: TextObject) {
    const words = text.split(' ');
    let currentLine = '';
    const fontSize = textOptions.fontSize || 16;
    for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            const adjustedY = y + (textOptions.lineHeight || fontSize) / 2;
            ctx.fillText(currentLine.trim(), x, adjustedY);
            currentLine = words[n] + ' ';
            y += textOptions.lineHeight || fontSize;
        } else {
            currentLine = testLine;
        }
    }

    const adjustedY = y + (textOptions.lineHeight || fontSize) / 2;
    ctx.fillText(currentLine.trim(), x, adjustedY);
  }
