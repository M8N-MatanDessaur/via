const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const userInput = event.queryStringParameters.input;

    const response = await axios.post("https://api.writesonic.com/v2/business/content/chatsonic?engine=premium&language=fr", 
      {
        enable_google_results: 'true',
        enable_memory: true,
        input_text: userInput
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-API-KEY": "f77b4dde-6fc7-454c-8bf2-b7c963add936",
        },
      }
    );

    const data = response.json;

    if (data) {
      return {
        statusCode: 200,
        body: JSON.stringify({ output: " " + data.response.trim() }),
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