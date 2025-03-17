"use client";
import Chatbot from "@/components/Chatbot";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Vortex } from "@/components/ui/vortex";
import Activity from "@/components/Activity";
import { useTab } from "@/providers/tabs-provider";
import { Dna } from "lucide-react";
import Blueprint from "@/components/Blueprint";
import Recipe from "@/components/Recipe";
import { useEffect, useState } from "react";
import MealPlan from "@/components/MealPlan";

export default function Chat() {
  const { selectedTab } = useTab();
  const [viewportHeight, setViewportHeight] = useState(0);

  // Handle viewport height changes and address mobile browser address bar issues
  useEffect(() => {
    // Set initial viewport height
    setViewportHeight(window.innerHeight);

    const handleResize = () => {
      // Use setTimeout to ensure we get the final height after any UI elements appear/disappear
      setTimeout(() => {
        setViewportHeight(window.innerHeight);
      }, 100);
    };

    // Listen for resize and orientation change events
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Clean up event listeners
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return (
    <div style={{ height: `${viewportHeight}px` }} className="overflow-hidden">
      <Vortex
        backgroundColor="#FFFFFF"
        rangeY={800}
        particleCount={1000}
        baseHue={30}
        baseRadius={20}
        baseSpeed={0.0}
        className={`grid grid-cols-1 md:grid-cols-11 w-full h-full justify-items-center overflow-hidden md:px-8 md:py-6 gap-12 `}
      >
        {/* Left sidebar - hidden on mobile */}
        <div className="absolute md:relative md:flex md:flex-col justify-center md:col-span-1">
          <FloatingDock />
        </div>

        {/* Activity panel - only visible on xl screens */}
        <div className="hidden xl:flex xl:col-span-3">
          <Activity />
        </div>

        {/* Main content area - adapts to different screen sizes */}
        <div className="col-span-1 md:col-span-10 xl:col-span-7 flex flex-col items-center min-h-full w-full rounded-none md:rounded-2xl bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-10 border">
          {/* Header section */}
          <div className="pt-4 pb-2 px-4 md:px-10 self-start w-full">
            <div className="flex items-center gap-2 md:gap-4">
              <h1 className="text-5xl md:text-6xl text-gray-700 font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Blueprint AI
              </h1>
              <Dna size={50} className="md:size-50" color="#0077CC" />
            </div>
            <p className="px-2 italic font-medium text-base md:text-lg">
              {selectedTab === "Personalized BluePrint"
                ? "Personalized Blueprint Generator"
                : selectedTab === "Recipie Genie"
                ? "Blueprint Recipe Generator"
                : selectedTab === "Weekly Meal Plan"
                ? "Zo Weekly Meal Plan Generator"
                : "Blueprinting a Healthier You"}
            </p>
          </div>

          {/* Content section - fills remaining height without causing overflow */}
          <div className="flex flex-col items-center flex-grow overflow-hidden w-full h-full">
            {selectedTab === "Home" ? (
              <Chatbot />
            ) : selectedTab === "Personalized BluePrint" ? (
              <Blueprint />
            ) : selectedTab === "Weekly Meal Plan" ? (
              <MealPlan />
            ) : (
              <Recipe />
            )}
          </div>
        </div>
      </Vortex>
    </div>
  );
}
