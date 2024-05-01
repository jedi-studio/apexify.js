import { ImageProperties } from "./utils";

/**
 * Applies shadow to the canvas context.
 * @param ctx The canvas rendering context.
 * @param shadow The shadow properties.
 * @param x The x-coordinate of the shape.
 * @param y The y-coordinate of the shape.
 * @param width The width of the shape.
 * @param height The height of the shape.
 */
export function applyShadow(ctx: any, shadow: ImageProperties['shadow'], x: number, y: number, width: number, height: number): void {
    
    ctx.save();

    if (
        shadow
      ) {
        ctx.globalAlpha = shadow.opacity || null;
        ctx.filter = `blur(${shadow.blur || null}px)`;

        const shadowX =
          x + (shadow.offsetX || 0);
        const shadowY =
          y + (shadow.offsetY || 0);

        objectRadius(ctx, shadowX, shadowY, width, height, shadow.borderRadius || 2)

        ctx.fillStyle = shadow.color || "transparent";
        ctx.fill();
      }

      ctx.filter = "none";
      ctx.globalAlpha = 1;
      ctx.restore();

}



/**
 * Applies stroke to the canvas context.
 * @param ctx The canvas rendering context.
 * @param stroke The stroke properties.
 * @param x The x-coordinate of the shape.
 * @param y The y-coordinate of the shape.
 * @param width The width of the shape.
 * @param height The height of the shape.
 */
