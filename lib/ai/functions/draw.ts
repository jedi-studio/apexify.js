import translate from "@iamtraction/google-translate";
import sharp from "sharp";
import { ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, AttachmentData } from "discord.js";
import axios from "axios";
import api from "api";

const sdk: any = api("@prodia/v1.3.0#be019b2kls0gqss3"); 
sdk.auth("43435e1c-cab1-493f-a224-f51e4b97ce8d");

const validHercaiModals = [
  "v1",
  "v2",
  "v2-beta",
  "lexica",
  "prodia",
  "animefy",
  "raava",
  "shonin",
  "v3",
];

const validProdiaModals = [
  "3Guofeng3_v34.safetensors [50f420de]",
  "absolutereality_V16.safetensors [37db0fc3]",
  "absolutereality_v181.safetensors [3d9d4d2b]",
  "amIReal_V41.safetensors [0a8a2e61]",
  "analog-diffusion-1.0.ckpt [9ca13f02]",
  "anythingv3_0-pruned.ckpt [2700c435]",
  "anything-v4.5-pruned.ckpt [65745d25]",
  "anythingV5_PrtRE.safetensors [893e49b9]",
  "AOM3A3_orangemixs.safetensors [9600da17]",
  "blazing_drive_v10g.safetensors [ca1c1eab]",
  "cetusMix_Version35.safetensors [de2f2560]",
  "childrensStories_v13D.safetensors [9dfaabcb]",
  "childrensStories_v1SemiReal.safetensors [a1c56dbb]",
  "childrensStories_v1ToonAnime.safetensors [2ec7b88b]",
  "Counterfeit_v30.safetensors [9e2a8f19]",
  "cuteyukimixAdorable_midchapter3.safetensors [04bdffe6]",
  "cyberrealistic_v33.safetensors [82b0d085]",
  "dalcefo_v4.safetensors [425952fe]",
  "deliberate_v2.safetensors [10ec4b29]",
  "deliberate_v3.safetensors [afd9d2d4]",
  "dreamlike-anime-1.0.safetensors [4520e090]",
  "dreamlike-diffusion-1.0.safetensors [5c9fd6e0]",
  "dreamlike-photoreal-2.0.safetensors [fdcf65e7]",
  "dreamshaper_6BakedVae.safetensors [114c8abb]",
  "dreamshaper_7.safetensors [5cf5ae06]",
  "dreamshaper_8.safetensors [9d40847d]",
  "edgeOfRealism_eorV20.safetensors [3ed5de15]",
  "EimisAnimeDiffusion_V1.ckpt [4f828a15]",
  "elldreths-vivid-mix.safetensors [342d9d26]",
  "epicrealism_naturalSinRC1VAE.safetensors [90a4c676]",
  "ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]",
  "juggernaut_aftermath.safetensors [5e20c455]",
  "lofi_v4.safetensors [ccc204d6]",
  "lyriel_v16.safetensors [68fceea2]",
  "majicmixRealistic_v4.safetensors [29d0de58]",
  "mechamix_v10.safetensors [ee685731]",
  "meinamix_meinaV9.safetensors [2ec66ab0]",
  "meinamix_meinaV11.safetensors [b56ce717]",
  "neverendingDream_v122.safetensors [f964ceeb]",
  "openjourney_V4.ckpt [ca2f377f]",
  "pastelMixStylizedAnime_pruned_fp16.safetensors [793a26e8]",
  "portraitplus_V1.0.safetensors [1400e684]",
  "protogenx34.safetensors [5896f8d5]",
  "Realistic_Vision_V1.4-pruned-fp16.safetensors [8d21810b]",
  "Realistic_Vision_V2.0.safetensors [79587710]",
  "Realistic_Vision_V4.0.safetensors [29a7afaa]",
  "Realistic_Vision_V5.0.safetensors [614d1063]",
  "redshift_diffusion-V10.safetensors [1400e684]",
  "revAnimated_v122.safetensors [3f4fefd9]",
  "rundiffusionFX25D_v10.safetensors [cd12b0ee]",
  "rundiffusionFX_v10.safetensors [cd4e694d]",
  "sdv1_4.ckpt [7460a6fa]",
  "v1-5-pruned-emaonly.safetensors [d7049739]",
  "v1-5-inpainting.safetensors [21c7ab71]",
  "shoninsBeautiful_v10.safetensors [25d8c546]",
  "theallys-mix-ii-churned.safetensors [5d9225a4]",
  "timeless-1.0.ckpt [7c4971d4]",
  "toonyou_beta6.safetensors [980f6b15]",
];
async function aiImagine(
  message: any,
  numOfImages: number,
  textToDraw: string,
  hercai: any,
  imageModel: string,
  nsfw: boolean,
  nsfwKeyWords: string[],
) {
  const maxRetryAttempts = 3;
  const retryInterval = 10000;
  let response: any;
  async function retry(fn: any, retriesLeft = maxRetryAttempts) {
    try {
      return await fn();
    } catch (error: any) {
      if (retriesLeft === 0) {
        throw error;
      }
      console.error(
        `Retry failed, ${retriesLeft} attempts left. Error: ${error.message}`,
      );
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      return retry(fn, retriesLeft - 1);
    }
  }

  try {
    if (numOfImages > 4 || numOfImages <= 0) {
      throw new Error(
        `Number of images can't be greater than 4 or smaller than 0.`,
      );
    }

    await message.channel?.sendTyping();

    const translatedText = await retry(() =>
      translate(textToDraw, {
        from: "auto",
        to: "en",
      }),
    );

    const attachData: AttachmentData[] = [];
    const buttonsRow1: ButtonBuilder[] = [];
    const imageUrls: any = [];

    for (let _0x4d7fb6 = 0x0; _0x4d7fb6 < numOfImages; _0x4d7fb6++) {
      try {
        if (validHercaiModals.includes(imageModel)) {
          response = await retry(() =>
            hercai.drawImage({
              model: imageModel,
              prompt: translatedText.text,
            }),
          );
        } else if (validProdiaModals.includes(imageModel)) {
          const generateResponse = await sdk.generate({
            model: imageModel,
            prompt: translatedText.text,
          });

          await message.channel?.sendTyping();

          const generatedJobId = generateResponse.data.job;
          response = await checkJobStatus(generatedJobId);
        } else {
          throw new Error("Invalid modal name.");
        }
      } catch (error: any) {
        if (error.response && error.response.status === 429) {
          console.error("Too many requests. Please try again later.");
          return message.reply(`Please wait i am in a cool down for a minute`);
        } else if (error.response && error.response.status === 500) {
          console.error("Internal server error. Please try again later.");
          return message.reply(`Please wait i am in a cool down for a minute`);
        } else {
          await message.reply(`Please wait i am in a cool down for a minute`);
          throw new Error("Error processing message in file");
        }
      }
      let buffferedImage: any;

      if (imageModel === "v3") {
        const res = await retry(() =>
          axios.get(response.url, {
            responseType: "arraybuffer",
          }),
        );

        await message.channel?.sendTyping();

        buffferedImage = Buffer.from(res.data, "binary");

        const resizedImage = await sharp(buffferedImage)
          .resize({
            width: 0x320,
          })
          .toBuffer();

        const attachment = {
          file: resizedImage,
          name: `image_${_0x4d7fb6 + 1}.png`,
        } as AttachmentData;

        attachData.push(attachment);

        const urlButton = new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel(`Image ${_0x4d7fb6 + 1}`)
          .setURL(response.url);

        buttonsRow1.push(urlButton);

        imageUrls.push(response.url);
      } else {
        const imageUrl = response.url || response;

        await message.channel?.sendTyping();

        if (nsfw) {
          const textToCheck = await attemptImageCaptioning(imageUrl);
          
          const nsfwWords: string[] = [
            "anal",
            "arousal",
            "balls",
            "blowjob",
            "busty",
            "butt",
            "cameltoe",
            "climax",
            "clitoris",
            "cock",
            "crotch",
            "cum",
            "cumshot",
            "cunnilingus",
            "dirty",
            "dirtytalk",
            "dildo",
            "erect",
            "erogenous",
            "escort",
            "explicit",
            "facial",
            "fetish",
            "flirt",
            "foreplay",
            "genitals",
            "groin",
            "hardcore",
            "hardon",
            "horniness",
            "horny",
            "kamasutra",
            "kinky",
            "lewd",
            "lingerie",
            "lust",
            "lustful",
            "masturbate",
            "mature",
            "milf",
            "naughty",
            "naked",
            "nipples",
            "nude",
            "obscene",
            "oral",
            "orgasm",
            "penetration",
            "penis",
            "pleasure",
            "porn",
            "prostitute",
            "provocative",
            "pubic",
            "pussy",
            "seduce",
            "seductive",
            "sensual",
            "sex",
            "sexual",
            "sperm",
            "strip",
            "striptease",
            "swinger",
            "testicles",
            "thong",
            "threesome",
            "undies",
            "undress",
            "vagina",
            "vibrator",
            "wank",
            "wet",
            "hentai",
            "bdsm",
            "gay",
            "lesbian",
            "femboy",
            "ass",
          ];

        if (nsfwKeyWords.length > 0) {
         if (textToCheck && nsfwKeyWords.some(word => textToCheck?.includes(word))) {
          return message.reply("Warning ⚠️. The generated image contatining nsfw content. Turn off nsfw to sedn nsfw images.");
         } 
        }
          if (textToCheck && nsfwWords.some(word => textToCheck?.includes(word))) {
              return message.reply("Warning ⚠️. The generated image contatining nsfw content. Turn off nsfw to sedn nsfw images.");
          }
        }

        const attach = new AttachmentBuilder(
          imageUrl,
          { name: `image_${_0x4d7fb6 + 1}.png` },
        ) as AttachmentData; 

        attachData.push(attach);

        const urlButton = new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel(`Image ${_0x4d7fb6 + 1}`)
          .setURL(imageUrl);

        buttonsRow1.push(urlButton);

        imageUrls.push(imageUrl);
      }

      await new Promise((resolve) => setTimeout(resolve, 0x7d0));
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("image_processing_select")
      .setPlaceholder("Select Image Process");

    const options = [
      "Resizing",
      "Color Filters",
      "Convert Image Extension",
      "Brightness",
      "Sepia",
      "Pixelate",
      "Blur",
      "Fade",
      "Opaque",
      "Grayscale",
      "Contrast",
    ];

    options.forEach((option, index) => {
      const selectOption = new StringSelectMenuOptionBuilder()
        .setLabel(option)
        .setValue(`process_${index + 1}`);

      selectMenu.addOptions(selectOption);
    });

    await message.channel?.sendTyping();

    const row1 = new ActionRowBuilder().addComponents(
      ...buttonsRow1,
    );
    const row2 = new ActionRowBuilder().addComponents(selectMenu);

    await message.reply({
      files: attachData,
      components: [row1, row2],
      allowedMentions: { repliedUser: false },
    });

    return imageUrls;
  } catch (error: any) {
    console.error("Error in drawImage:", error.message);
    if (error.response) {
      console.error("Status code:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    message.reply({
      content: "An error occurred while processing the images.",
      allowedMentions: { repliedUser: false },
    });
    return [];
  }
}

async function checkJobStatus(jobId: number | string | any) {
  try {
    const getJobResponse = await sdk.getJob({ jobId });
    const jobData = getJobResponse.data;
    if (jobData.status === "generating" || jobData.status === "queued") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return checkJobStatus(jobId);
    } else if (jobData.status === "succeeded") {
      return jobData.imageUrl;
    } else {
      console.error("Job failed:", jobData);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function attemptImageCaptioning(imageUrl: string) {
  try {
    let retryCount = 0;
    const maxRetries = 3;

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base`,
          { image: imageUrl },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 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`,
            },
          },
        );

        if (response.status === 200) {
          return response.data[0].generated_text;
        } else {
          console.error(
            `Failed to fetch image captioning API: ${response.statusText}`,
          );
          return null;
        }
      } catch (error: any) {
        console.error(`Error fetching data: ${error.message}`);
        throw error;
      }
    };

    while (retryCount < maxRetries) {
      try {
        return await fetchData();
      } catch (error: any) {
        console.error(
          `Error fetching data (Retry ${retryCount + 1}): ${error.message}`,
        );
        retryCount++;
      }
    }

    return null;
  } catch (error: any) {
    console.error(`Error in attemptImageCaptioning: ${error.message}`);
    return null;
  }
}

export { aiImagine };