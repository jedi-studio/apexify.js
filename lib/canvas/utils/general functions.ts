import axios from 'axios';
import path from 'path'
import sharp from 'sharp';
import { cropOptions } from './types';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import Jimp from 'jimp';

export async function loadImages(imagePath: string) {
    try {
        if (!imagePath) {
            throw new Error("Image path is required.");
        }

        if (imagePath.startsWith("http")) {
            const response = await axios.get<ArrayBuffer>(imagePath, {
                responseType: "arraybuffer",
            });
            return sharp(response.data);
        } else {
            const absolutePath = path.join(process.cwd(), imagePath);
            return sharp(absolutePath);
        }
    } catch (error) {
        console.error("Error loading image:", error);
        throw new Error("Failed to load image");
    }
}

export async function resizingImg(resizeOptions: any): Promise<any> { 
  try {
    if (!resizeOptions.imagePath) {
        throw new Error("Image path is required for resizing.");
    }

    let absoluteImagePath: string;

    if (resizeOptions.imagePath.startsWith("http")) {

        absoluteImagePath = resizeOptions.imagePath;
    } else {

        absoluteImagePath = path.join(process.cwd(), resizeOptions.imagePath);
    }

    const image = await loadImage(absoluteImagePath);
    const canvas = createCanvas(resizeOptions.size?.width || 500, resizeOptions.size?.height || 500);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Unable to get 2D rendering context from canvas');
    }

    ctx.drawImage(image, 0, 0, resizeOptions.size?.width || 500, resizeOptions.size?.height || 500);

    const resizedBuffer = await canvas.toBuffer('image/png');

    return resizedBuffer;
} catch (error) {
    console.error("Error resizing image:", error);
    throw new Error("Failed to resize image");
}
}

export async function converter(imagePath: string, newExtension: string) {
  try {
      const validExtensions: (keyof sharp.FormatEnum)[] = ['jpeg', 'png', 'webp', 'tiff', 'gif', 'avif', 'heif', 'raw', 'pdf', 'svg'];

      const newExt = newExtension.toLowerCase();
      if (!validExtensions.includes(newExt as keyof sharp.FormatEnum)) {
          throw new Error(`Invalid image format: ${newExt}`);
      }

      let image: sharp.Sharp;

      if (imagePath.startsWith("http")) {
          const response = await axios.get<ArrayBuffer>(imagePath, {
              responseType: "arraybuffer",
          });
          image = sharp(Buffer.from(response.data));
      } else {
          if (!imagePath) {
              throw new Error("Image path is required.");
          }

          const absolutePath = path.join(process.cwd(), imagePath);
          image = sharp(absolutePath);
      }

      const convertedBuffer = await image.toFormat(newExt as keyof sharp.FormatEnum).toBuffer();
      return convertedBuffer;
  } catch (error) {
      console.error("Error changing image extension:", error);
      throw new Error("Failed to change image extension");
  }
}

export async function applyColorFilters(imagePath: string, filterColor: string) {

try {
    let image: any;

    if (imagePath.startsWith("http")) {

        const pngBuffer = await converter(imagePath, "png");
        image = sharp(pngBuffer);
    } else {

        const imagePathResolved = path.join(process.cwd(), imagePath);
        image = sharp(imagePathResolved);
    }

    const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    if (!hexColorRegex.test(filterColor)) {
        throw new Error("Invalid color format. Only hex colors are supported.");
    }

    image.tint(filterColor);

    const outputBuffer = await image.toBuffer();
    return outputBuffer;
} catch (error) {
    console.error("Error applying color filter:", error);
    throw new Error("Failed to apply color filter");
  }
}

