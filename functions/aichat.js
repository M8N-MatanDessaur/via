exports.handler = async function(event, context) {
  try {
    const conversationHistory = event.queryStringParameters.history;
    const userInput = event.queryStringParameters.input;
    const searchResult = await fetchGoogleSearchResults('Videotron services');

    // Include the search result as part of the AI's prompt
    const prompt = `
    Le suivant est une conversation entre un agent de vente de télécommunication et un assistant virtuel nommé VIA. L'assistant virtuel est programmé pour aider l'agent de vente à répondre aux questions des clients, et à fournir des informations sur les produits et services de l'entreprise videotron.
    ${conversationHistory}
    \nAgent de vente: ${userInput}
    \nVIA: D'après mes recherches, ${searchResult}.`;
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
