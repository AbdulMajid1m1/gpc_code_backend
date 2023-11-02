
import axios from 'axios';
import { OPENAI_API_KEY } from '../config/config.js';
export async function getTextEmbedding(text) {
    // Define the OpenAI API url and key.
    const url = 'https://api.openai.com/v1/embeddings';
    // Make the API call
    let response = await axios.post(url, {
        input: text,
        model: "text-embedding-ada-002"
    }, {
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    // Handle the response
    if (response.status === 200) {
        return response.data.data[0].embedding;
    } else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
}

// export async function getBulkTextEmbeddings(texts) {
//     const url = 'https://api.openai.com/v1/embeddings';
//     const openai_key = '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';

//     // Make the API call
//     let response = await axios.post(url, {
//         input: texts, // Note the change from 'input' to 'inputs'
//         model: "text-embedding-ada-002"
//     }, {
//         headers: {
//             'Authorization': `Bearer ${openai_key}`,
//             'Content-Type': 'application/json'
//         }
//     });

//     // Handle the response
//     if (response.status === 200) {
//         return response.data.data.map(item => item.embedding);
//     } else {
//         throw new Error(`Failed to get embeddings. Status code: ${response.status}`);
//     }
// }


// export async function getBulkTextEmbeddings(texts) {
//     const url = 'https://api.openai.com/v1/embeddings';

//     // Validate that texts array is not empty and does not contain empty strings
//     if (!texts || !Array.isArray(texts) || texts.length === 0 || texts.some(text => !text)) {
//         throw new Error("Invalid input texts");
//     }

//     // Make the API call
//     let response = await axios.post(url, {
//         input: texts,  // Array of texts
//         model: "text-embedding-ada-002",
//         encoding_format: "float"  // Optional, can be either "float" or "base64"
//     }, {
//         headers: {
//             'Authorization': `Bearer ${OPENAI_API_KEY}`,
//             'Content-Type': 'application/json'
//         }
//     });

//     // Handle the response
//     if (response.status === 200) {
//         return response.data.data.map(item => item.embedding);  // Extract embeddings
//     } else {
//         throw new Error(`Failed to get embeddings. Status code: ${response.status}`);
//     }
// }

export async function getBulkTextEmbeddings(texts) {
    const url = 'https://api.openai.com/v1/embeddings';

    // Filter out invalid texts and log them
    const validTexts = texts.filter(text => typeof text === 'string' && text.trim() !== '');
    const invalidTextsCount = texts.length - validTexts.length;
    if (invalidTextsCount > 0) {
        console.log(`Filtered out ${invalidTextsCount} invalid texts.`);
    }

    // Check if there are valid texts to process
    if (validTexts.length === 0) {
        throw new Error("No valid texts to process");
    }

    // Make the API call
    let response = await axios.post(url, {
        input: validTexts,  // Array of valid texts
        model: "text-embedding-ada-002",
        encoding_format: "float"
    }, {
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    // Handle the response
    if (response.status === 200) {
        return response.data.data.map(item => item.embedding);
    } else {
        throw new Error(`Failed to get embeddings. Status code: ${response.status}`);
    }
}

