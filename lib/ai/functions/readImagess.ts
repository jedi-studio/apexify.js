import axios from "axios";

export async function readImage(imageUrl: string) {
    try {
        let retryCount = 0;
        const maxRetries = 3;

        const fetchData = async () => {
            try {
                const response = await axios.post("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", { image: imageUrl }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer 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",
                    },
                });

                if (response.status === 200) {
                    return response.data[0].generated_text;
                } else {
                    return null;
                }
            } catch (error: any) {
                throw error.message;
            }
        };

        while (retryCount < maxRetries) {
            try {
                return await fetchData();
            } catch (error: any) {
                retryCount++;
                console.error(`Error fetching data (Retry ${retryCount}): ${error}`);
            }
        }
        
        return null;
    } catch (error: any) {
        console.error(`Error in readImages: ${error.message}`);
        return null;
    }
}
