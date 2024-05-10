document.addEventListener('DOMContentLoaded', function() {
    fetchAvailableModels().then(models => {
        console.log({models});
        const modelSelect = document.getElementById('modelSelect');
        if (models.length === 0) {
            document.getElementById('responseField').innerText = 'No models were found.';
        } else {
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.name;
                option.text = `${model.name}`;
                modelSelect.appendChild(option);
            });
        }
    }).catch(error => {
        console.error(error);
        document.getElementById('responseField').innerText = 'The ollama server is not live.';
    });

    populateMessageHistory();

});

function populateMessageHistory() {
    const messageHistory = document.getElementById('messageHistory');
    messageHistory.innerHTML = '';
    messages.forEach(message => {
        const listItem = document.createElement('li');
        listItem.textContent = `${message.role}: ${message.content}`;
        messageHistory.appendChild(listItem);
    });
}

document.getElementById('submitPrompt').addEventListener('click', function(event) {
    console.log('submitPrompt clicked');
    event.preventDefault();
    const modelSelect = document.getElementById('modelSelect');
    const selectedModel = modelSelect.value;
    const promptText = document.getElementById('promptText').value;
    const systemPrompt = document.getElementById('systemPrompt').value;
    submitPrompt(selectedModel, systemPrompt, promptText).then(response => {
        const responseField = document.getElementById('responseField');
        responseField.innerText = ''; // Clear previous responses
        const reader = response.body.getReader();
        function read() {
            reader.read().then(({done, value}) => {
                if (done) {
                    console.log('Stream complete');
                    messages.push({
                        role: 'assistant',
                        content: responseField.innerText
                    });
                    populateMessageHistory();
                    responseField.innerText = '';
                    return;
                }
                const decoded = new TextDecoder("utf-8").decode(value);
                const decodedJSON = JSON.parse(decoded);
                responseField.innerText += decodedJSON.message.content;
                read();
            }).catch(error => {
                console.error('Error reading stream:', error);
                responseField.innerText = 'Failed to read response from the server.';
            });
        }
        read();
    }).catch(error => {
        console.error('Error submitting prompt:', error);
        document.getElementById('responseField').innerText = 'Failed to get response from the server.';
    });
});