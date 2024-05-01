import { Hercai } from 'hercai';
import axios from 'axios';
import api  from "api";
 const sdk = api("@prodia/v1.3.0#be019b2kls0gqss3");
sdk.auth("43435e1c-cab1-493f-a224-f51e4b97ce8d");
const herc = new Hercai();
import { apexai, starChat, gemmaAi_3, gemmaAi_4, zephyr_beta } from './ApexAI';
interface ApexImagineOptions {
negative?: string;
number?: number;
nsfw?: boolean;
}
type ChatModelOption = "v3" | "v3-32k" | "turbo" | "turbo-16k" | "gemini" ;
type ImagineModelOption = "v1" | "v2" | "v2-beta" | "lexica" | "prodia" | "animefy" | "raava" | "shonin" | "v3" | "simurg";

async function ApexImagine(model: string, prompt: string, options: ApexImagineOptions): Promise<any> {
    try { 
const { negative = '', number, nsfw } = options;
let neg = '';
let count = 1;

if (prompt.length >= 2000) {
  throw new Error('Prompt can\t be longer than 2000 characters');
}

if (negative) {
    neg = `${negative}`;
}

if (number && Number.isInteger(number) && number >= 1 && number <= 4) {
    count = number;
} else {
    throw new Error('Invalid number parameter. It must be an integer between 1 and 4.');
}

let resultUrls: string[] = [];

const allowedModelsH = ['v1', 'v2', 'v2-beta', 'lexica', 'prodia', 'animefy', 'raava', 'shonin'];
const validProdiaModalsP = [
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

if (allowedModelsH.includes(model)) {
    for (let i = 0; i < count; i++) {
        try {
            const result = await herc.drawImage({ model: model as ImagineModelOption, prompt: prompt, negative_prompt: neg });
            resultUrls.push(result.url);
        } catch (error) {
            console.error("Failed to draw image with Hercai. Retrying...", error);
        }
    }
} else if (validProdiaModalsP.includes(model)) {
    for (let i = 0; i < count; i++) {
        const generateResponse = await sdk.generate({
            model: model,
            prompt: prompt,
        });

        const generatedJobId = generateResponse.data.job;
        const result = await checkJobStatus(generatedJobId);

        if (result) {
            resultUrls.push(result);
        } else {
            console.error('Invalid result format. Expected a URL.');
        }
    }
}

if (nsfw) {
   const checkedURLs = await apexChecker(resultUrls)
    const nsfwWords = [
        "porn",
        "sex",
        "nude",
        "nsfw",
        "xxx",
        "adult",
        "vagina",
        "penis",
        "boobs",
        "fuck",
        "orgasm",
        "erotic",
        "naughty",
        "kinky",
        "sensual",
        "horny",
        "lust",
        "sperm",
        "ejaculate",
        "busty",
        "booty",
        "striptease",
        "dildo",
        "vibrator",
        "fetish",
        "bondage",
        "anal",
        "oral",
        "blowjob",
        "cumshot",
        "gangbang",
        "threesome",
        "orgy",
        "deepthroat",
        "naked",
        "undress",
        "cum",
        "suck",
        "lick",
        "spank",
        "masturbate",
        "clitoris",
        "penetration",
        "swinger",
        "hooker",
        "prostitute",
        "escort",
        "cumswap",
        "creampie",
        "rimjob",
        "squirt",
        "butt",
        "ass",
        "slut",
        "whore",
        "cumming",
        "rimming",
        "cunnilingus",
        "fellatio",
        "crotch",
        "groin",
        "erogenous",
        "labia",
        "testicles",
        "climax",
        "thrust",
        "missionary",
        "doggy",
        "69",
        "tits",
        "pussy",
        "cock",
        "boobies",
        "boner",
        "cherry",
        "virgin",
        "cumming",
        "anal beads",
        "nipple",
        "stripper",
        "g-string",
        "thong",
        "fingering",
        "handjob",
        "voyeur",
        "orgasmic",
        "nudity",
        "sexting",
        "seduction",
        "lustful",
        "wet",
        "hardcore",
        "seduce",
        "dirty",
        "naughty",
        "erotic",
        "pleasure",
        "aroused",
        "intimate",
        "eroticism",
        "foreplay",
        "dominate",
        "submissive",
        "bdsm",
        "s&m",
        "masochism",
        "sadism",
        "bukkake",
        "gangbang",
        "fetish",
        "orgy",
        "bondage",
        "golden shower",
        "dirty talk",
        "pillow talk",
        "sex slave",
        "dirty dancing",
        "striptease",
        "pornographic",
        "adult entertainment",
        "sexual intercourse",
        "titillating",
        "sexy",
        "hot",
        "erotic",
        "raunchy",
        "stimulation",
        "climax",
        "horny",
        "turn-on",
        "kinky",
        "lustful",
        "sensual",
        "passionate",
        "intimate",
        "provocative",
        "tease",
        "foreplay",
        "satisfy",
        "pleasure",
        "erogenous",
        "arousal",
        "lust",
        "desire",
        "attraction",
        "libido",
        "orgasm",
        "bedroom",
        "undress",
        "naked",
        "kiss",
        "touch",
        "petting",
        "cuddle",
        "spooning",
        "naughty",
        "dirty",
        "taboo",
        "forbidden",
        "sinful",
        "sultry",
        "risqué",
        "racy",
        "flirt",
        "seduce",
        "titillate",
        "arouse",
        "tempt",
        "stimulate",
        "seduction",
        "pleasure",
        "ecstasy",
        "passion",
        "intimacy",
        "sensuality",
        "eroticism",
        "fetish",
        "fantasy",
        "kink",
        "role-play",
        "dominance",
        "submission",
        "bondage",
        "masochism",
        "sadism",
        "orgy",
        "swinging",
        "voyeurism",
        "exhibitionism",
        "cunnilingus",
        "fellatio",
        "69",
        "blowjob",
        "anal",
        "doggy style",
        "missionary",
        "cowgirl",
        "reverse cowgirl",
        "threesome",
        "foursome",
        "gangbang",
        "rimming",
        "golden shower",
        "facial",
        "creampie",
        "cumshot",
        "squirting",
        "masturbation",
        "orgasm",
        "erect",
        "nipple",
        "pubic",
        "erection",
        "ejaculation",
        "clitoris",
        "penetration",
        "vibrator",
        "dildo",
        "strap-on",
        "butt plug",
        "anal beads",
        "crotchless",
        "lingerie",
        "corset",
        "stockings",
        "garter",
        "bra",
        "panties",
        "thong",
        "G-string",
        "bikini",
        "lingerie",
        "boudoir",
        "stripper",
        "exotic dancer",
        "burlesque",
        "pole dance",
        "erotic dance",
        "nude",
        "topless",
        "lap dance",
        "strip tease",
        "private dance",
        "camgirl",
        "porn star",
        "sex worker",
        "escort",
        "prostitute",
        "whore",
        "call girl",
        "hooker",
        "streetwalker",
        "courtesan",
        "madam",
        "mistress",
        "dominatrix",
        "submissive",
        "slave",
        "master",
        "mistress",
        "sir",
        "madame",
        "domina",
        "domme",
        "sissy",
        "bottom",
        "top",
        "fetish",
        "kink",
        "leather",
        "latex",
        "rubber",
        "bondage",
        "rope",
        "chain",
        "spanking",
        "whipping",
        "caning",
        "flogging",
        "paddling",
        "torture",
        "humiliation",
        "degradation",
        "submission",
        "dominance",
        "sadism",
        "masochism",
        "bukkake",
        "facial",
        "creampie",
        "cum swap",
        "cum play",
        "cum shot",
        "gang bang",
        "double penetration",
        "anal sex",
        "oral sex",
        "rimming",
        "fingering",
        "gay",
        "lesbian",
        "niga",
        "underage",
        "xnxx",
        "xxx",
        "pornhub",
        ];
    for (const text of checkedURLs) {
        if (nsfwWords.some(word => text.includes(word))) {
            return "The generated text contains NSFW content.";
        }
    }

}
return resultUrls;
    } catch (e: any) {
    if (e.response && e.response.status === 429) {
        console.error("Too many requests. Please try again later.");
        return `Please wait i am in a cool down for a minute`;
    } else if (e.response && e.response.status === 500) {
        console.error("Internal server error. Please try again later.");
        return `Please wait i am in a cool down for a minute`;
    } else {
        console.error(`Please wait i am in a cool down for a minute`);
        return `Please wait i am in a cool down for a minute`;
    }
  }
}

async function checkJobStatus(jobId: string, retryCount = 3): Promise<string | null> {
try {
    const getJobResponse = await sdk.getJob({ jobId: jobId });
    const jobData = getJobResponse.data;

    if (jobData.status === "generating" || jobData.status === "queued") {
        if (retryCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            return checkJobStatus(jobId, retryCount - 1);
        } else {
            console.error("Job failed after multiple retries:", jobData);
            return null;
        }
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

async function ApexChat(model: string, prompt: string): Promise<string> { // Specify the return type as string
  try {
    if (prompt.length >= 2000) {
      const chunks = [];
      while (prompt.length > 0) {
        chunks.push(prompt.substring(0, 2000));
        prompt = prompt.substring(2000);
      }

      const responses = await Promise.all(chunks.map(async (chunk) => {
        return await processChunk(model, chunk);
      }));

      return responses.join('');
    } else {
      return await processChunk(model, prompt);
    }
  } catch (error: any) {
    console.error(error.message); 
    return '';
  }
}

async function processChunk(model: string, prompt: string): Promise<string> {
  let response: string;

  switch (model) {
    case 'v3':
    case 'v3-32k':
    case 'turbo':
    case 'turbo-16k':
    case 'gemini':
      response = (await herc.question({ model: model as ChatModelOption, content: prompt })).reply;
      break;
    case 'apexChat':
      response = await apexai(prompt);
      break;
    case 'gemma-v3':
      response = await gemmaAi_3(prompt);
      break;
    case 'gemma-v4':
      response = await gemmaAi_4(prompt);
      break;
    case 'starChat':
      response = await starChat(prompt);
      break;
    case 'zephyr-beta':
      response = await zephyr_beta(prompt);
      break;
    default:
      throw new Error('Invalid model.');
  }
  return response;
}

async function apexChecker(urls: any) {
  try {
    let retryCount = 0;
    const maxRetries = 3;

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base`,
          { image: urls },
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
      } catch (e: any) {
        console.error(`Error fetching data: ${e.message}`);
        throw e;
      }
    };

    while (retryCount < maxRetries) {
      try {
        return await fetchData();
      } catch (e: any) {
        console.error(
          `Error fetching data (Retry ${retryCount + 1}): ${e.message}`,
        );
        retryCount++;
      }
    }

    return null;
  } catch (e: any) {
    console.error(`Error in attemptImageCaptioning: ${e.message}`);
    return null;
}
}

export { ApexImagine, ApexChat };