"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BarLoader from "react-spinners/BarLoader";
import { convertMarkdownToPdf } from "@/lib/utils";

const PersonalizedBlueprint = () => {
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<string>(""); // New state for gender
  const [weight, setWeight] = useState<number | "">("");  // New state for weight
  const [diet, setDiet] = useState<string>("Omnivore");
  const [sleep, setSleep] = useState<number | "">("");
  const [goals, setGoals] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleRegenerate = () => {
    setShowForm(true);
    setResponse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/generate-blueprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ age, gender, weight, diet, sleep, goals }), // Added new fields
      });

      const result = await res.json();

      if (res.ok) {
        setResponse(result.details);
        setShowForm(false);
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred while submitting the form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[84dvh] w-[95%] bg-gray-50 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
      <div className="sticky top-0 z-10 bg-gray-100 bg-opacity-30 backdrop-blur-sm bg-clip-padding backdrop-filter  border-b border-gray-100 p-9 pb-4">
        {/* <h2 className="text-3xl text-gray-700 font-semibold mb-4">
          Personalized Blueprint Generator
        </h2> */}
        {response && !showForm && (
          <div className="flex justify-between mb-4">
            <button
              onClick={handleRegenerate}
              className="px-8 py-0.5 border-2  border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
            >
              Regenerate Blueprint
            </button>
            <button
              onClick={() => convertMarkdownToPdf(response, setDownloading)}
              className="px-8 py-0.5 border-2 text-[#0077CC] border-black dark:border-white uppercase bg-white transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
              disabled={downloading}
            >
              {downloading ? (
                <BarLoader width={100} color="#0077CC" />
              ) : (
                "Download Blueprint"
              )}
            </button>
          </div>
        )}
      </div>

      <div
        className="flex-1 overflow-y-auto px-9 pb-9 [&::-webkit-scrollbar]:w-2 
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-zinc-300 
            [&::-webkit-scrollbar-thumb]:rounded-full
            dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600
            hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400
            dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500"
      >
        {response && !showForm && (
          <div className="mt-4 p-4 bg-gray-50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100 rounded-lg">
            <ReactMarkdown
              className="prose prose-lg whitespace-normal max-w-none dark:prose-invert 
              [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6
              [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-5
              [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4
              [&>p]:mb-4 [&>p]:leading-relaxed
              [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul>li]:mb-2
              [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol>li]:mb-2
              [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic
              [&>*:first-child]:mt-0"
              remarkPlugins={[remarkGfm]}
            >
              {response}
            </ReactMarkdown>
          </div>
        )}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value ? parseInt(e.target.value) : "")
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) =>
                  setWeight(e.target.value ? parseInt(e.target.value) : "")
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label
                htmlFor="diet"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Diet
              </label>
              <select
                id="diet"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full border bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>Omnivore</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Keto</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="sleep"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Average Sleep (hours)
              </label>
              <input
                type="number"
                id="sleep"
                value={sleep}
                onChange={(e) =>
                  setSleep(e.target.value ? parseInt(e.target.value) : "")
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label
                htmlFor="goals"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Health Goals
              </label>
              <textarea
                id="goals"
                rows={3}
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-12 py-2 w-full border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
              disabled={loading}
            >
              {loading ? (
                <BarLoader width={500} color="#0077CC" />
              ) : (
                "Generate Blueprint"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PersonalizedBlueprint;