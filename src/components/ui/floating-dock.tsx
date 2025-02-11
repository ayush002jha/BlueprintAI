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
    icon: <HomeIcon className="h-full w-full" />,
  },
  {
    title: "Personalized BluePrint",
    href: "/report",
    icon: <HelpCircleIcon />,
  },
  {
    title: "Recipie Genie",
    href: "/recipie",
    icon: <VideoIcon />,
  }
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
        "mx-auto hidden xl:flex flex-col w-20 py-6 gap-8 items-center justify-center rounded-2xl bg-gray-500  bg-clip-padding backdrop-filter backdrop-blur-3xl  bg-opacity-10 border border-gray-100 fixed left-36 z-10 top-1/2 -translate-y-1/2",
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
