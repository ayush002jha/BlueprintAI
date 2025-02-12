// src/app/api/link-preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
// types/OpenGraphData.ts
export interface OpenGraphData {
    title?: string;
    description?: string;
    image?: string;
    url: string;
  } 
  
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is missing' }, { status: 400 });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const getMetaTag = (name: string) =>
      $(`meta[property='${name}']`).attr('content') ||
      $(`meta[name='${name}']`).attr('content');

    const ogData: OpenGraphData = {
      title: getMetaTag('og:title') || $('title').text(),
      description: getMetaTag('og:description') || '',
      image: getMetaTag('og:image') || '',
      url,
    };

    return NextResponse.json(ogData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Open Graph data' }, { status: 500 });
  }
}
