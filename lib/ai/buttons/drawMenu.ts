async function imageTools(
    Apex: any,
    ModalBuilder: any,
    TextInputBuilder: any,
    TextInputStyle: any,
    ActionRowBuilder: any,
  ): Promise<void> {
    Apex.on("interactionCreate", async (a: any) => {
      if (!a.isStringSelectMenu()) return;
      const MenuId: string = a.customId;
      const selectedOptionId: string = a.values[0];
      try {
      if (MenuId === "image_processing_select") {
        if (selectedOptionId === "process_1") {
          const modal = new ModalBuilder()
            .setCustomId("resizing_image_zenithmodal")
            .setTitle("Resizing Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to resize (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const imageWidth = new TextInputBuilder()
            .setCustomId("modal_resizingImage_width")
            .setLabel("Image Width")
            .setStyle(TextInputStyle.Short);
  
          const imageHeight = new TextInputBuilder()
            .setCustomId("modal_resizingImage_height")
            .setLabel("Image Height")
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
          const secondActionRow = new ActionRowBuilder().addComponents(
            imageWidth,
          );
          const thirddActionRow = new ActionRowBuilder().addComponents(
            imageHeight,
          );
  
          modal.addComponents(firstActionRow, secondActionRow, thirddActionRow);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_2") {
          const modal = new ModalBuilder()
            .setCustomId("Color_Filters")
            .setTitle("Coloring An Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to apply filter on (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const color = new TextInputBuilder()
            .setCustomId("color_filter_image")
            .setLabel("Color Filter")
            .setMaxLength(7)
            .setPlaceholder("Color in hex code (e.g => #00ff00 for green)")
            .setMinLength(7)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
          const secondActionRow = new ActionRowBuilder().addComponents(color);
  
          modal.addComponents(firstActionRow, secondActionRow);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_3") {
          const modal = new ModalBuilder()
            .setCustomId("Convert_Image_Extension")
            .setTitle("Convert An Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to convert (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const imageType = new TextInputBuilder()
            .setCustomId("image_type")
            .setLabel("Image Extension")
            .setMaxLength(5)
            .setPlaceholder(
              "Type extensions (e.g => (png), (jpg), (webp), (avif) )",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
          const secondActionRow = new ActionRowBuilder().addComponents(
            imageType,
          );
  
          modal.addComponents(firstActionRow, secondActionRow);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_4") {
          const modal = new ModalBuilder()
            .setCustomId("Image_Brightness")
            .setTitle("Brightening An Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to brighten (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const brightnessDegree = new TextInputBuilder()
            .setCustomId("brightness_degree")
            .setLabel("Brightness Degree")
            .setMaxLength(5)
            .setPlaceholder(
              "Brightness value (e.g => 0 -> 1 (3 decimal places are accepted))",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
          const secondActionRow = new ActionRowBuilder().addComponents(
            brightnessDegree,
          );
  
          modal.addComponents(firstActionRow, secondActionRow);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_5") {
          const modal = new ModalBuilder()
            .setCustomId("Sepia_Filter")
            .setTitle("Apply Sepia On Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to apply Sepia on (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
  
          modal.addComponents(firstActionRow);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_6") {
          const modal = new ModalBuilder()
            .setCustomId("Pixelate_Filter")
            .setTitle("Apply Pixelate On Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to apply Pixelate on (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const xyInput = new TextInputBuilder()
            .setCustomId("Pixelate_XY")
            .setLabel("X, Y Positions")
            .setPlaceholder("Enter X, Y positions (e.g => (100, 150) )")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const whInput = new TextInputBuilder()
            .setCustomId("Pixelate_WH")
            .setLabel("Width, Height")
            .setPlaceholder("Enter width, height (e.g => (50, 50) )")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const sizeInput = new TextInputBuilder()
            .setCustomId("Pixelate_Size")
            .setLabel("Pixelate Size")
            .setPlaceholder("Enter pixelate size")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const st = new ActionRowBuilder().addComponents(imagePos);
          const nd = new ActionRowBuilder().addComponents(xyInput);
          const rd = new ActionRowBuilder().addComponents(whInput);
          const th = new ActionRowBuilder().addComponents(sizeInput);
  
          modal.addComponents(st, nd, rd, th);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_7") {
          const modal = new ModalBuilder()
            .setCustomId("Image_Blur")
            .setTitle("Blurring An Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to blur (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const blurDegree = new TextInputBuilder()
            .setCustomId("blur_radius")
            .setLabel("Blurring Radius")
            .setMaxLength(5)
            .setPlaceholder("Blur value (e.g => (value = 1-100 as max) )")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
          const secondActionRow = new ActionRowBuilder().addComponents(
            blurDegree,
          );
  
          modal.addComponents(firstActionRow, secondActionRow);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_8") {
          const modal = new ModalBuilder()
            .setCustomId("Image_Fade")
            .setTitle("Fading An Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to fade (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const fadeDegree = new TextInputBuilder()
            .setCustomId("fade_factor")
            .setLabel("Fade By Factor")
            .setMaxLength(5)
            .setPlaceholder("Fade value (e.g => (value = 0-1 as max) )")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
          const secondActionRow = new ActionRowBuilder().addComponents(
            fadeDegree,
          );
  
          modal.addComponents(firstActionRow, secondActionRow);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_9") {
          const modal = new ModalBuilder()
            .setCustomId("Image_Opaque")
            .setTitle("Opaque An Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to opaque (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
  
          modal.addComponents(firstActionRow);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_10") {
          const modal = new ModalBuilder()
            .setCustomId("Image_GrayScale")
            .setTitle("GrayScale An Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to apply grayscale on (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
  
          modal.addComponents(firstActionRow);
  
          await a.showModal(modal);
        } else if (selectedOptionId === "process_11") {
          const modal = new ModalBuilder()
            .setCustomId("Image_Contrast")
            .setTitle("Contrast An Image");
  
          const imagePos = new TextInputBuilder()
            .setCustomId("Image_Postion")
            .setLabel("Image Number")
            .setMaxLength(1)
            .setMinLength(1)
            .setPlaceholder(
              "Modal you want to apply contrast on (e.g => 1st image/2nd image/3rd image/4th image)",
            )
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const contrastValue = new TextInputBuilder()
            .setCustomId("Contrast_Value")
            .setLabel("Contrast Value")
            .setMaxLength(4)
            .setPlaceholder("Contrast value (e.g => (value = 0-2 as max) )")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
  
          const firstActionRow = new ActionRowBuilder().addComponents(imagePos);
          const secondActionRow = new ActionRowBuilder().addComponents(
            contrastValue,
          );
  
          modal.addComponents(firstActionRow, secondActionRow);
  
          await a.showModal(modal);
        }
      }
      } catch (error: any) {}
    });
  }
  
  export { imageTools };  
  