export function applyStroke(ctx: any, stroke: ImageProperties['stroke'], x: number, y: number, width: number, height: number, gradient?: any): void {
  ctx.save();

  if (stroke) {
    if (gradient) {
      const gradientFill = createGradient(
          ctx,
          gradient,
          x,
          y, 
          x + width, 
          y + height,
      );
      ctx.strokeStyle = gradientFill;
  } else {
    ctx.strokeStyle = stroke.color || "transparent";
  }
      ctx.lineWidth = stroke.width || 0;

      const adjustedX = x - (stroke.position || 0); 
      const adjustedY = y - (stroke.position || 0); 
      const adjustedWidth = width + (stroke.position || 0) * 2; 
      const adjustedHeight = height + (stroke.position || 0) * 2; 

      objectRadius(ctx, adjustedX, adjustedY, adjustedWidth, adjustedHeight, stroke.borderRadius || 2);

      ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws a shape on the canvas context.
 * @param ctx The canvas rendering context.
 * @param shapeSettings The settings for the shape.
 */
export function drawShape(ctx: any, shapeSettings: any) {
  const { source, x, y, width, height, rotation, borderRadius, stroke, shadow, isFilled, color, gradient } = shapeSettings;

  const shapeName = source.toLowerCase();

  switch (shapeName) {
      case 'circle':
          ctx.save();
          applyShadow(ctx, shadow, x, y, width, height);
          applyRotation(ctx, rotation, x, y, width, height);
          ctx.beginPath();
          ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
          break;
      case 'square':
          ctx.save();
          applyRotation(ctx, rotation, x, y, width, height);
          applyShadow(ctx, shadow, x, y, width, height);
          break;
      case 'triangle':
          ctx.save();
          applyRotation(ctx, rotation, x, y, width, height);
          applyShadow(ctx, shadow, x, y, width, height);
          ctx.beginPath();
          ctx.moveTo(x, y + height);
          ctx.lineTo(x + width / 2, y);
          ctx.lineTo(x + width, y + height);
          ctx.closePath();
          break;
      case 'pentagon':
          ctx.save();
          applyRotation(ctx, rotation, x, y, width, height);
          applyShadow(ctx, shadow, x, y, width, height);
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
              ctx.lineTo(x + width / 2 + width / 2 * Math.sin(i * 2 * Math.PI / 5),
                         y + height / 2 - height / 2 * Math.cos(i * 2 * Math.PI / 5));
          }
          ctx.closePath();
          break;
      case 'hexagon':
          ctx.save();
          applyRotation(ctx, rotation, x, y, width, height);
          applyShadow(ctx, shadow, x, y, width, height);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
              ctx.lineTo(x + width / 2 + width / 2 * Math.sin(i * 2 * Math.PI / 6),
                         y + height / 2 - height / 2 * Math.cos(i * 2 * Math.PI / 6));
          }
          ctx.closePath();
          break;
      case 'heptagon':
          ctx.save();
          applyRotation(ctx, rotation, x, y, width, height);
          applyShadow(ctx, shadow, x, y, width, height);
          ctx.beginPath();
          for (let i = 0; i < 7; i++) {
              ctx.lineTo(x + width / 2 + width / 2 * Math.sin(i * 2 * Math.PI / 7),
                         y + height / 2 - height / 2 * Math.cos(i * 2 * Math.PI / 7));
          }
          ctx.closePath();
          break;
      case 'octagon':
          ctx.save();
          applyRotation(ctx, rotation, x, y, width, height);
          applyShadow(ctx, shadow, x, y, width, height);
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
              ctx.lineTo(x + width / 2 + width / 2 * Math.sin(i * 2 * Math.PI / 8),
                         y + height / 2 - height / 2 * Math.cos(i * 2 * Math.PI / 8));
          }
          ctx.closePath();
      case 'star':
          ctx.save();
          applyRotation(ctx, rotation, x, y, width, height);
          applyShadow(ctx, shadow, x, y, width, height);
          ctx.beginPath();
          const numPoints = 5;
          const outerRadius = Math.min(width, height) / 2;
          const innerRadius = outerRadius / 2;
          for (let i = 0; i < numPoints * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = Math.PI / numPoints * i;
              ctx.lineTo(x + width / 2 + radius * Math.sin(angle),
                         y + height / 2 - radius * Math.cos(angle));
          }
          ctx.closePath();
          break;
        case 'oval':
            ctx.save();
            applyRotation(ctx, rotation, x, y, width, height);
            applyShadow(ctx, shadow, x, y, width, height);
        
            ctx.beginPath();
            ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
            ctx.closePath();
            if (isFilled) {
                ctx.fillStyle = color;
                ctx.fill();
            } else {
                applyStroke(ctx, stroke, x, y, width, height);
            }
            ctx.restore();
            break;
          default:
          throw new Error(`Unsupported shape: ${shapeName}`);
  }
  if (isFilled) {
    if (borderRadius) {
        objectRadius(ctx, x, y, width, height, borderRadius);
        if (gradient) {
            const gradientFill = createGradient(
                ctx,
                gradient,
                x,
                y, 
                x + width, 
                y + height,
            );
            ctx.fillStyle = gradientFill;
        } else {
            ctx.fillStyle = color || "transparent";
        }
        ctx.fill();
    } else {
      if (gradient) {
        const gradientFill = createGradient(
            ctx,
            gradient,
            x,
            y,
            x + width,
            y + height,
        );
        ctx.fillStyle = gradientFill;
    } else {
        ctx.fillStyle = color || "transparent";
    }
            if (shapeName === 'square') {
            ctx.fillRect(x, y, width, height);
        } else if (shapeName === 'circle') {
            ctx.fill();
        } else {
            ctx.fill()
        }
    }
} else {
    if (gradient) {
        // Call createGradient with correct coordinates
        const gradientFill = createGradient(
            ctx,
            gradient,
            x, // startX
            y, // startY
            x + width, // endX
            y + height, // endY
        );
        ctx.fillStyle = gradientFill;
    }
    applyStroke(ctx, stroke, x, y, width, height, gradient);
}

    ctx.restore();
}

