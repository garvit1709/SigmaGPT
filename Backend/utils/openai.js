import "dotenv/config";

const getOpenAIAPIResponse = async (message, model = "gpt-4o-mini") => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model,
            messages: [{
                role: "user",
                content: message
            }]
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();

        if (!response.ok) {
            const apiError = data?.error?.message || "OpenAI API request failed";
            throw new Error(apiError);
        }

        if (!data?.choices?.[0]?.message?.content) {
            throw new Error("No reply received from OpenAI");
        }

        return data.choices[0].message.content;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export default getOpenAIAPIResponse;
