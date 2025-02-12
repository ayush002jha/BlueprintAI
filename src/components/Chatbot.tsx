"use client";

import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { ArrowUp, UserRound } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import HashLoader from "react-spinners/HashLoader";
import BounceLoader from "react-spinners/BounceLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import OpenGraphPreview from "./LinkPreview";
import { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export default function Chatbot() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({ onResponse: () => setShowQuestions(false) });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showQuestions, setShowQuestions] = useState(true);
  const questions = [
    "🧬 What is Bryan Johnson's Don't Die Blueprint in simple terms?",
    "🚀 What's the first step to start following the Blueprint?",
    "📊 What biomarkers does Blueprint track and why?",
    "💸 What if I can't afford all Blueprint supplements?",
  ];
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuestionClick = (question: string) => {
    setInput(question); // Set the input value
    setShowQuestions(false);

    // Programmatically submit the form after a short delay
    setTimeout(() => {
      const form = document.querySelector("form") as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 50);
  };

  // Inside the component, memoize plugins and components
  const remarkPlugins = useMemo(() => [remarkGfm], []);
  const markdownComponents = useMemo<Components>(
    () => ({
      a: ({ href, children, ...props }) => {
        if (href) {
          return <OpenGraphPreview url={href} />;
        }
        return <>{children}</>;
      },
    }),
    []
  );

  return (
    <>
      {showQuestions && (
        <div className="flex items-center justify-center gap-4 self-start px-12 my-12 ">
          <BounceLoader size={60} color="#0077CC" />
          <div>
            <p className="text-lg font-light">Hi, You!</p>
            <p className="text-xl font-semibold">How can I help you?</p>
          </div>
        </div>
      )}

      {showQuestions ? (
        <div className="grid grid-cols-2 gap-4 w-3/4 h-2/4 mb-auto">
          {questions.map((q, index) => (
            <button
              key={index}
              className="flex items-center text-lg font-medium  justify-center p-6 hover:bg-gray-200 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-100 text-center shadow-lg w-full h-full"
              type="button" // Changed to type="button"
              onClick={() => handleQuestionClick(q)} // Use new handler
            >
              {q}
            </button>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-end flex-1 overflow-y-auto p-10 pb-20 w-full h-full [&::-webkit-scrollbar]:w-2 
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-zinc-300 
            [&::-webkit-scrollbar-thumb]:rounded-full
            dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600
            hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400
            dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "whitespace-pre  mb-4 flex  gap-6  p-4 bg-gray-100 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-100",
                m.role == "assistant" && "self-start"
              )}
            >
              {m.role === "user" ? (
                <>
                  <ReactMarkdown
                    className="prose prose-lg whitespace-normal dark:prose-invert 
                    [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6
                    [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-5
                    [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4
                    [&>p]:mb-4 [&>p]:leading-relaxed
                    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul>li]:mb-2
                    [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol>li]:mb-2
                    [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic
                    [&>*:first-child]:mt-0"
                    remarkPlugins={remarkPlugins}
                    components={markdownComponents}
                  >
                    {m.content}
                  </ReactMarkdown>
                  <UserRound size={30} className="shrink-0" />
                </>
              ) : (
                <>
                  <BounceLoader
                    size={30}
                    color="#0077CC"
                    className="shrink-0"
                  />
                  <ReactMarkdown
                    className="prose prose-lg whitespace-normal  dark:prose-invert 
                    [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6
                    [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-5
                    [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4
                    [&>p]:mb-4 [&>p]:leading-relaxed
                    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul>li]:mb-2
                    [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol>li]:mb-2
                    [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic
                    [&>*:first-child]:mt-0"
                    remarkPlugins={remarkPlugins}
                    components={markdownComponents}
                  >
                    {m.content}
                  </ReactMarkdown>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 px-10 pb-4 ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-row rounded-full shadow-xl bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-70 border border-gray-200"
        >
          <input
            className="w-full h-12 p-2 px-4 rounded-full shadow-xl outline-none"
            value={input}
            placeholder="Ask me anything ..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button type="submit" className="w-12 ">
            {isLoading ? (
              <HashLoader size={28} color="#0077CC" className="mx-auto " />
            ) : (
              <ArrowUp className="text-gray-500 mx-auto " />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
