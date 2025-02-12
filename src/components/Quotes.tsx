import { useState, useEffect } from 'react';

const MotivationalQuotes = () => {
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quotes');
      const data = await response.json();
      if (data && data.length > 0) {
        setQuote(data[0].q);
        setAuthor(data[0].a);
      } else {
        setQuote('No quote found.');
        setAuthor('');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote('Failed to fetch quote.');
      setAuthor('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className=" bg-gray-200 m-4 p-4 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-100">
      <h2 className="text-lg  font-semibold text-black mb-4">
        🧘 Motivational Quote 🧘
      </h2>
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading...</p>
      ) : (
        <>
          <p className="text-sm text-gray-800 italic">"{quote}"</p>
          {author && <p className="text-xs text-gray-600 mt-2">- {author}</p>}
        </>
      )}

    </div>
  );
};

export default MotivationalQuotes;
