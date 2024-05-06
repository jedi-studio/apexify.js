import { loadImage } from "@napi-rs/canvas";
import { CanvasConfig } from './types';
import fs from 'fs';
import path from 'path';

/**
 * Draws a solid background color on the canvas.
 * @param ctx The canvas rendering context.
 * @param canvas The canvas configuration object.
 * @returns A Promise that resolves once the background color is drawn.
 */
export async function drawBackgroundColor(ctx: any, canvas: CanvasConfig): Promise<void> {
    if (canvas.colorBg !== 'transparent') {
        ctx.fillStyle = canvas.colorBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Draws a gradient background on the canvas.
 * @param ctx The canvas rendering context.
 * @param canvas The canvas configuration object.
 * @returns A Promise that resolves once the gradient background is drawn.
 */
export async function drawBackgroundGradient(ctx: any, canvas: CanvasConfig): Promise<void> {
    if (canvas.gradientBg) {
        if (!canvas.gradientBg.colors || canvas.gradientBg.colors.length === 0) {
            throw new Error('You need to provide colors for the gradient.');
        }

        const gradient = ctx.createLinearGradient(
            canvas.gradientBg.startX,
            canvas.gradientBg.startY,
            canvas.gradientBg.endX,
            canvas.gradientBg.endY
        );

        for (const { stop, color } of canvas.gradientBg.colors) {
            gradient.addColorStop(stop, color);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Draws a custom background image on the canvas.
 * @param ctx The canvas rendering context.
 * @param canvas The canvas configuration object.
 * @returns A Promise that resolves once the custom background image is drawn.
 */
export async function customBackground(ctx: any, canvas: CanvasConfig): Promise<void> {
    if (canvas.customBg) {
        try {
            let imageBuffer: Buffer;
            let imagePath: string;

            if (canvas.customBg.startsWith('http')) {
                const response = await fetch(canvas.customBg);
                if (!response.ok) {
                    throw new Error("Failed to fetch custom background image.");
                }
                const buffer = await response.arrayBuffer();
                imageBuffer = Buffer.from(buffer);
            } else {
                imagePath = path.join(process.cwd(), canvas.customBg);
                imageBuffer = fs.readFileSync(imagePath);
            }

            const image = await loadImage(imageBuffer);

            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        } catch (error: any) {
            console.error('Error loading custom background image:', error);
        }
    }
}
