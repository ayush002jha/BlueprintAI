import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export async function convertMarkdownToPdf(markdown: string, setLoading: (loading: boolean) => void) {
	try {
    setLoading(true);

	  // Extract a clean filename from the first line of the markdown
	  const filename = markdown
		.split('\n')[0]  // Get the first line
		.replace(/^#+\s*/, '')  // Remove leading hashtags and spaces
		.toLowerCase()  // Convert to lowercase
		.replace(/[^a-z0-9]/g, '-')  // Replace non-alphanumeric chars with hyphens
		.replace(/-+/g, '-')  // Replace multiple hyphens with single hyphen
		.replace(/^-|-$/g, '')  // Remove leading/trailing hyphens
		.substring(0, 50) + '.pdf';  // Limit length and add .pdf extension
  
	  const response = await axios.post(
		'https://md-to-pdf.fly.dev',
		`markdown=${encodeURIComponent(`${markdown}`)}`,
		{
		  headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		  },
		  responseType: 'blob'
		}
	  );
  
	  const url = window.URL.createObjectURL(new Blob([response.data]));
	  const link = document.createElement('a');
	  link.href = url;
	  link.download = filename || 'converted.pdf';
	  document.body.appendChild(link);
	  link.click();
  
	  // Clean up
	  document.body.removeChild(link);
	  window.URL.revokeObjectURL(url);
	} catch (error) {
	  console.error('Error converting markdown to PDF:', error);
	}finally{
    setLoading(false);
  }
  }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
