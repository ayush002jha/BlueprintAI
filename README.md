# Blueprint AI - Longevity Companion 🤖💙

[![Demo Video](https://img.youtube.com/vi/34BXeCM75dU/maxresdefault.jpg)](https://youtu.be/34BXeCM75dU)

AI-powered Q&A and personalization engine implementing Bryan Johnson's "Don't Die" protocol. Built with Next.js, Pinecone, and LangChain.

## ✨ Features
- **AI Q&A** - Answers questions about Bryan Johnson's Blueprint
- **Personalized Plans** - Generates custom health blueprints (PDF)
- **Recipe Engine** - Creates nutrient-dense meals
- **Open-Source** - Full RAG pipeline implementation

## 🚀 Installation

### **Frontend**

```bash
# Clone repo
git clone https://github.com/ayush002jha/BlueprintAI.git
cd BlueprintAI

# Install dependencies
npm install

# Start dev server
npm run dev
```

### **Backend**

- Set Up Environment, Add your API keys to `.env`

- Create a crawl_results.txt file with URLs to scrape:

```text
https://blueprint.bryanjohnson.com
https://blueprint.bryanjohnson.com/pages/biomarkers
https://blueprint.bryanjohnson.com/blogs/news
```
- Run the Script

```bash
python ragDb.py
```

### 🛠️ **Customization**
- **Chunk Size**: Adjust `chunk_size` and `chunk_overlap` in `text_splitter`.  
- **Index Name**: Change `INDEX_NAME` to use a different Pinecone index.  

### 🗂️ **Script Structure**
```python
# ragDb.py
├── extract_urls_from_file()  # Reads URLs from text file
├── scrape_page()             # Cleans HTML content
├── process_urls()            # Chunks text & uploads to Pinecone
└── Main Execution            # Runs the pipeline
```

### **What Happens?**
1. **Scraping**: Extracts clean text from URLs using BeautifulSoup.  
2. **Chunking**: Splits text into 1000-character chunks with 200-character overlap.  
3. **Embedding**: Generates OpenAI embeddings (`text-embedding-3-small`).  
4. **Upload**: Stores chunks + metadata in Pinecone index `blueprintai`.

---
