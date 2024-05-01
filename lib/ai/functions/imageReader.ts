import { createWorker } from 'tesseract.js';

async function imageReader(imageURL: string): Promise<string> {
  try {

    if (imageURL === null) return '';
    
    const worker = await createWorker();
    const ret = await worker.recognize(imageURL);
    await worker.terminate();

    const text = ret.data.text;

    if (text.length <= 0) {
      return `No text found on image`
    }

    return text;
  } catch (error: any) {
    return `Error occurred while processing image: ${error.message}`;
  }
}

export { imageReader };
