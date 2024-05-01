/**
 * Applies a radius border to the canvas context.
 * @param ctx The canvas rendering context.
 * @param width The width of the canvas.
 * @param height The height of the canvas.
 * @param radius The radius of the border.
 * @returns A void.
 */
export function radiusBorder(ctx: any, x: number = 0, y: number = 0, width: number, height: number, radius: number = 0): void {
    const minDimension = Math.min(width, height);
    const maxRadius = minDimension / 2;
    const clipRadius = Math.min(radius, maxRadius);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + clipRadius, y);
    ctx.lineTo(x + width - clipRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + clipRadius);
    ctx.lineTo(x + width, y + height - clipRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - clipRadius, y + height);
    ctx.lineTo(x + clipRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - clipRadius);
    ctx.lineTo(x, y + clipRadius);
    ctx.quadraticCurveTo(x, y, x + clipRadius, y);
    ctx.closePath();
    ctx.clip();
}