export async function imgEffects(imagePath: string,  filters: any[]) {
    try {
        let jimpImage;
  
        if (imagePath.startsWith("http")) {
          const pngBuffer = await converter(imagePath, "png");
          jimpImage = await Jimp.read(pngBuffer);
        } else {
          const imagePathResolved = path.join(process.cwd(), imagePath)
          jimpImage = await Jimp.read(imagePathResolved);
        }
  
        for (const filter of filters) {
          switch (filter.type) {
            case "flip":
              jimpImage.flip(filter.horizontal, filter.vertical);
              break;
            case "mirror":
              jimpImage.mirror(filter.horizontal, filter.vertical);
              break;
            case "rotate":
              jimpImage.rotate(filter.deg, filter.mode);
              break;
            case "brightness":
              jimpImage.brightness(filter.value);
              break;
            case "contrast":
              jimpImage.contrast(filter.value);
              break;
            case "dither565":
              jimpImage.dither565();
              break;
            case "greyscale":
              jimpImage.greyscale();
              break;
            case "invert":
              jimpImage.invert();
              break;
            case "normalize":
              jimpImage.normalize();
              break;
            case "autocrop":
              jimpImage.autocrop(filter.tolerance || 0);
              break;
            case "crop":
              jimpImage.crop(filter.x, filter.y, filter.w, filter.h);
              break;
            case "fade":
              jimpImage.fade(filter.factor);
              break;
            case "opacity":
              jimpImage.opacity(filter.factor);
              break;
            case "opaque":
              jimpImage.opaque();
              break;
            case "gaussian":
              jimpImage.gaussian(filter.radius);
              break;
            case "blur":
              jimpImage.blur(filter.radius);
              break;
            case "posterize":
              jimpImage.posterize(filter.levels);
              break;
            case "sepia":
              jimpImage.sepia();
              break;
            case "pixelate":
              jimpImage.pixelate(
                filter.size,
                filter.x,
                filter.y,
                filter.w,
                filter.h,
              );
              break;
            default:
              console.error(`Unsupported filter type: ${filter.type}`);
          }
        }
  
        const outputMimeType = jimpImage._originalMime || Jimp.MIME_PNG;
  
        return await jimpImage.getBufferAsync(outputMimeType);
      } catch (error: any) {
        console.error("Error processing image:", error.message);
        throw new Error("Failed to process image");
    }
}


export async function cropInner(options: cropOptions): Promise<any> {
    try {
      
      let image;

      if (options.imageSource.startsWith('http')) {
        image = await loadImage(options.imageSource);
      } else {
        image = await loadImage(path.join(process.cwd(), options.imageSource));
      }
      
        const width = Math.abs(options.coordinates[0].from.x - options.coordinates[1].to.x);
        const height = Math.abs(options.coordinates[0].from.y - options.coordinates[2].to.y);

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        if (options.radius === 'circular') {
            const radius = Math.min(width, height) / 2;
            ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
        } else if (typeof options.radius === 'number' && options.radius >= 0) {
            ctx.beginPath();
            ctx.moveTo(options.radius, 0);
            ctx.lineTo(width - options.radius, 0);
            ctx.quadraticCurveTo(width, 0, width, options.radius);
            ctx.lineTo(width, height - options.radius);
            ctx.quadraticCurveTo(width, height, width - options.radius, height);
            ctx.lineTo(options.radius, height);
            ctx.quadraticCurveTo(0, height, 0, height - options.radius);
            ctx.lineTo(0, options.radius);
            ctx.quadraticCurveTo(0, 0, options.radius, 0);
            ctx.closePath();
            ctx.clip();
        } else if (options.radius !== null && options.radius !== 'circular' && typeof options.radius !== 'number'  ) {
            throw new Error('The "radius" option can only be "circular" or a non-negative number.');
        }

        ctx.drawImage(image, options.coordinates[0].from.x, options.coordinates[0].from.y, width, height, 0, 0, width, height);

        ctx.beginPath();
        for (let i = 0; i < options.coordinates.length; i++) {
            const coordinate = options.coordinates[i];
            const nextCoordinate = options.coordinates[(i + 1) % options.coordinates.length];
            const tension = coordinate.tension || 0;
            const cp1x = coordinate.from.x + (nextCoordinate.from.x - coordinate.from.x) * tension;
            const cp1y = coordinate.from.y + (nextCoordinate.from.y - coordinate.from.y) * tension;
            const cp2x = coordinate.to.x - (nextCoordinate.to.x - coordinate.to.x) * tension;
            const cp2y = coordinate.to.y - (nextCoordinate.to.y - coordinate.to.y) * tension;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, coordinate.to.x, coordinate.to.y);
        }
        ctx.closePath();

        const buffer = canvas.toBuffer('image/png');

        return buffer;

    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

export async function cropOuter(options: cropOptions): Promise<any> {
    try {

      let image;

      if (options.imageSource.startsWith('http')) {
        image = await loadImage(options.imageSource);
      } else {
        image = await loadImage(path.join(process.cwd(), options.imageSource));
      }

        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0);

        ctx.beginPath();
        ctx.moveTo(options.coordinates[0].from.x, options.coordinates[0].from.y);
        for (let i = 0; i < options.coordinates.length; i++) {
            const coordinate = options.coordinates[i];
            const nextCoordinate = options.coordinates[(i + 1) % options.coordinates.length];
            const tension = coordinate.tension || 0;
            const cp1x = coordinate.from.x + (nextCoordinate.from.x - coordinate.from.x) * tension;
            const cp1y = coordinate.from.y + (nextCoordinate.from.y - coordinate.from.y) * tension;
            const cp2x = coordinate.to.x - (nextCoordinate.to.x - coordinate.to.x) * tension;
            const cp2y = coordinate.to.y - (nextCoordinate.to.y - coordinate.to.y) * tension;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, coordinate.to.x, coordinate.to.y);
        }
        ctx.closePath();

        ctx.clip();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const buffer = canvas.toBuffer('image/png');

        return buffer;

    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}


