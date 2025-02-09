"use client";

import { useChat } from "ai/react";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import HashLoader from "react-spinners/HashLoader";

export default function Chatbot() {
  const [loading, setLoading] = useState<boolean>(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: () => setLoading(false),
  });

  return (
    <div className="flex flex-col w-full max-w-5xl ml-auto h-[95dvh] max-h-screen relative rounded-2xl bg-gray-500  bg-clip-padding backdrop-filter backdrop-blur-3xl  bg-opacity-10 border">
      <div className="py-6 px-10">
        <h1 className="text-6xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
          Blueprint AI
        </h1>
      </div>

      <div
        className="flex-1 overflow-y-auto p-10 pb-20 [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-zinc-300 
          [&::-webkit-scrollbar-thumb]:rounded-full
          dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600
          hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500"
      >
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap mb-4">
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-10 pb-4 ">
        <form
          onSubmit={(event) => {
            setLoading(!loading);
            handleSubmit();
            event.preventDefault();
          }}
          className="flex flex-row rounded-full shadow-xl  bg-gray-100  bg-clip-padding backdrop-filter backdrop-blur-3xl  bg-opacity-70 border border-gray-200"
        >
          <input
            className="w-full h-12 p-2 px-4  rounded-full shadow-xl  outline-none"
            value={input}
            placeholder="Ask me anything ..."
            onChange={handleInputChange}
            disabled={loading}
          />
          <button type="submit" className="w-12 ">
            {
                loading?
                <HashLoader size={28} color="#0077CC" className="mx-auto "/>
                :
                <ArrowUp className="text-gray-500 mx-auto "  />
            }
          </button>
        </form>
      </div>
    </div>
  );
}