export function createGradient(ctx: any, gradientOptions: any, startX: number, startY: number, endX: number, endY: number) {
  if (!gradientOptions || !gradientOptions.type) {
      throw new Error(
          "Invalid gradient options. Provide a valid object with a type property.",
      );
  }

  if (gradientOptions.type === "linear") {
      if (
          typeof startX !== "number" ||
          typeof startY !== "number" ||
          typeof endX !== "number" ||
          typeof endY !== "number"
      ) {
          throw new Error(
              "Invalid gradient options for linear gradient. Numeric values are required for startX, startY, endX, and endY.",
          );
      }
  } else if (gradientOptions.type === "radial") {
      if (
          typeof gradientOptions.startX !== "number" ||
          typeof gradientOptions.startY !== "number" ||
          typeof gradientOptions.startRadius !== "number" ||
          typeof gradientOptions.endX !== "number" ||
          typeof gradientOptions.endY !== "number" ||
          typeof gradientOptions.endRadius !== "number"
      ) {
          throw new Error(
              "Invalid gradient options for radial gradient. Numeric values are required for startX, startY, startRadius, endX, endY, and endRadius.",
          );
      }
  } else {
      throw new Error('Unsupported gradient type. Use "linear" or "radial".');
  }

  const gradient =
      gradientOptions.type === "linear"
          ? ctx.createLinearGradient(startX, startY, endX, endY)
          : ctx.createRadialGradient(
              gradientOptions.startX,
              gradientOptions.startY,
              gradientOptions.startRadius,
              gradientOptions.endX,
              gradientOptions.endY,
              gradientOptions.endRadius,
          );

  for (const colorStop of gradientOptions.colors) {
      gradient.addColorStop(colorStop.stop, colorStop.color);
  }

  return gradient;
}


/**
 * Applies rotation to the canvas context.
 * @param ctx The canvas rendering context.
 * @param rotation The rotation angle in degrees.
 * @param x The x-coordinate of the center of rotation.
 * @param y The y-coordinate of the center of rotation.
 * @param width The width of the shape.
 * @param height The height of the shape.
 */
export function applyRotation(ctx: any, rotation: number, x: number, y: number, width: number, height: number): void {
    if (rotation !== undefined) {
        const rotationX = x + width / 2;
        const rotationY = y + height / 2;
        ctx.translate(rotationX, rotationY);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-rotationX, -rotationY);
    }
}

/**
 * Applies border radius to the canvas context.
 * @param ctx The canvas rendering context.
 * @param image The image properties containing the border radius.
 * @param x The x-coordinate of the shape.
 * @param y The y-coordinate of the shape.
 * @param width The width of the shape.
 * @param height The height of the shape.
 * @param borderRadius The border radius value.
 */
export function imageRadius(ctx: any, image: any, x: number, y: number, width: number, height: number, borderRadius: any ): void {
    ctx.save();
    ctx.beginPath();

    if (borderRadius === "circular") {
      const circleRadius = Math.min(width, height) / 2;
      ctx.arc(x + width / 2, y + height / 2, circleRadius, 0, 2 * Math.PI);
    } else {
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + width - borderRadius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
      ctx.lineTo(x + width, y + height - borderRadius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - borderRadius,
        y + height,
      );
      ctx.lineTo(x + borderRadius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
    }

    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
}

/**
 * Applies border radius to the canvas context for objects.
 * @param ctx The canvas rendering context.
 * @param x The x-coordinate of the object.
 * @param y The y-coordinate of the object.
 * @param width The width of the object.
 * @param height The height of the object.
 * @param borderRadius The border radius value.
 */
export function objectRadius(ctx: any, x: any, y: any, width: number, height: number, borderRadius: any = 0.1): void {
    ctx.save();
    if (borderRadius === "circular") {
        const circleRadius = Math.min(width, height) / 2;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, circleRadius, 0, 2 * Math.PI);
        ctx.closePath();
      } else if (borderRadius) {
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - borderRadius,
          y + height,
        );
        ctx.lineTo(x + borderRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
      } else {
        ctx.fillRect(x, y, width, height);
      }
      ctx.restore();
}

