import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import path from 'path';
import GIFEncoder from 'gifencoder';
import { PassThrough, Writable} from 'stream'
import fs from 'fs';
import { CanvasConfig, TextObject, ImageProperties, ImageObject, GIFOptions, GIFResults, CustomOptions, cropOptions,
     drawBackgroundGradient, drawBackgroundColor, customBackground, circularBorder, radiusBorder, customLines, 
     applyRotation, applyStroke, applyShadow, imageRadius, drawShape, drawText, 
     converter, resizingImg, applyColorFilters, imgEffects, verticalBarChart, pieChart, lineChart, cropInner, cropOuter, bgRemoval, detectColors, removeColor } from "./utils/utils";
import {  } from "./utils/general functions";

export class ApexPainter {

  async createCanvas(canvas: CanvasConfig): Promise<Buffer> {
    let canvasWidth: number = canvas.width || 500;
    let canvasHeight: number = canvas.height || 500;
    let borderRadius: number | string = canvas.borderRadius || 0;

    if (canvas.customBg) {
        try {
            const response = await fetch(canvas.customBg);
            if (!response.ok) {
                throw new Error("Failed to fetch background image.");
            }
            const buffer = await response.arrayBuffer();
            const image = await loadImage(Buffer.from(buffer));
            canvasWidth = image.width;
            canvasHeight = image.height;
        } catch (error) {
            console.error('Error loading custom background image:', error);
        }
    }

    const canvasInstance = createCanvas(canvasWidth, canvasHeight);
    const ctx: any = canvasInstance.getContext('2d');

    if (!ctx) {
        throw new Error('Unable to get 2D rendering context from canvas');
    }

    applyRotation(ctx, canvas.rotation || 0, canvas.x || 0, canvas.y || 0, canvasWidth, canvasHeight);

    applyShadow(ctx, canvas.shadow, canvas.x || 0, canvas.y || 0, canvasWidth, canvasHeight);

    if (typeof borderRadius === 'string') {
        circularBorder(ctx, canvasWidth, canvasHeight);
    } else if (typeof borderRadius === 'number') {
        radiusBorder(ctx, canvas.x || 0, canvas.y || 0, canvasWidth, canvasHeight, borderRadius);
    }

    if (canvas.customBg) {
        await customBackground(ctx, canvas);
    } else if (canvas.gradientBg) {
        await drawBackgroundGradient(ctx, canvas);
    } else {
        await drawBackgroundColor(ctx, canvas);
    }

    applyStroke(ctx, canvas.stroke, canvas.x || 0, canvas.y || 0, canvasWidth, canvasHeight);

    return canvasInstance.toBuffer('image/png');
  }

    async createImage(images: ImageProperties[], canvasBuffer: Buffer): Promise<Buffer> {

        if (!canvasBuffer) {
            throw new Error('You need to provide your canvasConfig. Check documentation if you don\'t know.');
        }
        const existingCanvas: any = await loadImage(canvasBuffer);
        
        if (!existingCanvas) {
            throw new Error('Either buffer or canvasConfig is an empty background with no properties');
        }

        const canvas = createCanvas(existingCanvas.width, existingCanvas.height);
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            throw new Error('Unable to get 2D rendering context from canvas');
        }

        ctx.drawImage(existingCanvas, 0, 0);

        for (const image of images) {
            await this.drawImage(ctx, image);
        }
       
