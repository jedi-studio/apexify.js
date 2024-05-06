import { Hercai } from "hercai";
const hercai = new Hercai()
import {
  imageReader,
  toDraw,
  aiImagine,
  aiVoice,
  readPdf,
  readTextFile,
  typeWriter,
  readImage,
} from "./utils";
import { 
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from "discord.js";
import { filters } from "./buttons/tools";
import { imageTools } from "./buttons/drawMenu";


export interface Options {
    voice?: {
       textVoice?:{
        enable?: boolean;
        voiceModal?: string;
        voice_code?: string;
        apiKey?: string;
        type?: string;
       };
    };
    imagine?: {
        enable?: boolean;
        drawTrigger?: string[];
        imageModal?: string;
        numOfImages?: number;
        nsfw?: {
          enable?: boolean;
          keywords?: string[];
        };
        enhancer?: boolean;
    };
    chat?: {
        chatModal?: string;
        readFiles?: boolean;
        readImages?: boolean;
        typeWriting?:{
          enable?: boolean;
          speed?: number;
          delay?: number;
        };
    };
    others?: {
        messageType: {
            type: string;
            intialContent: string;
        };
        keywords?: string[];
        keywordResponses?: Record<string, string>;
        loader?: {
            enable?: boolean;
            loadingMessage?: string;
            loadingTimer?: number;
        };
        channel?: {
          enable?: boolean;
          id?: string[];
        };
        permissions?: {
          enable?: boolean;
          role?: string[];
          permission?: string[];
          blockedUsers?: string[];
        };
    };
}

  type Response = string | { content?: string; reply?: string } | any;


export async function ApexAI (message: any, aiOptions: Options) {

  
  await imageTools(
    message.client,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
  );
  await filters(message.client);
  
    let usermsg: string = ''; 


    const {
      voice: {
          textVoice: {
              enable: textVoiceEnable = false,
              voiceModal: textVoiceModal = "google",
              voice_code: textVoiceCode = "en-US-3",
              apiKey: textVoiceApiKey = "",
              type: textVoiceType = "b"
          } = {}
      } = {},
      imagine: {
        enable: imagineEnable = false,
        drawTrigger = ["create", "رسم"],
        imageModal = "prodia",
        numOfImages = 2,
        nsfw: {
          enable: nsfwEnabled = false,
          keywords: nsfwKeyWords = []
      } = {}, 
        enhancer = false
    } = {},
      chat: {
          chatModal = "v3",
          readFiles = false,
          readImages = false,
          typeWriting: {
              enable: typeWritingEnable = false,
              speed = 70,
              delay = 2000
          } = {}
      } = {},
      others: {
          messageType: {
            type: msgType = 'reply',
            intialContent: msgContent = ''
          } = {},
          channel: {
              enable: channelEnable = false,
              id: channelIds = []
          } = {},
          keywords = [],
          keywordResponses = {},
          loader: {
              loadingMessage = 'loading...',
              loadingTimer = 3000,
              enable: loaderEnable = false
          } = {},
          permissions: {
              enable: permissionEnable = false,
              role = [],
              permission = [],
              blockedUsers = []
          } = {}
      } = {}
  } = aiOptions;

    if (permissionEnable) {

      if (role.length > 0) { 
          const userRoles = message.member?.roles.cache.map((role: any) => role.id);
          const hasPermission = userRoles.some((roleId: any) => role.includes(roleId));
          if (!hasPermission) return;
      } 

      if (permission.length > 0) {
        const hasPermission = permission.some(perm => message.member?.permissions.has(perm));
        if (!hasPermission) return;
    }

      if (blockedUsers.length > 0) {
        const userId = message.author.id;
         if (blockedUsers.includes(userId)) return;
      }
    }

     if (channelEnable && !channelIds.includes(message.channel.id)) return;

     await message.channel?.sendTyping();

        usermsg = message.content;  

     if (
        message.attachments.some((attachment: any) =>
          attachment.contentType.startsWith("audio/")
        )
      ) {
        return await message.reply({
          content: "Voice messages are not supported at the moment. Stay tuned for future updates!"
        });
      }
      const attachment = message.attachments?.first();
      const imgURL = attachment?.url || null;
      
      const validExtensions = /\.(png|jpg|jpeg|webp)$/i;
      
      if (attachment && validExtensions.test(attachment?.name)) {
          if (imgURL && !readImages) {
              usermsg += await imageReader(imgURL);
          } else if (imgURL && readImages) {
              usermsg += await readImage(imgURL);
          }
      }

   if (msgType === 'reply') {
     if (imgURL === null && usermsg === '') {
      return await message.reply({
        content: "You need to provide a message or an attachment at least.",
        allowedMentions: { repliedUser: false },
      });
    }
  } else if (msgType === 'send') {
    if (imgURL === null && usermsg === '') {
      return await message.channel.send({
        content: "You need to provide a message or an attachment at least.",
        allowedMentions: { repliedUser: false },
      });
    }
  }

     if (aiOptions.chat && readFiles) {
        if (message.attachments.size > 0) {
            if (attachment.name.endsWith('.pdf')) {
                const pdfContent = await readPdf(attachment.url);
                usermsg += pdfContent;
            } else {
                const txtContent = await readTextFile(attachment.url);
                usermsg += txtContent;
            }
        }
    }

     if (aiOptions.others?.loader !== null && loaderEnable === true) {
      if (msgType === 'reply') {
        await message.reply({
          content: loadingMessage,
          allowedMentions: { repliedUser: false },
        }).then((replyMessage: any) => {
          setTimeout(() => {
            replyMessage.delete().catch(console.error);
          }, loadingTimer || 3000);
        });
       } else if (msgType === 'send') {
        await message.channel.send({
          content: loadingMessage
        }).then((replyMessage: any) => {
          setTimeout(() => {
            replyMessage.delete().catch(console.error);
          }, loadingTimer || 3000);
        });
       }
      }

      await message.channel?.sendTyping();

      let replied: string = "";


      if (message.reference?.messageId) {
        const fetchedMessage = await message.guild.channels.cache
          .get(message.channel.id)
          .messages.fetch(message.reference?.messageId);
  
        if (fetchedMessage.content) {
          replied += fetchedMessage.content;
        }  
  
        if (fetchedMessage.attachments && validExtensions.test(fetchedMessage.attachments.name)) {
        if (imgURL && !readImages) {
          replied += await imageReader(fetchedMessage.attachments?.first().url);
        }  else if (imgURL && readImages) {
          usermsg += await readImage(fetchedMessage.attachments?.first().url);
        }
      }
        usermsg = `${usermsg}\n\n Read previous message: ${replied}`;
      }


      let response: Response = '';

  
      for (const keyword of keywords) {
        if (usermsg.toLowerCase().includes(keyword.toLowerCase())) {
          response = keywordResponses[keyword] || "";
          return await message.reply({
            content: response,
            allowedMentions: { repliedUser: false },
          });
        }
      }

      const drawValid: any = aiOptions.imagine && imagineEnable && toDraw(usermsg, drawTrigger);
      const number = numOfImages; 
      const modal = imageModal;

      if (drawValid) {

        if (enhancer) {
            usermsg += await gemmaAi_4(usermsg)
          }

        return await aiImagine(
          message,
          number,
          usermsg,
          hercai,
          modal,
          nsfwEnabled,
          nsfwKeyWords
        );

    } else if (aiOptions.voice) {
        
      if (aiOptions.voice.textVoice && textVoiceEnable) {
        return await aiVoice(
          message,
          numOfImages,
          usermsg,
          hercai,
          drawValid,
          modal,
          chatModal,
          textVoiceModal,
          textVoiceCode,
          textVoiceApiKey, 
          textVoiceType,
          nsfwEnabled,
          nsfwKeyWords
        );

      }
 
    if (msgType === 'reply') {
      if (usermsg.length >= 2000) {
        return await message.reply({
          content: 'Your message is too long for me to process. Please try sending a shorter message.',
          allowedMentions: { repliedUser: false },
      });
      } 
    } else if (msgType === 'send' ) {
      if (usermsg.length >= 2000) {
        return await message.channel.send({
          content: 'Your message is too long for me to process. Please try sending a shorter message.'
      });
      } 
    }
      } else {
        try { 
        if (chatModal === 'apexChat') {
            response = await apexai(usermsg);
        } else if (chatModal === 'gemma-v3') { 
            response = await gemmaAi_3(usermsg);
        } else if (chatModal === 'gemma-v4') { 
            response = await gemmaAi_4(usermsg);
        } else if (chatModal === 'starChat') {
            response = await starChat(usermsg);
        } else if (chatModal === 'zephyr-beta') {
            response = await zephyr_beta(usermsg);
        } else if (chatModal === 'v3' || chatModal === 'v3-32k' || chatModal === 'turbo' || chatModal === 'turbo-16k' || chatModal === 'gemini') {
                response = await hercai.question({
                    model: chatModal,
                    content: usermsg,
                });
                response = response.reply
            } else {
                throw new Error('Invalid chat modal. Check documentation for valid chat modals.')
            }
        } catch (error: any) {
          if (msgType === 'reply') {
            if (error.response && error.response.status === 429) {
                console.error("Too many requests. Please try again later.");
                return message.reply(`Please wait i am in a cool down for a minute`);
            } else if (error.response && error.response.status === 500) {
                console.error("Internal server error. Please try again later.");
                return message.reply(`Please wait i am in a cool down for a minute`);
            } else {
                await message.reply(`Please wait i am in a cool down for a minute`);
                console.error("The Api is on a cool down for 10 seconds", error.message);
            }
          } else if (msgType === 'send') {
            if (error.response && error.response.status === 429) {
              console.error("Too many requests. Please try again later.");
              return message.channel.send(`Please wait i am in a cool down for a minute`);
          } else if (error.response && error.response.status === 500) {
              console.error("Internal server error. Please try again later.");
              return message.channel.send(`Please wait i am in a cool down for a minute`);
          } else {
              await message.channel.send(`Please wait i am in a cool down for a minute`);
              console.error("The Api is on a cool down for 10 seconds", error.message);
          }
          }
        }
        response = `${msgContent}${response}`
      if (msgType === 'reply') {
        if (typeWritingEnable) {
          if (response.length <= 2000) {
              await typeWriter(message.channel, response, speed, delay);
          } else {
              let parts: string[] = [];
              while (typeof response === 'string' && response.length > 0) {
                  const substring = response.substring(0, 1999);
                  parts.push(substring);
                  if (response.length > 1999) {
                      response = response.substring(1999); 
                  } else {
                      break;
                  }
              }
              for (const part of parts) {
                await typeWriter(message.channel, part, speed, delay);
              }
          }
      } else {
          if (response.length <= 2000) {
              await message.reply({
                  content: response,
                  allowedMentions: { repliedUser: false },
              });
          } else {
            let parts: string[] = [];
            while (typeof response === 'string' && response.length > 0) {
                const substring = response.substring(0, 1999);
                parts.push(substring);
                if (response.length > 1999) {
                    response = response.substring(1999); 
                } else {
                    break;
                }
            }
              for (const part of parts) {
                  await message.reply({
                      content: part,
                      allowedMentions: { repliedUser: false },
                  });
              }
          }
        }
      } else if (msgType === 'send') {
        if (typeWritingEnable) {
            if (response.length <= 2000) {
                await typeWriter(message.channel, response, speed, delay);
            } else {
                let parts: string[] = [];
                while (typeof response === 'string' && response.length > 0) {
                    const substring = response.substring(0, 1999);
                    parts.push(substring);
                    if (response.length > 1999) {
                        response = response.substring(1999);
                    } else {
                        break;
                    }
                }
                for (const part of parts) {
                    await typeWriter(message.channel, part, speed, delay);
                }
            }
        } else {
            if (response.length <= 2000) {
                await message.channel.send({
                    content: response
                });
            } else {
                let parts: string[] = [];
                while (typeof response === 'string' && response.length > 0) {
                    const substring = response.substring(0, 1999);
                    parts.push(substring);
                    if (response.length > 1999) {
                        response = response.substring(1999);
                    } else {
                        break;
                    }
                }
                for (const part of parts) {
                    await message.channel.send({
                        content: part
                    });
                }
            }
        }
    }    
  }
}

export async function gemmaAi_4(prompt: string) {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/google/gemma-7b-it', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData[0].generated_text;
  } catch (error: any) {
    console.error('Error fetching response:', error.message);
    return null;
  }
}

