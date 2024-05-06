import { Hercai } from "hercai";
import translate from "@iamtraction/google-translate";
import { createWorker, recognize } from "tesseract.js";
import { chunkString } from "./chunkString";
import { aiImagine } from "./draw";
import fs from "fs";

const herc = new Hercai();
let isProcessing = false;
type ChatModelOption = "v3" | "v3-32k" | "turbo" | "turbo-16k" | "gemini";

async function aiVoice(
  message: any,
  numOfImages: number,
  finalText: string,
  hercai: any,
  drawValid: any,
  imageModal: string,
  chatModal: string | "v3" | "v3-32k" | "turbo" | "turbo-16k" | "gemini" | "starChat" | "apexChat" | 'gemma-v3' | 'gemma-v4' | 'zephyr-beta' | undefined,
  voiceModal: string,
  voice_code: string,
  type: string,
  apiKey: string,
  nsfw: boolean,
  nsfwKeyWords: string[]
) {
  if (message.author.bot || isProcessing || !message.guild) {
    return;
  }

  isProcessing = true;

  try {
    let msg = message.content;

    if (drawValid) {
      return await aiImagine(message, numOfImages, finalText, hercai, imageModal, nsfw, nsfwKeyWords);
    }

    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      const imageUrl = attachment.url;
      const worker = await createWorker();
      const { data: { text } } = await recognize(imageUrl);
      await worker.terminate();
      msg += "\n" + text;
    }

    msg = (await herc.question({
      model: chatModal as ChatModelOption,
      content: msg,
    })).reply.replace(/\n/g, " ");

    if (voiceModal === "google") {
      if (!isEnglish(msg)) {
        const translationResult = await translate(msg, {
          from: "auto",
          to: "en",
        });
        msg = translationResult.text;
      }

      const chunks = chunkString(msg, 200);
      let delay = 0;

      for (const chunk of chunks) {
        setTimeout(async () => {
          const encodedChunk = encodeURIComponent(chunk);
          const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedChunk}`;
          const response = await fetch(url, {
            headers: {
              Referer: "http://translate.google.com/",
              "User-Agent": "stagefright/1.2 (Linux;Android 5.0)",
            },
          });
          const blob = await response.blob();
          const file = new File([blob], "respond.mp3");
          await message.reply({
            files: [file],
            allowedMentions: { repliedUser: false },
          });
        }, delay);
        delay += 3000;
      }
    } else if (voiceModal === "apexAI") {
      if (!apiKey) {
        throw new Error('Error: The apexAI model requires a premium account for generation. Please visit our support server at https://discord.gg/4uhpr7w8wW for assistance.');
      }

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "text-to-speech-neural-google.p.rapidapi.com",
        },
        body: JSON.stringify({
          audioFormat: "ogg",
          paragraphChunks: [msg],
          voiceParams: {
            name: `Wavenet-${type || "c"}`,
            engine: "google",
            languageCode: "en-US",
          },
        }),
      };

      try {
        const response = await fetch("https://text-to-speech-neural-google.p.rapidapi.com/generateAudioFiles", options);
        const audioData = await response.json();
        fs.writeFileSync("output.ogg", Buffer.from(audioData.audioStream, "base64"));
        await message.reply({
          files: [
            {
              attachment: "output.ogg",
              name: "respond.ogg",
            },
          ],
          allowedMentions: { repliedUser: false },
        });
      } catch (error) {
        console.error(error);
        throw new Error('Error generating audio file.');
      }
    } else if (imageModal === "zenithAi") {
      if (!apiKey) {
        throw new Error('Error: The zenithAi model requires a premium account for generation. Please visit our support server at https://discord.gg/4uhpr7w8wW for assistance.');
      }

      const encodedParams = new URLSearchParams();
      encodedParams.set("voice_code", voice_code || "en-US-3");
      encodedParams.set("text", msg);
      encodedParams.set("speed", "1.00");
      encodedParams.set("pitch", "1.00");
      encodedParams.set("output_type", "audio_url");

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "cloudlabs-text-to-speech.p.rapidapi.com",
        },
        body: encodedParams.toString(),
      };

      try {
        const response = await fetch("https://cloudlabs-text-to-speech.p.rapidapi.com/synthesize", options);
        const { result: { audio_url } } = await response.json();
        await message.reply(audio_url, {
          allowedMentions: { repliedUser: false },
        });
      } catch (error) {
        console.error(error);
        throw new Error('Error generating audio URL.');
      }
    }
  } catch (error: any) {
    console.error(error.message);
    message.reply("The response of the bot was too long and couldn't be sent as a voice.");
  } finally {
    isProcessing = false;
  }
}

function isEnglish(str: string) {
  return /^[A-Za-z0-9!@#$%^&()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(str);
}

export { aiVoice };
