"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
// import { generateRecipe } from "./RecipieAction";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BarLoader from "react-spinners/BarLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import { generateRecipe } from "./actions"

export default function Recipe() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleRegenerate = () => {
    setShowForm(true);
    setRecipe(null);
  };
  async function generateRecipe(preferences: any) {
    try {
      const response = await fetch(`/api/generate-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const data = await response.json();
      return data.recipe;
    } catch (error) {
      console.error("Error in generateRecipe:", error);
      throw error;
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setRecipe(null);

    const formData = new FormData(event.currentTarget);
    const preferences = Object.fromEntries(formData.entries());

    try {
      const generatedRecipe = await generateRecipe(preferences);
      setRecipe(generatedRecipe);
      setShowForm(false);
    } catch (err) {
      setError("Failed to generate recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  function convertMarkdownToPdf(
    response: any,
    setDownloading: Dispatch<SetStateAction<boolean>>
  ): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col h-[80dvh] w-[95%] bg-gray-50 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
      <div className="sticky top-0 z-10 bg-gray-100 bg-opacity-30 backdrop-blur-sm bg-clip-padding backdrop-filter  border-b border-gray-100 p-4 ">
        {/* <h2 className="text-3xl text-gray-700 font-semibold ">
          Blueprint Recipe Generator
        </h2> */}
        {recipe && !showForm && (
          <div className="flex justify-between mb-4">
            <button
              onClick={handleRegenerate}
              className="px-8 py-0.5 border-2  border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
            >
              Regenerate Recipe
            </button>
            <button
              onClick={() => convertMarkdownToPdf(recipe, setDownloading)}
              className="px-8 py-0.5 border-2 text-[#0077CC] border-black dark:border-white uppercase bg-white transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
              disabled={downloading}
            >
              {downloading ? (
                <BarLoader width={100} color="#0077CC" />
              ) : (
                "Download Recipe"
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
        {recipe && !showForm && (
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
              {recipe}
            </ReactMarkdown>
          </div>
        )}
        {showForm&&<form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
            <Input
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              placeholder="e.g., vegan, gluten-free"
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="mealType">Meal Type</Label>
            <Select name="mealType" defaultValue="any">
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cookingTime">Maximum Cooking Time (minutes)</Label>
            <Input
              type="number"
              id="cookingTime"
              name="cookingTime"
              placeholder="e.g., 30"
              min="0"
              className="bg-white"
            />
          </div>
          <div>
            <Label>Calorie Range</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                id="minCalories"
                name="minCalories"
                placeholder="Min"
                min="0"
                className="w-full bg-white"
              />
              <span>to</span>
              <Input
                type="number"
                id="maxCalories"
                name="maxCalories"
                placeholder="Max"
                min="0"
                className="w-full bg-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="nutrientDensity">Nutrient Density (%)</Label>
            <Slider
              id="nutrientDensity"
              name="nutrientDensity"
              defaultValue={[90]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="additionalPreferences">
              Additional Preferences
            </Label>
            <Textarea
              id="additionalPreferences"
              name="additionalPreferences"
              placeholder="Any other preferences or requirements?"
              className="bg-white resize-none"
            />
          </div>
          <div>
            <Label htmlFor="includeIngredients">Ingredients to Include</Label>
            <Input
              id="includeIngredients"
              name="includeIngredients"
              placeholder="e.g., spinach, tofu"
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="excludeIngredients">Ingredients to Exclude</Label>
            <Input
              id="excludeIngredients"
              name="excludeIngredients"
              placeholder="e.g., nuts, dairy"
              className="bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-12 py-2 w-full border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
            disabled={isLoading}
          >
            {isLoading ? (
              <BarLoader width={500} color="#0077CC" />
            ) : (
              "Generate Blueprint"
            )}
          </button>
        </form>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
