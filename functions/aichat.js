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
          "X-API-KEY": WS_API_KEY,
        },
      }
    );

    const data = response.data;

    if (data) {
      return {
        statusCode: 200,
        body: JSON.stringify({ output: " " + data.output_text.trim() }), // Replace 'output_text' with the appropriate response property name
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