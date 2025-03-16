// app/api/chat/route.ts
import { Pinecone } from "@pinecone-database/pinecone";
import { openai } from "@ai-sdk/openai";
import { streamText, embed } from "ai";
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { google } from "@ai-sdk/google";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const latestMessage = messages[messages.length - 1].content;

  // 1. Generate embedding for the query
  // const embeddings = new OpenAIEmbeddings({
  //   openAIApiKey: process.env.OPENAI_API_KEY!,
  // });
  // const queryEmbedding = await embeddings.embedQuery(latestMessage);

  // OPENAI EMBEDDINGS
  // const { embedding:queryEmbedding } = await embed({
  //   model: openai.embedding('text-embedding-3-small'),
  //   value: latestMessage,
  // });

  // GOOGLE EMBEDDINGS
  const { embedding: queryEmbedding } = await embed({
    model: google.textEmbeddingModel("text-embedding-004"),
    value: latestMessage,
  });

  // 2. Pinecone vector search
  const index = pinecone.Index(process.env.PINECONE_INDEX!);
  const searchResults = await index.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  // console.log(searchResults)
  // 3. Construct context from results
  const context = searchResults.matches
    .map((match) => {
      const source = match.metadata?.source || "Unknown Source"; // Get source URL
      const text = match.metadata?.text || "No content available"; // Get text
      return `Source: ${source}\nContent: ${text}`; // Combine source and text
    })
    .join("\n\n"); // Join all matches with double newlines

  console.log(context);
  // 4. Create augmented prompt
  const augmentedPrompt = `
  You are a Blueprint AI a don't die medical agent expert chatbot. Answer the user's question using only the provided context. 

  **Instructions:**

  1.  **Contextual Response:** Base your answer on the information within the following context.
  2.  **No Context Handling:** If the context is insufficient or irrelevant, respond with: "Insufficient context provided. Please ask a question relevant to the available information. 🤗"
  3.  **Technical Specificity:** Provide precise and technical details. Avoid generalizations.
  4.  **Concise Answer:** Keep your response brief, using bullet points or short paragraphs for clarity.
  5.  **Emoji Usage:** Include relevant emojis to enhance engagement.
  6.  **Source Attribution:** Always provide the most relevant URL(s) (At max 2) of the source document(s) used for your response at the end just links without emoji.
  7.  **No Price Quotations:** Do not include any pricing information in your response.

  Context:
  ${context}
  
  Question: ${latestMessage}
  
  Answer:`;

  // 5. Generate response with context
  // OPENAI
  // const result = streamText({
  //   model: openai('gpt-4o-mini'),
  //   messages: [
  //     ...messages.slice(0, -1),
  //     { role: 'user', content: augmentedPrompt }
  //   ],
  // });

  // GOOGLE
  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    messages: [
      ...messages.slice(0, -1),
      { role: "user", content: augmentedPrompt },
    ],
  });

  return result.toDataStreamResponse();
}
