export async function typeWriter(channel: any, sentence: string, speed: number, delay: number): Promise<void> {
    const typingMessage = await channel.send(sentence[0]);
    let typedSentence = typingMessage.content;
    let i = 1;

    while (i < sentence.length) {
        typedSentence += sentence.slice(i, i + getStepCount(speed));
        await sleep(delay);
        await typingMessage.edit(typedSentence);
        i += getStepCount(speed);
    }
}

function getStepCount(speed: number): number {
    const maxSteps = 120;
    const steps = Math.min(Math.ceil(speed), maxSteps);
    return steps > 0 ? steps : 1;
}

function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}