export async function detectColors(imagePath: string): Promise<{ color: string; frequency: string }[]> {
  try {
      let image: any;
      if (imagePath.startsWith('http')) {
          const response = await axios.get(imagePath, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data, 'binary');
          image = await loadImage(buffer);
      } else {
        const localImagePath = path.join(process.cwd(), imagePath);
        image = await loadImage(localImagePath);      }

      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d') as any;

      ctx.drawImage(image, 0, 0, image.width, image.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const colorFrequency: { [color: string]: number } = {};

      for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];

          const color = `${red},${green},${blue}`;

          colorFrequency[color] = (colorFrequency[color] || 0) + 1;
      }

      const totalPixels = canvas.width * canvas.height;

      const dominantColors = Object.entries(colorFrequency)
          .filter(([color, frequency]: [string, number]) => (frequency / totalPixels) * 100 >= 2)
          .map(([color, frequency]: [string, number]) => ({
              color,
              frequency: ((frequency / totalPixels) * 100).toFixed(2),
          }));

      return dominantColors;
  } catch (error) {
      console.error('Error:', error);
      return [];
  }
}

export async function removeColor(inputImagePath: string, colorToRemove: { red: number; green: number; blue: number }): Promise<Buffer | undefined> {
  try {
      let image: any;
      if (inputImagePath.startsWith('http')) {
          const response = await axios.get(inputImagePath, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data, 'binary');
          image = await loadImage(buffer);
      } else {
        const localImagePath = path.join(process.cwd(), inputImagePath);
        image = await loadImage(localImagePath);      }

      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d') as any;

      ctx.drawImage(image, 0, 0, image.width, image.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < imageData.data.length; i += 4) {
          const red = imageData.data[i];
          const green = imageData.data[i + 1];
          const blue = imageData.data[i + 2];
          const alpha = imageData.data[i + 3];

          if (red === colorToRemove.red && green === colorToRemove.green && blue === colorToRemove.blue) {
              imageData.data[i + 3] = 0;
          }
      }

      ctx.putImageData(imageData, 0, 0);

      return canvas.toBuffer('image/png');
  } catch (error) {
      console.error('Error:', error);
      return undefined;
  }
}

export async function bgRemoval(imgURL: string, API_KEY: string): Promise<Buffer | undefined> {
    try {
     
      if (!API_KEY) {
        throw new Error("API_KEY is required. Please visit remove.bg, create an account, and obtain your API key at: https://accounts.kaleido.ai/users/sign_in#api-key");
      }
            const response = await axios.post('https://api.remove.bg/v1.0/removebg', {
            image_url: imgURL,
            size: 'auto'
        }, {
            headers: {
                'X-Api-Key': API_KEY
            },
            responseType: 'arraybuffer'
        });

        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error('Error:', error);
        return undefined;
    }
}