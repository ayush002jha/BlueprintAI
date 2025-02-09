"use client"
import Chatbot from "@/components/Chatbot";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Vortex } from "@/components/ui/vortex";
import Activity from "@/components/Activity";

export default function Chat() {
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
      <Chatbot />
    </Vortex>
  );
}
