const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        // Make a GET request to the external API
        const healthCheck = await axios.get('http://localhost:3000/open-ai/health');

        if (healthCheck.data.statusCode != 200) {
            throw new Error('Open Ai API Not Found');
        }

        context.log('Health Check OK');

        const { prompt, userId } = req.query;
        const response = await axios.post('http://localhost:3000/open-ai/create-chat-completion', {
            message: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'gpt-3.5-turbo',
            userId: userId,
        });
        console.log(response.data);

        // Process the response data or return it as-is
        const responseData = response.data;

        // Return a response to the client
        context.res = {
            status: 200,
            body: responseData,
        };
    } catch (error) {
        console.error(error);
        context.res = {
            status: 500,
            body: 'An error occurred while calling the API.',
        };
    }
    // const name = req.query.name || (req.body && req.body.name);
    // const responseMessage = name
    //     ? 'Hello, ' +
    //       name +
    //       '. This HTTP triggered function executed successfully.'
    //     : 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage,
    // };
};
