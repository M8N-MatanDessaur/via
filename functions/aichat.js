const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const userInput = event.queryStringParameters.input;

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
        enable_memory: true, 
        input_text: userInput
      }
    };
  
    const response = await axios.request(options);

    if (response.data) {
      return {
        statusCode: 200,
        body: JSON.stringify({ output: " " + response.data.output_text}), 
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ output: `Oh oh ... essayez encore` }),
      };
    }
  } catch (error) {
    console.error(error);  // This line will log the error details to the console
    return {
        statusCode: 500,
        body: JSON.stringify({ error: "Erreur: " + error.message }), // this will include error message in the response
    };
  }
};
