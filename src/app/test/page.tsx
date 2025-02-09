"use client";

import React from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import Image from 'next/image'
import { WavyBackground } from '@/components/ui/wavy-background';
import { Vortex } from '@/components/ui/vortex';

function Test() {
  return (
    <Vortex
    backgroundColor="#FFFFFF  "
    rangeY={800}
    particleCount={100}
    baseHue={2300}
    baseRadius={100}
    baseSpeed={0.0}
    className="flex  p-8 w-full min-h-screen max-h-screen justify-end gap-6"
  >
    <FloatingDock />
    {/* <Activity /> */}
    {/* <Chatbot /> */}
  </Vortex>
  )
}

export default Test