export function toDraw(content: string, drawTrigger?: string[]): boolean {
    if (!drawTrigger) {
        return true;
    }
    const lowerContent = content.toLowerCase();
    return drawTrigger.some(trigger => lowerContent.startsWith(trigger));
}
