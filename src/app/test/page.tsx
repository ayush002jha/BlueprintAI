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
                baseHue={20}
                baseRadius={100}
                baseSpeed={0.0}
                className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full min-h-screen   "
      >
              <FloatingDock />



        {/* <WavyBackground backgroundFill='white' blur={10} waveOpacity={0.5} waveWidth={80} speed='fast'/> */}
    </Vortex>
  )
}

export default Test