
export function customLines (ctx: any, options: any) { 
for (const customOption of options) {
    ctx.beginPath();
    ctx.moveTo(customOption.startCoordinates.x, customOption.startCoordinates.y);
    ctx.lineTo(customOption.endCoordinates.x, customOption.endCoordinates.y);
    ctx.lineWidth = customOption.lineStyle.width || 1;
    ctx.strokeStyle = customOption.lineStyle.color || 'black';

    if (typeof customOption.lineStyle.lineRadius === 'number') {
        const borderRadius = customOption.lineStyle.lineRadius;
        const dx = customOption.endCoordinates.x - customOption.startCoordinates.x;
        const dy = customOption.endCoordinates.y - customOption.startCoordinates.y;
        const angle = Math.atan2(dy, dx);
        const offsetX = Math.cos(angle) * borderRadius;
        const offsetY = Math.sin(angle) * borderRadius;
        ctx.moveTo(customOption.startCoordinates.x + offsetX, customOption.startCoordinates.y + offsetY);
        ctx.lineTo(customOption.endCoordinates.x - offsetX, customOption.endCoordinates.y - offsetY);
    } else if (customOption.lineStyle.lineRadius === 'circular') {
        const dx = customOption.endCoordinates.x - customOption.startCoordinates.x;
        const dy = customOption.endCoordinates.y - customOption.startCoordinates.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const halfWidth = customOption.lineStyle.width ? customOption.lineStyle.width / 2 : 1;
        ctx.moveTo(customOption.startCoordinates.x + Math.cos(angle - Math.PI / 2) * halfWidth, customOption.startCoordinates.y + Math.sin(angle - Math.PI / 2) * halfWidth);
        ctx.arc(customOption.startCoordinates.x, customOption.startCoordinates.y, length / 2, angle - Math.PI / 2, angle + Math.PI / 2);
        ctx.lineTo(customOption.endCoordinates.x + Math.cos(angle + Math.PI / 2) * halfWidth, customOption.endCoordinates.y + Math.sin(angle + Math.PI / 2) * halfWidth);
        ctx.arc(customOption.endCoordinates.x, customOption.endCoordinates.y, length / 2, angle + Math.PI / 2, angle - Math.PI / 2, true);
        ctx.closePath();
    }

    ctx.stroke();

    if (customOption.lineStyle.stroke) {
        const stroke = customOption.lineStyle.stroke;
        ctx.strokeStyle = stroke.color || 'black';
        ctx.lineWidth = stroke.width || 1;
        ctx.stroke();
    }

    if (customOption.lineStyle.shadow) {
        const shadow = customOption.lineStyle.shadow;
        ctx.shadowOffsetX = shadow.offsetX || 0;
        ctx.shadowOffsetY = shadow.offsetY || 0;
        ctx.shadowBlur = shadow.blur || 0;
        ctx.shadowColor = shadow.color || 'black';
    }
  }
}