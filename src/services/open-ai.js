const axios = require('axios');

async function makeOpenAICall(messages, options) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(apiUrl, {
            messages: messages,
            max_tokens: 500,
            temperature: 1,
            model: 'gpt-3.5-turbo'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${options.openAiKey}`
            }
        });
        console.log('OpenAI API response:', response);
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error making OpenAI API call:', error);
        throw error;
    }
}

const TrimRequest = function(chat) {
    const maxLength = 500;
    let totalLength = 0;
    let request = [];
    chat.reverse().forEach((message) => {
        if (totalLength < maxLength) {
            const remainingLength = maxLength - totalLength;
            let content = message.content;
            if (content.length > remainingLength) {
                content = content.substring(content.length - remainingLength);
            }
            totalLength += content.length;
            request.push({ ...message, content: content });
        }
    });
    request = request.reverse();
    return request;
}


const GetSuggestion = async function(chat, currentInput, options) {
    // User's input too long. Skip.
    if (currentInput > 100) return;

    let chatItems = TrimRequest(chat || []);
    console.log('TripRequest', chatItems);

    let request = [];

    request.push({ 
        role: 'system', 
        content: 'You are a ' + options.role + ' assistant, skilled in simply explaining complex programming concepts.' 
    })

    if (currentInput.length > 0) {
        // User is typing -- try to predict & rephraze
        if (chatItems.length > 0) {
            request.push({ 
                role: 'user', 
                content: 'Here is a discussion of issue/feature in the ticket system.'+
                        ' \r\n' +
                        '```' +
                        '\r\n' + 
                        chatItems.map((item) => 
                            {
                                return item.role + ": '" + item.content + "'";
                            }
                        ).join('\r\n') +
                        '\r\n' +
                        '```' +
                        '\r\n\r\nYou should reply to this conversation as an assistant. \r\n' +
                        'Complete and rephrase `' + currentInput +'` as a reply.\r\n' +
                        'Just respond with an assistant\'s message text, in the same language.\r\n' +
                        'The rephrased response: \r\n'
            });
        }else {
            request.push({ 
                role: 'user', 
                content: 'You should reply to conversation as an assistant. \r\n' +
                        'Complete and rephrase `' + currentInput +'` as a reply.\r\n' +
                        'Just respond with an assistant\'s message text, in the same language.\r\n' +
                        'The rephrased response: \r\n'
            });
        }
    } else {
        if (chatItems.length === 0) return;
        // Empty chat input -- allow to make new message
        request = request.concat(chatItems);
    }

    

    console.log('OpenAI API request:', request);
    try {
        const response = await makeOpenAICall(request, options);
        console.log('OpenAI API response:', response);
        return response;
    } catch (error) {
        console.error('Error:', error);
    }
}
export { GetSuggestion };
