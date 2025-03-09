"use client";

import React from "react";
import Products from "./Products";
import MotivationalQuotes from "./Quotes";
import HealthCard from "./HealthCard";

function Activity() {
  return (
    <div
      className="flex flex-col h-[95dvh]  w-full  max-h-screen rounded-2xl bg-gray-500  bg-clip-padding backdrop-filter backdrop-blur-3xl  bg-opacity-10 border flex-1 overflow-y-auto  [&::-webkit-scrollbar]:w-2 
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-zinc-300 
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600
                  hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400
                  dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500"
    >
      <div className="py-6 px-6 sticky top-0 z-10  bg-gray-100 bg-opacity-90 backdrop-blur-sm bg-clip-padding backdrop-filter  border-b border-gray-100 ">
        <h1 className="text-6xl text-gray-700 font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
          Activity
        </h1>
      </div>
      <MotivationalQuotes />
      <div className="bg-gray-200 mx-4 p-4 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-100">
        <h3 className="text-xl font-semibold text-black mb-4">
          Daily Progress
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-800 mb-2">
              <span>Steps Goal (10,000)</span>
              <span>84%</span>
            </div>
            <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/20 blur-sm"></div>
              <div className="relative w-[84%] h-full bg-gradient-to-r from-blue-500 to-blue-800 rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Calories Goal (2,000)</span>
              <span>92%</span>
            </div>
            <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/20 blur-sm"></div>
              <div className="relative w-[92%] h-full bg-gradient-to-r from-orange-500 to-orange-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      <Products />
    </div>
  );
}

export default Activity;
