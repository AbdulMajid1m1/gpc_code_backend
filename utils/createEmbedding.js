
import axios from 'axios';
export async function getTextEmbedding(text) {
    // Define the OpenAI API url and key.
    const url = 'https://api.openai.com/v1/embeddings';
    // const openai_key = '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';
    const openai_key = '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';
    // Make the API call
    let response = await axios.post(url, {
        input: text,
        model: "text-embedding-ada-002"
    }, {
        headers: {
            'Authorization': `Bearer ${openai_key}`,
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


export async function getBulkTextEmbeddings(texts) {
    const url = 'https://api.openai.com/v1/embeddings';
    const openai_key = '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';

    // Validate that texts array is not empty and does not contain empty strings
    if (!texts || !Array.isArray(texts) || texts.length === 0 || texts.some(text => !text)) {
        throw new Error("Invalid input texts");
    }

    // Make the API call
    let response = await axios.post(url, {
        input: texts,  // Array of texts
        model: "text-embedding-ada-002",
        encoding_format: "float"  // Optional, can be either "float" or "base64"
    }, {
        headers: {
            'Authorization': `Bearer ${openai_key}`,
            'Content-Type': 'application/json'
        }
    });

    // Handle the response
    if (response.status === 200) {
        return response.data.data.map(item => item.embedding);  // Extract embeddings
    } else {
        throw new Error(`Failed to get embeddings. Status code: ${response.status}`);
    }
}