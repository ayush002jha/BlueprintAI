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
import Image from "next/image";
import { useTab } from "@/providers/tabs-provider";

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
    "🚀 How can i improve my health with Don't Die Blueprint??",
    "📊 What biomarkers does Blueprint track and why?",
    "💸 What supplements to take as a beginner?",
  ];

  const { selectedTab, updateSelectedTab } = useTab();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuestionClick = (question: string) => {
    setInput(question); // Set the input value

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
      <div
        className={cn(
          "transition-opacity duration-300",
          showQuestions
            ? "opacity-100"
            : "opacity-0 pointer-events-none h-0 overflow-hidden"
        )}
      >
        <div className="flex items-center justify-start gap-4 px-4 md:px-12 my-2 md:my-6">
          <BounceLoader size={60} color="#0077CC" />
          <div>
            <p className="text-base md:text-lg font-light">Hi, You!</p>
            <p className="text-lg md:text-xl font-semibold">
              How can I help you?
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:justify-between w-full h-full p-2">
          {/* Questions Grid - Responsive layout that goes from 1 column on mobile to 2 columns on larger screens */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-3/4 h-2/4 md:h-full xl:h-2/4 px-4 md:px-0 md:mb-6">
            {questions.map((q, index) => (
              <button
                key={index}
                className="flex items-center text-sm md:text-lg font-medium justify-center p-4 md:p-6 hover:bg-gray-200 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-100 text-center shadow-lg w-full h-full"
                type="button"
                onClick={() => handleQuestionClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="md:hidden grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:w-3/4 h-2/4 md:h-full xl:h-2/4 px-4 md:px-0 md:mb-6">
            {questions.slice(0, 2).map((q, index) => (
              <button
                key={index}
                className="flex items-center text-sm md:text-lg font-medium justify-center p-4 md:p-6 hover:bg-gray-200 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-100 text-center shadow-lg w-full h-full"
                type="button"
                onClick={() => handleQuestionClick(q)}
              >
                {q}
              </button>
            ))}
          </div>

          {/* GIF-based Divs - Changes from column on mobile to row on larger screens */}
          <div className="flex md:hidden xl:flex flex-col md:flex-row w-full md:w-3/4 items-center justify-center mb-10 md:mb-24 gap-2 md:gap-6 px-6 pt-0">
            {/* First GIF div with retro font */}
            <div
              onClick={() => updateSelectedTab("Weekly Meal Plan")}
              className="flex flex-row items-center text-sm md:text-lg font-medium bg-blue-700 justify-around cursor-pointer p-4 rounded-xl overflow-hidden border border-gray-100 text-center shadow-lg w-full h-24 md:h-full  relative"
            >
              <div className="flex flex-row items-center justify-around w-full ">
                <Image
                  src={"/zoho.png"}
                  alt={"Zo-logo"}
                  width={500}
                  height={500}
                  className="w-24 md:w-32 invert"
                  priority
                />
                <span className="mx-1">🍝🍤🍜</span>
                <p className="w-full font-['VT323','Courier',monospace] text-base md:text-2xl font-bold text-white">
                  Weekly Meal Plan
                </p>
              </div>
            </div>

            {/* Second GIF div with retro font */}
            <div
              onClick={() => updateSelectedTab("Kally")}
              className="flex flex-row items-center text-sm md:text-lg font-medium justify-around cursor-pointer p-4 md:p-6 rounded-xl overflow-hidden bg-white border border-gray-100 text-center shadow-lg w-full h-24 md:h-full"
            >
              <Image
                src={"/scan.gif"}
                alt={"scan-logo"}
                width={500}
                height={500}
                className="w-24 md:w-32"
                priority
              />
              <div>
                <p className="font-['VT323','Courier',monospace] text-base md:text-2xl font-bold">
                  Kally
                </p>
                <p className="font-['VT323','Courier',monospace] text-base md:text-xl">
                  Calorie Scanner
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col items-end flex-1 overflow-y-auto p-4 md:p-10 pb-20 w-full h-full",
          "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb]:rounded-full",
          "dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600",
          "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400",
          "dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500",
          showQuestions ? "hidden" : "flex"
        )}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "whitespace-pre mb-4 w-auto flex gap-4 md:gap-6 p-4 bg-gray-100 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-100",
              m.role == "assistant" && "self-start"
            )}
          >
            {m.role === "user" ? (
              <>
                <ReactMarkdown
                  className="prose prose-sm md:prose-lg whitespace-normal dark:prose-invert 
                  [&>h1]:text-xl md:[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6
                  [&>h2]:text-lg md:[&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-5
                  [&>h3]:text-base md:[&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4
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
                <BounceLoader size={30} color="#0077CC" className="shrink-0" />
                <ReactMarkdown
                  className=" prose prose-sm md:prose-lg whitespace-normal dark:prose-invert 
                  [&>h1]:text-xl md:[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6
                  [&>h2]:text-lg md:[&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-5
                  [&>h3]:text-base md:[&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4
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

      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-10 pb-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-row rounded-full shadow-xl bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-70 border border-gray-200"
        >
          <input
            className="w-full h-10 md:h-12 p-2 px-4 rounded-full shadow-xl outline-none"
            value={input}
            placeholder="Ask me anything ..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button type="submit" className="w-10 md:w-12">
            {isLoading ? (
              <HashLoader size={28} color="#0077CC" className="mx-auto" />
            ) : (
              <ArrowUp className="text-gray-500 mx-auto" />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
