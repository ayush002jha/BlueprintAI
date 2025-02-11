"use client";

import { ArrowUpRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const products = [
  {
    title: "Starter Stack",
    description:
      "Start with our best-selling protocols, EVOO, Longevity Mix and Cocoa.",
    price: "$125.00",
    product_link: "https://blueprint.bryanjohnson.com/products/starter-stack",
    image_link:
      "https://blueprint.bryanjohnson.com/cdn/shop/files/StarterStack.png?v=1731720980&width=1296",
  },
  {
    title: "Supplement Stack",
    description:
      "7 daily pills and a longevity drink to cover your essential nutrients.",
    price: "$185.00",
    product_link:
      "https://blueprint.bryanjohnson.com/products/supplement-stack",
    image_link:
      "https://blueprint.bryanjohnson.com/cdn/shop/files/SupplementStack.png?v=1731721013&width=1296",
  },
  {
    title: "Blueprint Stack",
    description:
      "Best-selling longevity kit used by Bryan Johnson, 70+ health actives.",
    price: "$343.00",
    product_link:
      "https://blueprint.bryanjohnson.com/products/the-blueprint-stack",
    image_link:
      "https://blueprint.bryanjohnson.com/cdn/shop/files/PDPBlueprintStackandLongevityProtein_2.png?v=1733163799&width=1296",
  },
  {
    title: "Speed of Aging",
    description:
      "Learn the biological age & health of 11 organ systems plus your speed of aging.",
    price: "$325.00",
    product_link: "https://blueprint.bryanjohnson.com/products/speed-of-aging",
    image_link:
      "https://blueprint.bryanjohnson.com/cdn/shop/files/TruDcopy.png?v=1731720956&width=1296",
  },
];

function getRandomProducts(count: number) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function Products() {
  const randomProducts = getRandomProducts(3);
  return (
    <div className=" bg-gray-200 m-4 p-4 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-100">
      <div className="flex items-center justify-between gap-2">
        <ShoppingCart size={40} className="bg-gray-50 w-12 p-2 rounded-lg" />
        <h2 className="w-full">
          <p className="text-lg font-semibold">Products</p>
          <p className="text-sm font-light">Recommended For You</p>
        </h2>
        <ArrowUpRight size={40} className="bg-gray-50 w-12 p-2 rounded-lg" />
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {randomProducts.map((product) => (
          <Link key={product.title} href={product.product_link}>
            <div className=" p-4 rounded-lg shadow-md flex gap-2 items-center justify-between bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-100">
              <Image
                src={product.image_link}
                alt={product.title}
                width={600}
                height={600}
                className="w-40 h-12 object-cover  rounded-md"
              />
              <div className="flex-col">
                <div className="text-md font-semibold mt-2">{product.title}</div>
                <div className="text-sm text-gray-600">{product.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;
