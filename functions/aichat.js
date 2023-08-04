const axios = require('axios');

const fetchGoogleSearchResults = async (query) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: process.env.GOOGLE_SEARCH_API_KEY,
        cx: process.env.CUSTOM_SEARCH_ENGINE_ID,
        q: query
      }
    });

    if (response.data.items) {
      const firstResult = response.data.items[0];
      return `${firstResult.title}: ${firstResult.snippet}`;
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

exports.handler = async function(event, context) {
  try {
    const conversationHistory = event.queryStringParameters.history;
    const userInput = event.queryStringParameters.input;
    const searchResult = await fetchGoogleSearchResults('Videotron services');
    const prompt = `
    Voici les informations trouvées: ${searchResult}
    Le suivant est une conversation entre un agent de vente de télécommunication et un assistant virtuel nommé VIA. L'assistant virtuel est programmé pour aider l'agent de vente à répondre aux questions des clients, et à fournir des informations sur les produits et services de l'entreprise videotron.
    ${conversationHistory}
    \nAgent de vente: ${userInput}
    \nVIA:`;
    const response = await axios.post("https://api.openai.com/v1/engines/text-davinci-003/completions", 
      {
        prompt: prompt,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const data = response.data;

    if (data && data.choices && data.choices.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ output: " "+data.choices[0].text.trim() }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ output: `Oh oh ... essayez encore` }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur" }),
    };
  }
};
