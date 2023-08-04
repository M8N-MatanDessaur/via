const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const conversationHistory = event.queryStringParameters.history;
    const userInput = event.queryStringParameters.input;
    const prompt = `
    ${conversationHistory}
    \nAgent de vente: ${userInput}
    \nVIA: Veuillez fournir une réponse détaillée à la question de l'utilisateur. La conversation porte sur les ventes et le service à la clientèle chez "Videotron". La base de connaissance est constituée de données dattant de 2021 et moins donc tu ne peux pas parler d'actualité ni comparer des prix. Tu dois répondre à la question de l'utilisateur en utilisant un langage simple et clair.`;
    
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
