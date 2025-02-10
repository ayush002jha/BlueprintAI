import * as cheerio from 'cheerio';
import { NodeHtmlMarkdown } from 'node-html-markdown';

interface Page {
  url: string;
  content: string;
}

class Crawler {
  private seen = new Set<string>();
  private pages: Page[] = [];
  private queue: { url: string; depth: number }[] = [];

  constructor(private maxDepth = 2, private maxPages = 1) { }

  async crawl(startUrl: string): Promise<Page[]> {
    console.log('\n=== Starting Crawl ===');
    console.log(`Start URL: ${startUrl}`);
    console.log(`Max Depth: ${this.maxDepth}`);
    console.log(`Max Pages: ${this.maxPages}\n`);
    
    this.addToQueue(startUrl);

    while (this.shouldContinueCrawling()) {
      const { url, depth } = this.queue.shift()!;

      if (this.isTooDeep(depth) || this.isAlreadySeen(url)) {
        console.log(`Skipping ${url} (${this.isTooDeep(depth) ? 'too deep' : 'already seen'})`);
        continue;
      }

      console.log(`\nCrawling (${this.pages.length + 1}/${this.maxPages}): ${url}`);
      console.log(`Depth: ${depth}/${this.maxDepth}`);
      
      this.seen.add(url);
      const html = await this.fetchPage(url);

      if (html) {
        this.pages.push({ url, content: this.parseHtml(html) });
        const newUrls = this.extractUrls(html, url);
        console.log(`Found ${newUrls.length} links on page`);
        this.addNewUrlsToQueue(newUrls, depth);
      }
    }

    console.log('\n=== Crawl Complete ===');
    console.log('URLs crawled successfully:');
    this.pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.url}`);
    });
    console.log(`\nTotal pages crawled: ${this.pages.length}`);
    console.log('===================\n');

    return this.pages;
  }

  private isTooDeep(depth: number) {
    return depth > this.maxDepth;
  }

  private isAlreadySeen(url: string) {
    return this.seen.has(url);
  }

  private shouldContinueCrawling() {
    return this.queue.length > 0 && this.pages.length < this.maxPages;
  }

  private addToQueue(url: string, depth = 0) {
    this.queue.push({ url, depth });
  }

  private addNewUrlsToQueue(urls: string[], depth: number) {
    this.queue.push(...urls.map(url => ({ url, depth: depth + 1 })));
  }

  private async fetchPage(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error(`Failed to fetch ${url}: ${error}`);
      return '';
    }
  }

  private parseHtml(html: string): string {
    const $ = cheerio.load(html);
    $('a').removeAttr('href');
    return NodeHtmlMarkdown.translate($.html());
  }

  private extractUrls(html: string, baseUrl: string): string[] {
    const $ = cheerio.load(html);
    const relativeUrls = $('a').map((_, link) => $(link).attr('href')).get() as string[];
    return relativeUrls.map(relativeUrl => {
      try {
        return new URL(relativeUrl, baseUrl).href;
      } catch (error) {
        console.warn(`Invalid URL found: ${relativeUrl}`);
        return '';
      }
    }).filter(url => url); // Remove empty strings
  }
}

export { Crawler };
export type { Page };