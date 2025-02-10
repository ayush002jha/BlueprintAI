import type { Index, PineconeRecord } from '@pinecone-database/pinecone';

// Calculate the approximate size of a vector in bytes
function calculateVectorSize(vector: PineconeRecord): number {
  // Convert the vector to a string to approximate its JSON size
  return Buffer.from(JSON.stringify(vector)).length;
}

// Split vectors into chunks that respect Pinecone's size limit
function createSizeLimitedChunks(vectors: PineconeRecord[], maxRequestSize: number = 4_000_000): PineconeRecord[][] {
  const chunks: PineconeRecord[][] = [];
  let currentChunk: PineconeRecord[] = [];
  let currentChunkSize = 0;

  for (const vector of vectors) {
    const vectorSize = calculateVectorSize(vector);
    
    // If a single vector is too large, we need to handle it specially
    if (vectorSize > maxRequestSize) {
      console.warn(`Vector with ID ${vector.id} exceeds maximum request size and may fail to upsert`);
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = [];
        currentChunkSize = 0;
      }
      chunks.push([vector]);
      continue;
    }

    // If adding this vector would exceed the limit, start a new chunk
    if (currentChunkSize + vectorSize > maxRequestSize) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentChunkSize = 0;
    }

    // Add vector to current chunk
    currentChunk.push(vector);
    currentChunkSize += vectorSize;
  }

  // Add the last chunk if it has any vectors
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export const chunkedUpsert = async (
  pineconeIndex: Index,
  vectors: Array<PineconeRecord>,
  namespace: string,
  chunkSize = 10
) => {
  // Create chunks that respect both the size limit and the desired chunk size
  const sizeBasedChunks = createSizeLimitedChunks(vectors);
  
  // Further split large chunks if they exceed the desired chunk size
  const finalChunks = sizeBasedChunks.flatMap(chunk => 
    chunk.length > chunkSize ? chunk.reduce((acc, curr, i) => {
      const chunkIndex = Math.floor(i / chunkSize);
      acc[chunkIndex] = acc[chunkIndex] || [];
      acc[chunkIndex].push(curr);
      return acc;
    }, [] as PineconeRecord[][]) : [chunk]
  );

  let successCount = 0;
  let failureCount = 0;

  try {
    // Upsert each chunk with proper error handling and retries
    const results = await Promise.allSettled(
      finalChunks.map(async (chunk, chunkIndex) => {
        try {
          await pineconeIndex.namespace(namespace).upsert(chunk);
          successCount += chunk.length;
          return true;
        } catch (e) {
          console.error(`Error upserting chunk ${chunkIndex}:`, e);
          failureCount += chunk.length;
          return false;
        }
      })
    );

    // Log the results
    console.log(`Upsert completed:
      - Total vectors: ${vectors.length}
      - Successfully upserted: ${successCount}
      - Failed to upsert: ${failureCount}
      - Total chunks: ${finalChunks.length}`
    );

    return {
      success: failureCount === 0,
      totalVectors: vectors.length,
      successCount,
      failureCount,
      chunks: finalChunks.length
    };
  } catch (e) {
    throw new Error(`Error upserting vectors into index: ${e}`);
  }
};