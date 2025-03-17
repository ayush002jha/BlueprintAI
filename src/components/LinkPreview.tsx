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

  if (isLoading) {
    return <div className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>;
  }

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
      className="block no-underline hover:no-underline my-2 w-full"
    >
      <div className="p-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200 flex flex-col md:flex-row gap-3 items-center bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-200 w-full max-w-[70vw] md:max-w-full">
        {ogData.image && (
          <div className="flex-shrink-0 w-full sm:w-24 md:w-32 lg:w-40">
            <img
              src={ogData.image}
              alt={ogData.title || ""}
              className="w-full h-auto object-cover rounded-md"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-grow flex flex-col justify-between min-w-0">
          <div className="flex justify-between items-center gap-2 w-full">
            <h3 className="font-medium truncate">{ogData.title}</h3>
            <ArrowUpRight size={20} className="flex-shrink-0" />
          </div>
          {ogData.description && (
            <p className="text-sm font-light line-clamp-2">{ogData.description}</p>
          )}
        </div>
      </div>
    </a>
  );
});

OpenGraphPreview.displayName = "OpenGraphPreview";
export default React.memo(OpenGraphPreview);
