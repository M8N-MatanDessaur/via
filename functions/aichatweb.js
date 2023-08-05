const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const userInput = event.queryStringParameters.input;

    const options = {
      method: 'POST',
      timeout: 45000,
      url: 'https://api.writesonic.com/v2/business/content/chatsonic',
      params: {engine: 'premium', language: 'fr'},
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': 'f77b4dde-6fc7-454c-8bf2-b7c963add936'
      },
      data: {
        enable_google_results: 'true', 
        enable_memory: true, 
        input_text: userInput + "in a max of characters 1024, no references, no links",
        history_data: [
          {
            "Context": "Tu es un bot IA nommé VIA qui assiste les agents de Videotron avec leurs questions. Tu réponds uniquement aux questions qui sont liées à la télécommunications et aux domaines connexes."
          }
        ],
      },
      timeout: 45000,
    };
  
    const response = await axios.request(options);

    if (response.data) {
      return {
        statusCode: 200,
        body: JSON.stringify({ output: " " + response.data.message}), 
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ output: `Oh oh ... essayez encore` }),
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