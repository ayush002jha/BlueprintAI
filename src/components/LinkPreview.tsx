import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import { ArrowUpRight } from "lucide-react";

interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

interface OpenGraphPreviewProps {
  url: string;
}

// Create a memoized version of the preview component
const OpenGraphPreview: React.FC<OpenGraphPreviewProps> = memo(({ url }) => {
  const [ogData, setOgData] = useState<OpenGraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchOpenGraphData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<OpenGraphData>(
          `/api/link-preview?url=${encodeURIComponent(url)}`,
          { signal: controller.signal }
        );
        if (isMounted) {
          setOgData(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted && !axios.isCancel(err)) {
          setError("Failed to fetch Open Graph data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOpenGraphData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url]);

  // Return early if loading
  if (isLoading) {
    return <div className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>;
  }

  // Return simple link if there's an error
  if (error) {
    return (
      <div className="text-blue-600 hover:underline">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </div>
    );
  }

  if (!ogData) {
    return null;
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block no-underline hover:no-underline my-2"
    >
      <div className="p-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200 flex flex-col md:flex-row gap-2 items-center justify-between bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-100">
        {ogData.image && (
          <div className="flex-shrink-0">
            <img
              src={ogData.image}
              alt={ogData.title || ""}
              className="h-18 md:w-40 md:h-22 object-fill md:object-cover rounded-md"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-grow flex flex-col justify-between min-w-0">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-medium truncate">{ogData.title}</h3>
            <ArrowUpRight size={40} className="flex-shrink-0 w-12 p-2 rounded-lg" />
          </div>
          {ogData.description && (
            <p className="text-sm font-light line-clamp-2">{ogData.description}</p>
          )}
        </div>
      </div>
    </a>
  );
});

// Add display name for debugging
OpenGraphPreview.displayName = 'OpenGraphPreview';

// Wrap the component with React.memo
export default React.memo(OpenGraphPreview);