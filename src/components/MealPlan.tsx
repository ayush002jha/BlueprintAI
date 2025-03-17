"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { convertMarkdownToPdf } from "@/lib/utils";
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

export default function MealPlan() {
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleRegenerate = () => {
    setShowForm(true);
    setMealPlan(null);
  };

  async function generateMealPlan(preferences: any) {
    try {
      const response = await fetch(`/api/generate-meal-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });
      if (!response.ok) {
        throw new Error("Failed to generate meal plan");
      }
      const data = await response.json();
      return data.mealPlan;
    } catch (error) {
      console.error("Error in generateMealPlan:", error);
      throw error;
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMealPlan(null);
    const formData = new FormData(event.currentTarget);
    const preferences = Object.fromEntries(formData.entries());
    try {
      const generatedMealPlan = await generateMealPlan(preferences);
      setMealPlan(generatedMealPlan);
      setShowForm(false);
    } catch (err) {
      setError("Failed to generate meal plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] md:h-[80dvh] w-[95%] bg-gray-50 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
      <div className="sticky top-0 z-10 bg-gray-100 bg-opacity-30 backdrop-blur-sm bg-clip-padding backdrop-filter border-b border-gray-100 p-4">
        {mealPlan && !showForm && (
          <div className="flex justify-between gap-4 mb-2">
            <button
              onClick={handleRegenerate}
              className="px-8 py-0.5 border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
            >
              Regenerate Meal Plan
            </button>
            <button
              onClick={() => convertMarkdownToPdf(mealPlan, setDownloading)}
              className="px-8 py-0.5 border-2 text-[#0077CC] border-black dark:border-white uppercase bg-white transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
              disabled={downloading}
            >
              {downloading ? (
                <BarLoader width={80} height={4} color="#0077CC" />
              ) : (
                "Download Meal Plan"
              )}
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 md:px-9 pb-6 md:pb-9 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500">
        {mealPlan && !showForm && (
          <div className="mt-4 p-4 bg-gray-50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100 rounded-lg">
            <ReactMarkdown
              className="prose prose-sm md:prose-base lg:prose-lg whitespace-normal max-w-none dark:prose-invert [&>h1]:text-xl md:[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6 [&>h2]:text-lg md:[&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-5 [&>h3]:text-base md:[&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:mt-4 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol>li]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>*:first-child]:mt-0"
              remarkPlugins={[remarkGfm]}
            >
              {mealPlan}
            </ReactMarkdown>
          </div>
        )}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="numberOfWeeks">Number of Weeks</Label>
              <Input
                type="number"
                id="numberOfWeeks"
                name="numberOfWeeks"
                placeholder="e.g., 1"
                min="1"
                className="bg-white"
              />
            </div>
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
              <Label htmlFor="mealPlanType">Meal Plan Type</Label>
              <Select name="mealPlanType" defaultValue="balanced">
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select meal plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="gluten_free">Gluten-Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dailyMealCount">Daily Meal Count</Label>
              <Input
                type="number"
                id="dailyMealCount"
                name="dailyMealCount"
                placeholder="e.g., 3"
                min="1"
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="maxCookingTime">
                Maximum Cooking Time per Meal (minutes)
              </Label>
              <Input
                type="number"
                id="maxCookingTime"
                name="maxCookingTime"
                placeholder="e.g., 30"
                min="0"
                className="bg-white"
              />
            </div>
            <div>
              <Label>Calorie Range per Meal</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  type="number"
                  id="minCalories"
                  name="minCalories"
                  placeholder="Min"
                  min="0"
                  className="w-full bg-white"
                />
                <span className="hidden sm:inline">to</span>
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
              className="px-6 sm:px-12 py-2 w-full border-2 flex justify-center items-center border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="block sm:hidden">
                    <BarLoader width={150} color="#0077CC" />
                  </div>
                  <div className="hidden sm:block md:hidden">
                    <BarLoader width={260} color="#0077CC" />
                  </div>
                  <div className="hidden md:block">
                    <BarLoader width={500} color="#0077CC" />
                  </div>
                </>
              ) : (
                "Generate Meal Plan"
              )}
            </button>
          </form>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
