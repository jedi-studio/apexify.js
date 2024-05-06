export async function readImage(imageUrl: string) {
    try {
        let retryCount = 0;
        const maxRetries = 3;

        const fetchData = async () => {
            try {
                const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer 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",
                    },
                    body: JSON.stringify({ image: imageUrl })
                });

                if (response.ok) {
                    return await response.json();
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
            } catch (error) {
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
