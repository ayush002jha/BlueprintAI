import os
import re
import requests
from pinecone import Pinecone
from bs4 import BeautifulSoup
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Pinecone as PineconeLangchain
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# Configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
INDEX_NAME = "blueprintai"

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Initialize text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
)

# Initialize embeddings
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY,model='text-embedding-3-small')

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
    
    for url in urls:
        print(f"Processing: {url}")
        content = scrape_page(url)
        
        if content:
            # Split text into chunks
            chunks = text_splitter.split_text(content)
            
            # Create documents with metadata
            for chunk in chunks:
                documents.append({
                    'text': chunk,
                    'metadata': {
                        'source': url,
                        'content_type': 'web_page'
                    }
                })
    
    # Create or connect to Pinecone index
    PineconeLangchain.from_texts(
        texts=[doc['text'] for doc in documents],
        metadatas=[doc['metadata'] for doc in documents],
        embedding=embeddings,
        index_name=INDEX_NAME
    )

if __name__ == "__main__":
    # Extract URLs from file
    urls = extract_urls_from_file("crawl_results.txt")
    
    # Ensure index exists with correct configuration
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=1536,  # OpenAI embeddings dimension
            metric="cosine",
            spec=pc.IndexSpec(
                pod_type="p1.x1"
            )
        )
    
    # Process URLs and store in Pinecone
    process_urls(urls)
    
    print(f"Successfully processed {len(urls)} URLs and stored in Pinecone index: {INDEX_NAME}")