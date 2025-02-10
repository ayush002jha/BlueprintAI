import { OpenAIApi, Configuration } from "openai-edge";

// List of available OpenAI API keys
const API_KEYS = [
  process.env.OPENAI_API_KEY,
  process.env.OPENAI_API_KEY_1

];

// Function to get a random API key from the list
function getRandomApiKey() {
  return API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
}

let keyIndex = 0; // Track the last used key

function getNextApiKey() {
  const apiKey = API_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % API_KEYS.length; // Move to the next key in a circular manner
  return apiKey;
}

export async function getEmbeddings(input: string) {
  try {
    const apiKey = getNextApiKey(); // Select a random API key for each request
    const config = new Configuration({ apiKey });
    const openai = new OpenAIApi(config);

    const response = await openai.createEmbedding({
      model: "text-embedding-3-small",
      input: input.replace(/\n/g, ' ')
    });

    // Check if response is JSON, otherwise return error
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text(); // Log the actual response
      console.error("Received non-JSON response:", errorText);
      throw new Error(`Unexpected response format: ${errorText}`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      throw new Error("No embedding data returned.");
    }

    return result.data[0].embedding as number[];

  } catch (e) {
    console.error("Error calling OpenAI embedding API:", e);
    throw new Error(`OpenAI Embedding API Error: ${e}`);
  }
}
