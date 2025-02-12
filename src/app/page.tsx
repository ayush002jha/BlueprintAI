"use client";
import Chatbot from "@/components/Chatbot";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Vortex } from "@/components/ui/vortex";
import Activity from "@/components/Activity";
import { useTab } from "@/providers/tabs-provider";
import { Dna } from "lucide-react";
import Blueprint from "@/components/Blueprint";
import Recipe from "@/components/Recipe";

export default function Chat() {
  const { selectedTab } = useTab();
  return (
    <Vortex
      backgroundColor="#FFFFFF  "
      rangeY={800}
      particleCount={1000}
      baseHue={30}
      baseRadius={20}
      baseSpeed={0.0}
      className="flex  p-8  px-32 w-full min-h-screen max-h-screen justify-end gap-12"
    >
      <FloatingDock />
      <Activity />
      <div className="flex flex-col w-full max-w-5xl h-screen lg:h-[95dvh] max-h-screen relative rounded-2xl bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-10 border  items-center justify-center">
        <div className="my-6 px-10 self-start">
          <div className=" flex items-center justify-center gap-4 ">
            <h1 className="text-6xl text-gray-700 font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Blueprint AI
            </h1>
            <Dna size={50} color="#0077CC" />
            {/* {
              <h2 className="text-3xl text-gray-700 font-semibold  ms-full">
                {selectedTab === "Personalized BluePrint"
                  ? "Personalized Blueprint"
                  : selectedTab === "Recipie Genie"
                  ? "Blueprint Recipe"
                  : null}
              </h2>
            } */}
          </div>
          <p className="p-2 italic font-medium  text-lg">
            {selectedTab === "Personalized BluePrint"
              ? "Personalized Blueprint Generator"
              : selectedTab === "Recipie Genie"
              ? "Blueprint Recipe Generator"
              : "Blueprinting a Healthier You"}
          </p>
        </div>
        {selectedTab == "Home" ? (
          <Chatbot />
        ) : selectedTab == "Personalized BluePrint" ? (
          <Blueprint />
        ) : (
          <Recipe />
        )}
      </div>
    </Vortex>
  );
}
