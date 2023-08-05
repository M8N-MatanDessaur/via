const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const userInput = event.queryStringParameters.input;
    const chatHistory = event.queryStringParameters.chatHistory;

    const options = {
      method: 'POST',
      url: 'https://api.writesonic.com/v2/business/content/chatsonic',
      params: {engine: 'premium', language: 'fr'},
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': 'f77b4dde-6fc7-454c-8bf2-b7c963add936'
      },
      data: {
        enable_google_results: 'true', 
        enable_memory: false, 
        input_text: `${chatHistory}
        \nAgent de vente: ${userInput}
        \nVIA: Veuillez fournir une réponse détaillée et précise à la question ou requête de l'utilisateur. La conversation porte sur les ventes, le service à la clientèle et la télécommunication.`
      },
    };
  
    const response = await axios.request(options);

    if (response.data) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: " " + response.data.message}), 
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Oh oh ... essayez encore` }),
      };
    }
  } catch (error) {
    console.error(error);  // This line will log the error details to the console
    if (error.code === 'ECONNABORTED') { // Axios error code for a timeout
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Timeout: The request took too long to complete." }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Erreur: " + error.message }), // this will include error message in the response
      };
    }
  }
};