        return canvas.toBuffer('image/png');
    }

  async createText(textOptionsArray: TextObject[], buffer: Buffer): Promise<Buffer> {
    try {
        const existingImage = await loadImage(buffer);

        if (!existingImage) throw new Error("Invalid image buffer. Make sure to pass a valid canvas buffer.");

        const canvas = createCanvas(existingImage.width, existingImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(existingImage, 0, 0);

        for (const textOptions of textOptionsArray) {
            const mergedTextOptions = textOptions;

            if (mergedTextOptions.fontPath) {
               
                GlobalFonts.registerFromPath(
                  path.join(process.cwd(), mergedTextOptions.fontPath),
                    mergedTextOptions.fontName,
                  );
            }

            drawText(ctx, mergedTextOptions);
        }

        return canvas.toBuffer("image/png");
    } catch (error) {
        console.error("Error loading existing image:", error);
        throw new Error("Invalid image buffer");
    }
  }


  async createCustom(buffer: Buffer, options: CustomOptions[]): Promise<Buffer> {
    try {
        const existingImage = await loadImage(buffer);

        if (!existingImage) throw new Error("Invalid image buffer. Make sure to pass a valid canvas buffer.");

        const canvas = createCanvas(existingImage.width, existingImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(existingImage, 0, 0);

        customLines(ctx, options)

        return canvas.toBuffer("image/png");
    } catch (error) {
        console.error("Error creating custom image:", error);
        throw new Error("Failed to create custom image");
    }
}

  async crop(data: cropOptions): Promise<any> {

  }

  async createGIF(images: ImageObject[], options: GIFOptions): Promise<GIFResults | any> {
    async function resizeImage(image: any, targetWidth: number, targetHeight: number) {
      const canvas = createCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      return canvas;
    }

    function createOutputStream(outputFile: any) {
      return fs.createWriteStream(outputFile);
    }

    function createBufferStream(): Writable & { getBuffer: () => Buffer } {
      const bufferStream = new PassThrough();
      const chunks: Buffer[] = [];
    
      bufferStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
    
      const customBufferStream = bufferStream as unknown as Writable & { getBuffer: () => Buffer };
      customBufferStream.getBuffer = function(): Buffer {
        return Buffer.concat(chunks);
      };
    
      console.log(`buffer get: ${{customBufferStream}}`)
      return customBufferStream;
    }
    
    function validateOptions(options: any) {
      if (options.outputFormat === "file" && !options.outputFile) {
        throw new Error(
          "Output file path is required when using file output format.",
        );
      }

      if (
        options.repeat !== undefined &&
        (typeof options.repeat !== "number" || options.repeat < 0)
      ) {
        throw new Error("Repeat must be a non-negative number or undefined.");
      }

      if (
        options.quality !== undefined &&
        (typeof options.quality !== "number" ||
          options.quality < 1 ||
          options.quality > 20)
      ) {
        throw new Error(
          "Quality must be a number between 1 and 20 or undefined.",
        );
      }

      if (options.canvasSize) {
        if (
          options.canvasSize.width !== undefined &&
          (!Number.isInteger(options.canvasSize.width) ||
            options.canvasSize.width <= 0)
        ) {
          throw new Error(
            "Canvas width must be a positive integer or undefined.",
          );
        }

        if (
          options.canvasSize.height !== undefined &&
          (!Number.isInteger(options.canvasSize.height) ||
            options.canvasSize.height <= 0)
        ) {
          throw new Error(
            "Canvas height must be a positive integer or undefined.",
          );
        }
      }

      if (
        options.delay !== undefined &&
        (!Number.isInteger(options.delay) || options.delay <= 0)
      ) {
        throw new Error("Delay must be a positive integer or undefined.");
      }

      if (
        options.watermark !== undefined &&
        typeof options.watermark !== "boolean"
      ) {
        throw new Error("Watermark must be a boolean or undefined.");
      }

      if (options.textOverlay !== undefined) {
        if (
          !options.textOverlay.text ||
          typeof options.textOverlay.text !== "string"
        ) {
          throw new Error(
            "Text overlay text is required and must be a string.",
          );
        }

        if (
          options.textOverlay.fontName !== undefined &&
          typeof options.textOverlay.fontName !== "string"
        ) {
          throw new Error(
            "Text overlay fontName must be a string or undefined.",
          );
        }

        if (
          options.textOverlay.fontPath !== undefined &&
          typeof options.textOverlay.fontPath !== "string"
        ) {
          throw new Error(
            "Text overlay fontPath must be a string or undefined.",
          );
        }

        if (
          options.textOverlay.fontSize !== undefined &&
          (!Number.isInteger(options.textOverlay.fontSize) ||
            options.textOverlay.fontSize <= 0)
        ) {
          throw new Error(
            "Text overlay fontSize must be a positive integer or undefined.",
          );
        }

        if (
          options.textOverlay.fontColor !== undefined &&
          typeof options.textOverlay.fontColor !== "string"
        ) {
          throw new Error(
            "Text overlay fontColor must be a string or undefined.",
          );
        }
      }
    }
    function validateImageObject(imageObject: any) {
      return (
        imageObject &&
        typeof imageObject === "object" &&
        "source" in imageObject &&
        "isRemote" in imageObject
      );
    }

    function validateImages(images: any) {
      if (!Array.isArray(images)) {
        throw new Error('The "images" parameter must be an array.');
      }

      if (images.length === 0) {
        throw new Error(
          'The "images" array must contain at least one image object.',
        );
      }

      for (const imageObject of images) {
        if (!validateImageObject(imageObject)) {
          throw new Error(
            'Each image object must have "source" and "isRemote" properties.',
          );
        }
      }
    }

    try {
      validateOptions(options);
      validateImages(images);

      const canvasWidth = options.width || 1200;
      const canvasHeight = options.height || 1200;

      const encoder = new GIFEncoder(canvasWidth, canvasHeight);
      const outputStream = options.outputFile
        ? createOutputStream(options.outputFile)
        : createBufferStream();
      
      encoder.createReadStream().pipe(outputStream);
      
      encoder.start();
      encoder.setRepeat(options.repeat || 0);
      encoder.setQuality(options.quality || 10);
      encoder.setDelay(options.delay || 3000);
      
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext("2d");
      
      for (const imageInfo of images) {
        const image = imageInfo.isRemote
          ? await loadImage(imageInfo.source)
          : await loadImage(imageInfo.source);
      
        const resizedImage = await resizeImage(
          image,
          canvasWidth,
          canvasHeight,
        );
      
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(resizedImage, 0, 0);
      
        if (options.watermark?.enable) {
          const watermark = await loadImage(options.watermark?.url);
          if (!watermark) throw new Error("Invalid watermark url");
          ctx.drawImage(watermark, 10, canvasHeight - watermark.height - 10);
        }
      
        if (options.textOverlay) {
          const textOptions = options.textOverlay;
          const fontPath = textOptions.fontPath;
          const fontName = textOptions.fontName || "Arial";
          const fontSize = textOptions.fontSize || 20;
          const fontColor = textOptions.fontColor || "white";
          const x = textOptions.x || 10;
          const y = textOptions.y || 30;
      
          if (fontPath) {
            GlobalFonts.registerFromPath(
              path.join(options.basDir, fontPath),
              fontName,
            );
          }
      
          ctx.font = `${fontSize}px ${fontName}`;
          ctx.fillStyle = fontColor;
          ctx.fillText(textOptions.text, x, y);
        }
      
        encoder.addFrame(ctx as any);
      }
      
      encoder.finish();
      outputStream.end();
      if (options.outputFormat === "file") {
        if (!options.outputFile) {
          throw new Error("Please provide a valid file path");
        }
        await new Promise((resolve) => outputStream.on("finish", resolve));
      } else if (options.outputFormat === "base64") {
        outputStream.on("finish", () => {
        });
      
        if ('getBuffer' in outputStream) {
          return outputStream.getBuffer().toString("base64");
        } else {
          throw new Error("outputStream does not have getBuffer method");
        }
      } else if (options.outputFormat === "attachment") {
        outputStream.on("finish", () => {
        });
      
        const gifStream = encoder.createReadStream();
        return [{ attachment: gifStream, name: "gif.js" }];
      } else if (options.outputFormat === "buffer") {
        outputStream.on("finish", () => {
        });
        if ('getBuffer' in outputStream) {
          return outputStream.getBuffer();
        } else {
          throw new Error("outputStream does not have getBuffer method");
        }
      } else {
        throw new Error(
          "Error: Please provide a valid format: 'buffer', 'base64', 'attachment', or 'output/file/path'.",
        );
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async resize(resizeOptions: { imagePath: string | Buffer; size: { width: number; height: number } }) {
    return resizingImg(resizeOptions)
  }

  async imgConverter(imagePath: string, newExtension: string) {
    return converter(imagePath, newExtension)
  }

  async processImage(imagePath: string, filters: any[]) {
    return imgEffects(imagePath, filters)
  }

  async colorsFilter(imagePath: string, filterColor: string) {
    return applyColorFilters(imagePath, filterColor)
  }

  async colorAnalysis(imagePath: string) {
    return detectColors(imagePath)
  }

  async colorsRemover(imagePath: string, colorToRemove: { red: number, green: number, blue: number }) {
    return removeColor(imagePath, colorToRemove)
  }

  async removeBackground(imageURL: string, apiKey: string) {
    return bgRemoval(imageURL, apiKey)
  }

  async createChart(data: any, type: { chartType: string, chartNumber: number}) {

    if (!data || Object.keys(data).length === 0) {
        throw new Error('You need to provide datasets to create charts.');
    }

    if (!type || !type.chartNumber || !type.chartType) {
        throw new Error('Type arguments are missing.');
    }

    const { chartType, chartNumber } = type;

    switch (chartType.toLowerCase()) {
        case 'bar':
            switch (chartNumber) {
                case 1:
                    return await verticalBarChart(data);
                case 2:
                    throw new Error('Type 2 is still under development.');
                default:
                    throw new Error('Invalid chart number for chart type "bar".');
            }
        case 'line':
            switch (chartNumber) {
                case 1:
                    return await lineChart(data);
                case 2:
                    throw new Error('Type 2 is still under development.');
                default:
                    throw new Error('Invalid chart number for chart type "line".');
            }
        case 'pie':
            switch (chartNumber) {
                case 1:
                    return await pieChart(data);
                case 2:
                    throw new Error('Type 2 is still under development.');
                default:
                    throw new Error('Invalid chart number for chart type "pie".');
            }
        default:
            throw new Error(`Unsupported chart type "${chartType}".`);
    }
  }


  async  cropImage(options: cropOptions): Promise<Buffer> {
    try {
      if (!options.imageSource) throw new Error('The "imageSource" option is needed. Please provide the path to the image to crop.');
      if (!options.coordinates || options.coordinates.length < 3) throw new Error('The "coordinates" option is needed. Please provide coordinates to crop the image.');

      if (options.crop === 'outer') {
          return await cropOuter(options);
      } else if (options.crop === 'inner') {
          return await cropInner(options);
      } else {
          throw new Error('Invalid crop option. Please specify "inner" or "outer".');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }

  private async drawImage(ctx: any, image: ImageProperties): Promise<void> {
    const { source, x, y, width, height, rotation, borderRadius, stroke, shadow, isFilled, color, gradient } = image;

    if (!source || typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
        throw new Error('Invalid image properties');
    }

    try {
        let img: any;
        const shapeNames = ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'heptagon', 'octagon', 'star', 'kite'];
        const isShape = shapeNames.includes(source.toLowerCase());

        if (source.startsWith('http')) {
            const response = await fetch(source);
            if (!response.ok) {
                throw new Error("Failed to fetch image.");
            }
            const buffer = await response.arrayBuffer();
            img = await loadImage(Buffer.from(buffer));
        } else if (isShape) {
            drawShape(ctx, { source, x, y, width, height, rotation, borderRadius, stroke, shadow, isFilled, color, gradient });
        } else {
            const imagePath = path.join(process.cwd(), source);
            try {
                img = await loadImage(imagePath);
            } catch (e: any) {
                throw new Error(`Error loading image: ${e.message}`);
            }
        }

        if (img !== undefined) {
            ctx.save();
            applyRotation(ctx, rotation || 0, x, y, width, height);
            applyShadow(ctx, shadow, x, y, width, height);
            imageRadius(ctx, img, x, y, width, height, borderRadius || 0);
            applyStroke(ctx, stroke, x, y, width, height);
            ctx.restore();
        } else {
            if (!isShape) {
                throw new Error('Invalid image source or shape name');
            }
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
  
  }
  public validHex(hexColor: string): any {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    if (!hexPattern.test(hexColor)) {
        throw new Error("Invalid hexadecimal color format. It should be in the format '#RRGGBB'.");
    }
    return true
  }
}