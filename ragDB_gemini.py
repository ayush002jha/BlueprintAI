import os
import re
import requests
from pinecone import Pinecone, ServerlessSpec
from bs4 import BeautifulSoup
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GOOGLE_GENERATIVE_AI_API_KEY = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
INDEX_NAME = "blueprintai-gemini"

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Initialize text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
)

# Initialize Gemini embeddings
embeddings = GoogleGenerativeAIEmbeddings(
    google_api_key=GOOGLE_GENERATIVE_AI_API_KEY,
    model="models/text-embedding-004",
    task_type="retrieval_query"
)

def extract_urls_from_file(filename):
    """Extract URLs from the crawl results file"""
    with open(filename, 'r') as f:
        content = f.read()
    
    # Use regex to find all URLs
    url_pattern = r'https?://[^\s]+'
    urls = re.findall(url_pattern, content)
    
    # Filter out non-http and duplicate URLs
    unique_urls = list(set([url for url in urls if url.startswith('http')]))
    return unique_urls

def scrape_page(url):
    """Scrape and clean page content"""
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove unwanted elements
        for element in soup(['script', 'style', 'nav', 'footer', 'header']):
            element.decompose()
            
        # Get main content
        main_content = soup.find('main') or soup.body
        text = main_content.get_text(separator=' ', strip=True)
        
        # Basic cleaning
        text = re.sub(r'\s+', ' ', text)
        return text
    
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
        return None

def process_urls(urls):
    """Process list of URLs and store in Pinecone"""
    documents = []
    embeddings_list = []
    ids = []
    metadata_list = []
    
    # Process documents and create embeddings
    for i, url in enumerate(urls):
        print(f"Processing: {url}")
        content = scrape_page(url)
        
        if content:
            # Split text into chunks
            chunks = text_splitter.split_text(content)
            
            # Process each chunk
            for j, chunk in enumerate(chunks):
                # Generate a unique ID
                doc_id = f"doc_{i}_{j}"
                ids.append(doc_id)
                
                # Get embedding
                embed = embeddings.embed_query(chunk)
                embeddings_list.append(embed)
                
                # Store metadata
                metadata = {
                    'text': chunk,
                    'source': url,
                    'content_type': 'web_page'
                }
                metadata_list.append(metadata)
    
    # Get the Pinecone index
    index = pc.Index(INDEX_NAME)
    
    # Upsert data directly to Pinecone
    batch_size = 100
    for i in range(0, len(ids), batch_size):
        end_idx = min(i + batch_size, len(ids))
        batch_ids = ids[i:end_idx]
        batch_embeddings = embeddings_list[i:end_idx]
        batch_metadata = metadata_list[i:end_idx]
        
        vectors = [
            (batch_ids[j], batch_embeddings[j], batch_metadata[j])
            for j in range(len(batch_ids))
        ]
        
        index.upsert(vectors=vectors)
    
    print(f"Successfully processed {len(documents)} documents")

if __name__ == "__main__":
    # Extract URLs from file
    urls = extract_urls_from_file("crawl_results.txt")
    
    # Ensure index exists with correct configuration
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=768,  # Gemini text-embedding-001 dimension is 768
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-west-2")
        )
    
    # Process URLs and store in Pinecone
    process_urls(urls)
    
    print(f"Successfully processed {len(urls)} URLs and stored in Pinecone index: {INDEX_NAME}")