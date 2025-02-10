// src/components/ui/floating-dock.tsx
import { cn } from "@/lib/utils";
import React from "react";
import { HomeIcon, HelpCircleIcon, VideoIcon, BookOpenIcon, PenToolIcon, GraduationCapIcon } from 'lucide-react';

import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { useTab } from "@/providers/tabs-provider";

const links = [
  {
    title: "Home",
    href: "/",
    useCase: "🏠 Where can I find an overview of all features?",
    icon: <HomeIcon className="h-full w-full" />,
  },
  {
    title: "Q&A",
    href: "9d25f43d-3644-490e-bb1d-8a6bb2a35d08",
    useCase: "❓ How can I get instant answers to my questions?",
    icon: <HelpCircleIcon />,
  },
  {
    title: "YTVideoSummarizer",
    href: "ec62ea72-cb10-430e-8b49-64b852d08812",
    useCase: "🎥 Can you summarize this YouTube video for me?",
    icon: <VideoIcon />,
  },
  {
    title: "ResearchAssist",
    href: "7119bf6f-b8e1-4f1a-8b85-711ff8496ed9",
    useCase: "🔬 How can AI help with my research paper?",
    icon: <BookOpenIcon />,
  },
  {
    title: "DigiNotes",
    href: "fe7ddfe6-79b0-486d-817f-f68937facf05",
    useCase: "📝 Can you convert my handwritten notes to digital format?",
    icon: <PenToolIcon />,
  },
  {
    title: "Doubtnut",
    href: "38ff4010-21b2-4f81-8da2-fcd9b54aee05",
    useCase: "📚 How can I get step-by-step solutions for my homework?",
    icon: <GraduationCapIcon />,
  },
];

const renderIcon = (selected: string, title: string, icon: React.ReactNode) => (
  <div className={`  ${selected === title ? "text-white" : "text-gray-500"}`}>
    {icon}
  </div>
);

export const FloatingDock = ({
  desktopClassName,
}: {
  desktopClassName?: string;
}) => {
  const { selectedTab, updateSelectedTab } = useTab();

  return (
    <>
      <FloatingDockDesktop
        items={links.map(link => ({
          ...link,
          icon: renderIcon(selectedTab, link.title, link.icon),
        }))}
        className={desktopClassName}
      />
    </>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  let mouseY = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e: { pageY: number }) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "mx-auto hidden xl:flex flex-col w-20 py-2 gap-4 items-center justify-center rounded-2xl bg-gray-500  bg-clip-padding backdrop-filter backdrop-blur-3xl  bg-opacity-10 border border-gray-100 fixed left-36 z-10 top-1/2 -translate-y-1/2",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseY={mouseY} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

const IconContainer = React.memo(({
  mouseY,
  title,
  icon,
  href,
}: {
  mouseY: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) => {
  let ref = useRef<HTMLDivElement>(null);
  let distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);
  const { selectedTab, updateSelectedTab } = useTab();

  return (
    <motion.div
      ref={ref}
      onClick={() => updateSelectedTab(title)}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`aspect-square rounded-full  flex items-center justify-center relative cursor-pointer ${
        selectedTab === title ? "bg-blue-600" : "h-full w-full bg-gray-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-100"
      }`}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 2, y: "-50%" }}
            className="px-2 py-0.5 whitespace-pre rounded-md border bg-neutral-800 border-neutral-900 text-white absolute left-full ml-2 top-1/2 -translate-y-1/2 w-fit text-base"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center "
      >
        {icon}
      </motion.div>
    </motion.div>
  );
});
IconContainer.displayName = "IconContainer";
