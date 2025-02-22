// app/api/chat/route.ts
import { Pinecone } from '@pinecone-database/pinecone';
import { openai } from '@ai-sdk/openai';
import { streamText, embed } from 'ai';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

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

  const { embedding:queryEmbedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: latestMessage,
  });

  // 2. Pinecone vector search
  const index = pinecone.Index(process.env.PINECONE_INDEX!);
  const searchResults = await index.query({
    vector: queryEmbedding,
    topK: 10,
    includeMetadata: true,
  });


  // console.log(searchResults)
  // 3. Construct context from results
  const context = searchResults.matches
  .map(match => {
    const source = match.metadata?.source || 'Unknown Source'; // Get source URL
    const text = match.metadata?.text || 'No content available'; // Get text
    return `Source: ${source}\nContent: ${text}`; // Combine source and text
  })
  .join('\n\n'); // Join all matches with double newlines

  console.log(context)
  // 4. Create augmented prompt
  const augmentedPrompt = `Use the following context to answer the question. 
  If you got no context just say "Please ask relevant questions🤗". 
  Be specific and technical.
  Give answer in short. With few points. Add Relevant Emojis. Also Provide the Source Link. Do not quote price.
  
  Context:
  ${context}
  
  Question: ${latestMessage}
  
  Answer:`;

  // 5. Generate response with context
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: [
      ...messages.slice(0, -1),
      { role: 'user', content: augmentedPrompt }
    ],
  });

  return result.toDataStreamResponse();
}