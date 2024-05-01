import { ApexPainter } from "../../utils";

const apexPainter = new ApexPainter();

async function filters(Apex: any) {
  Apex.on("interactionCreate", async (a: any) => {
    try {
    if (!a.isModalSubmit()) return;
    const submitId = a.customId;

    if (submitId === "resizing_image_zenithmodal") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        const width = a.fields.getTextInputValue("modal_resizingImage_width");
        const height = a.fields.getTextInputValue("modal_resizingImage_height");

        try {
          const resizedBuffer = await apexPainter.resize({
            imagePath: imageURL,
            size: { width: parseInt(width, 10), height: parseInt(height, 10) },
          });
          await a.editReply({
            content: "Resized Image:",
            files: [resizedBuffer],
            ephemeral: true,
          });
        } catch (error) {
          console.error("Error resizing image:", error);
          await a.editReply({
            content: "Failed to resize image",
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Color_Filters") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        const hexColor = a.fields.getTextInputValue("color_filter_image");

         apexPainter.validHex(hexColor);

        try {
          const filteredBuffer = await apexPainter.colorsFilter(
            imageURL,
            hexColor,
          );
          await a.editReply({
            content: "Filtered Image:",
            files: [filteredBuffer],
            ephemeral: true,
          });
        } catch (error) {
          console.error("Error applying color filter:", error);
          await a.editReply({
            content:
              "Failed to apply color filter. Note: colors need to be in hex code format.",
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Convert_Image_Extension") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        const imageType = a.fields.getTextInputValue("image_type");

        try {
          const convertedBuffer = await apexPainter.imgConverter(
            imageURL,
            imageType,
          );
          await a.editReply({
            content: "Converted Image:",
            files: [convertedBuffer],
            ephemeral: true,
          });
        } catch (error) {
          console.error("Error converting image extension:", error);
          await a.editReply({
            content: "Failed to convert image extension",
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Image_Brightness") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        const brightnessDegree =
          a.fields.getTextInputValue("brightness_degree");

        if (brightnessDegree < 0 || brightnessDegree > 1) {
          return await a.editReply({
            content: "Value must be between 0-1",
            ephemeral: true,
          });
        }

        try {
          const processedBuffer = await apexPainter.processImage(imageURL, [
            { type: "brightness", value: parseFloat(brightnessDegree) },
          ]);

          await a.editReply({
            content: "Brightness Adjusted Image:",
            files: [processedBuffer],
            ephemeral: true,
          });
        } catch (error) {
          console.error("Error adjusting image brightness:", error);
          await a.editReply({
            content: "Failed to adjust image brightness",
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Sepia_Filter") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        try {
          const processedBuffer = await apexPainter.processImage(imageURL, [
            { type: "sepia" },
          ]);
          await a.editReply({
            content: "Applied Sepia Image:",
            files: [processedBuffer],
            ephemeral: true,
          });
        } catch (error) {
          console.error("Error applying sepia:", error);
          await a.editReply({
            content: "Failed to apply sepia filter",
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Pixelate_Filter") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        const xy = a.fields.getTextInputValue("Pixelate_XY");
        const wh = a.fields.getTextInputValue("Pixelate_WH");
        const size = a.fields.getTextInputValue("Pixelate_Size");

        try {
          const xyArray = xy
            .split(",")
            .map((coord: any) => parseInt(coord.trim(), 10));
          const whArray = wh
            .split(",")
            .map((coord: any) => parseInt(coord.trim(), 10));

          if (
            xyArray.length !== 2 ||
            whArray.length !== 2 ||
            xyArray.some(isNaN) ||
            whArray.some(isNaN)
          ) {
            throw new Error(
              'Invalid format for xy or wh. Use the format "x, y" and "width, height" with valid integer values.',
            );
          }

          const [x, y] = xyArray;
          const [width, height] = whArray;

          const processedBuffer = await apexPainter.processImage(imageURL, [
            {
              type: "pixelate",
              size: parseInt(size, 10),
              x,
              y,
              w: width,
              h: height,
            },
          ]);
          await a.editReply({
            content: "Pixelated Image:",
            files: [processedBuffer],
            ephemeral: true,
          });
        } catch (error: any) {
          console.error("Error applying pixelate filter:", error);
          await a.editReply({
            content: "Failed to apply pixelate filter: " + error.message,
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Image_Blur") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        const blurRadius = a.fields.getTextInputValue("blur_radius");

        if (blurRadius < 0 || blurRadius > 100) {
          return await a.editReply({
            content: "Value must be between 0-100",
            ephemeral: true,
          });
        }

        try {
          const processedBuffer = await apexPainter.processImage(imageURL, [
            { type: "blur", radius: parseFloat(blurRadius) },
          ]);
          await a.editReply({
            content: "Blurred Image:",
            files: [processedBuffer],
            ephemeral: true,
          });
        } catch (error: any) {
          console.error("Error applying blur filter:", error);
          await a.editReply({
            content: "Failed to apply blur filter: " + error.message,
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Image_Fade") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        const fadeFactor = a.fields.getTextInputValue("fade_factor");

        if (fadeFactor < 0 || fadeFactor > 1) {
          return await a.editReply({
            content: "Value must be between 0-1",
            ephemeral: true,
          });
        }

        try {
          const processedBuffer = await apexPainter.processImage(imageURL, [
            { type: "fade", factor: parseFloat(fadeFactor) },
          ]);
          await a.editReply({
            content: "Faded Image:",
            files: [processedBuffer],
            ephemeral: true,
          });
        } catch (error: any) {
          console.error("Error applying fade filter:", error);
          await a.editReply({
            content: "Failed to apply fade filter: " + error.message,
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Image_Opaque") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        try {
          const processedBuffer = await apexPainter.processImage(imageURL, [
            { type: "opaque" },
          ]);
          await a.editReply({
            content: "Opaque Image:",
            files: [processedBuffer],
            ephemeral: true,
          });
        } catch (error: any) {
          console.error("Error applying opaque filter:", error);
          await a.editReply({
            content: "Failed to apply opaque filter: " + error.message,
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Image_GrayScale") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        try {
          const processedBuffer = await apexPainter.processImage(imageURL, [
            { type: "greyscale" },
          ]);
          await a.editReply({
            content: "Grayscale Image:",
            files: [processedBuffer],
            ephemeral: true,
          });
        } catch (error: any) {
          console.error("Error applying grayscale filter:", error);
          await a.editReply({
            content: "Failed to apply grayscale filter: " + error.message,
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    } else if (submitId === "Image_Contrast") {
      await a.deferReply({ ephemeral: true });

      const imagePosition = parseInt(
        a.fields.getTextInputValue("Image_Postion"),
        10,
      );

      const interactionMessage = await a.message.fetch();
      const attachmentsArray = Array.from(
        interactionMessage.attachments.values(),
      );

      const totalAttachments = attachmentsArray.length;

      if (imagePosition >= 1 && imagePosition <= totalAttachments) {
        const selectedAttachment = attachmentsArray[imagePosition - 1] as any;
        const imageURL = selectedAttachment.url;

        const contrastValue = a.fields.getTextInputValue("Contrast_Value");

        if (contrastValue < 0 || contrastValue > 2) {
          return await a.editReply({
            content: "Value must be between 0-2",
            ephemeral: true,
          });
        }

        try {
          const processedBuffer = await apexPainter.processImage(imageURL, [
            { type: "contrast", value: parseFloat(contrastValue) },
          ]);
          await a.editReply({
            content: "Contrasted Image:",
            files: [processedBuffer],
            ephemeral: true,
          });
        } catch (error: any) {
          console.error("Error applying contrast filter:", error);
          await a.editReply({
            content: "Failed to apply contrast filter: " + error.message,
            ephemeral: true,
          });
        }
      } else {
        await a.editReply({
          content: `Invalid image position. Please select a position between 1 and ${totalAttachments}.`,
          ephemeral: true,
        });
      }
    }
   } catch (error: any) {}
  });
}

export { filters };