export async function gemmaAi_3(prompt: string) {
  try {
      const response = await fetch('https://api-inference.huggingface.co/models/google/gemma-2b-it', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({ inputs: prompt })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      return responseData[0].generated_text;
  } catch (error: any) {
      console.error('Error fetching response:', error.message);
      return null;
  }
}
export async function apexai(prompt: string) {
  try {
      const messages = [
          {"role": "user", "content": `${prompt}`}
      ];
      const formattedMessages = messages.map(message => `[${message.role}] ${message.content}`).join('\n');

      const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer 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',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: formattedMessages })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      const generatedText = responseData[0].generated_text;
      const lines = generatedText.split('\n').slice(1);
      const output = lines.join('\n');

      return output;
  } catch (error: any) {
      console.error('Error:', error.message);
      return 'Please wait i am on cooldown.';
  }
}

export async function starChat(prompt: string) {
  const messages = [{"role":"user","content": `${prompt}`}];

  try {
      const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/starchat2-15b-v0.1', {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer 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',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: messages })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      const chatbotReply = responseData[0];
      const chatbotResponseText = chatbotReply.generated_text.replace(/^.*?\n.*?\n/, '');
      const chatbotResponseArray = JSON.parse(chatbotResponseText);
      const chatbotResponseString = chatbotResponseArray.join(' ');

      return chatbotResponseString;
  } catch (error: any) {
      console.error('Error:', error.message);
      return null;
  }
}

export async function zephyr_beta(prompt: string) {
  const messages = [{"role":"user","content": `${prompt}` }];

  try {
      const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer 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',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: messages })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      const chatbotReply = responseData[0];
      const textParts = chatbotReply.generated_text.split('\n');
      const secondArrayString = textParts[2];
      const chatbotResponseArray = JSON.parse(secondArrayString);
      const chatbotResponseString = chatbotResponseArray.map((obj: any) => obj.content).join(' ');

      return chatbotResponseString;
  } catch (error: any) {
      console.error('Error:', error.message);
      return null;
  }
}
