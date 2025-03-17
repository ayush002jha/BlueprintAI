// src/components/ui/floating-dock.tsx
import { cn } from "@/lib/utils";
import React from "react";
import { HomeIcon, BookText, CookingPot, Menu, X } from "lucide-react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
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
    icon: <BookText />,
  },
  {
    title: "Recipie Genie",
    href: "/recipie",
    icon: <CookingPot />,
  },
  {
    title: "Weekly Meal Plan",
    href: "/weekly",
    icon: (
      <Image
        src={"/zoho.png"}
        alt={"Zo-logo"}
        width={500}
        height={500}
        className=""
        priority
      />
    ),
  },
];

const renderIcon = (selected: string, title: string, icon: React.ReactNode) => (
  <div className={`${selected === title ? "text-white" : "text-gray-500"}`}>
    {icon}
  </div>
);

export const FloatingDock = ({
  desktopClassName,
}: {
  desktopClassName?: string;
}) => {
  const { selectedTab, updateSelectedTab } = useTab();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };

    // Check initially
    checkIfMobile();

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <>
      {/* Desktop version - visible on md screens and above */}
      <div className="hidden md:block">
        <FloatingDockDesktop
          items={links.map((link) => ({
            ...link,
            icon: renderIcon(selectedTab, link.title, link.icon),
          }))}
          className={desktopClassName}
        />
      </div>

      {/* Mobile version - visible only on small screens */}
      <div className="block md:hidden">
        <FloatingDockMobile
          items={links.map((link) => ({
            ...link,
            icon: renderIcon(selectedTab, link.title, link.icon),
          }))}
        />
      </div>
    </>
  );
};

const FloatingDockMobile = ({
  items,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedTab, updateSelectedTab } = useTab();

  const handleItemClick = (title: string) => {
    updateSelectedTab(title);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-2 z-50">
      {/* Toggle button */}
      <motion.button
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
          isOpen ? "bg-red-500" : "bg-blue-600"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="text-white w-6 h-6" />
        ) : (
          <Menu className="text-white w-6 h-6" />
        )}
      </motion.button>

      {/* Menu items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-16 right-0 flex flex-col gap-3 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-md ${
                  selectedTab === item.title
                    ? "bg-blue-600"
                    : "bg-gray-100 bg-opacity-90 backdrop-filter backdrop-blur-sm border border-gray-100"
                }`}
                onClick={() => handleItemClick(item.title)}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.05 * (items.length - index) },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-6">{item.icon}</div>

                {/* Tooltip */}
                <div className="absolute right-14 bg-neutral-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                  {item.title}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
        "mx-auto flex flex-col w-20 py-6 gap-8 items-center justify-center rounded-2xl bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-10 border border-gray-100 relative z-10 top-1/2 -translate-y-1/2",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseY={mouseY} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

const IconContainer = React.memo(
  ({
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
    let widthTransformIcon = useTransform(
      distance,
      [-150, 0, 150],
      [20, 40, 20]
    );
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
        className={`aspect-square rounded-full flex items-center justify-center relative cursor-pointer ${
          selectedTab === title
            ? "bg-blue-600"
            : "h-full w-full bg-gray-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-100"
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
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    );
  }
);
IconContainer.displayName = "IconContainer";
