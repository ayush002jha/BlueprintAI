"use client"

import React from "react";
import Products from "./Products";

function Activity() {
  return (
    <div className=" sm:hidden xl:flex flex-col h-[95dvh]  w-full max-w-md max-h-screen rounded-2xl bg-gray-500  bg-clip-padding backdrop-filter backdrop-blur-3xl  bg-opacity-10 border">
      <div className="py-6 px-6">
        <h1 className="text-6xl text-gray-700 font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
          Insights
        </h1>
      </div>
      <Products />
    </div>
  );
}

export default Activity;
