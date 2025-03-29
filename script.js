

// Function to fetch word meaning
async function getWordMeaning(word) {
    const endpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) return "Meaning not found.";
        const data = await response.json();
        if (data[0] && data[0].meanings) {
            return data[0].meanings.map(m => m.definitions[0].definition).join(" / ");
        } else {
            return "Meaning not found.";
        }
    } catch (error) {
        console.error("Error fetching word meaning:", error);
        return "Error fetching meaning.";
    }
}

// Function to simplify the sentence using OpenAI API
async function simplifySentence(sentence) {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Simplify this: ${sentence}` }],
        temperature: 0.7,
        max_tokens: 100
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        // Handle API errors properly
        if (data.error) {
            console.error("OpenAI API error:", data.error);
            return `Error: ${data.error.message}`;
        }

        return data.choices?.[0]?.message?.content?.trim() || "No response from AI.";
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return "Error simplifying text.";
    }
}

// Event listener for "Search Word Meaning"
document.getElementById("search-btn").addEventListener("click", async () => {
    const inputText = document.getElementById("input-text").value.trim();
    if (!inputText) {
        alert("Please enter a sentence.");
        return;
    }

    const firstWord = inputText.split(" ")[0];
    const meaning = await getWordMeaning(firstWord);
    const simplifiedSentence = await simplifySentence(inputText);

    document.getElementById("meaning").innerHTML = `<strong>Meaning of "${firstWord}":</strong> ${meaning}`;
    document.getElementById("simplified").innerHTML = `<strong>Simplified Sentence:</strong> ${simplifiedSentence}`;
});

// Double-click event to fetch word meaning
document.body.addEventListener("dblclick", async () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        const meaning = await getWordMeaning(selectedText);
        alert(`Meaning of "${selectedText}":\n\n${meaning}`);
    }
});
