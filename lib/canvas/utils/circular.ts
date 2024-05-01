/**
 * Applies a circular border to the canvas context.
 * @param ctx The canvas rendering context.
 * @param width The width of the canvas.
 * @param height The height of the canvas.
 * @param radius The radius of the circular border.
 * @returns A void.
 */
export function circularBorder(ctx: any, width: number, height: number, radius: number = 0): void {
    const minDimension = Math.min(width, height);
    const clipRadius = minDimension / 2 + radius;
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, clipRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
}
