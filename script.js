// Global variable for the base URL
var baseUrl = 'http://localhost:11434';
varmessages = [];

// Function to set the base URL
function setBaseUrl(url) {
    baseUrl = url;
}

// Function to fetch all available models from the ollama server
function fetchAvailableModels() {
    return fetch(`${baseUrl}/api/tags`)
        .then(response => response.json())
        .then(data => {
            console.log('Available models:', data.models);
            return data.models;
        })
        .catch(error => {
            console.error('Error fetching models:', error);
            return null;
        });
    
}

function submitPrompt(model, system, prompt) {
    if (!model) {
        return Promise.reject('Model not specified.');
    }

    if (!system) {
        return Promise.reject('System prompt not specified.');
    }

    if (!prompt) {
        return Promise.reject('User Prompt not specified.');
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            model, 
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ]
        })
        // stream: false
    };

    return fetch(`${baseUrl}/api/chat`, requestOptions)
        .catch(error => {
            console.error('Error submitting prompt:', error);
            throw new Error('Failed to get response from the server.');
        });
}
