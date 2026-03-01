"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";

export function ImageTabs() {
  const [activeTab, setActiveTab] = useState<"organize" | "hired" | "boards">(
    "organize",
  );

  return (
    <section className="border-t bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div
            role="tablist"
            aria-label="Feature previews"
            className="flex gap-2 justify-center mb-8"
          >
            <Button
              role="tab"
              id="tab-organize"
              aria-selected={activeTab === "organize"}
              onClick={() => setActiveTab("organize")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "organize"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Organize Applications
            </Button>
            <Button
              role="tab"
              id="tab-hired"
              aria-selected={activeTab === "hired"}
              onClick={() => setActiveTab("hired")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "hired"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Get Hired
            </Button>
            <Button
              role="tab"
              id="tab-boards"
              aria-selected={activeTab === "boards"}
              onClick={() => setActiveTab("boards")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "boards"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Manage Boards
            </Button>
          </div>
          <div
            id="hero-tabpanel"
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl"
          >
            {activeTab === "organize" && (
              <Image
                src="/hero-images/hero1.png"
                alt="Organize Applications"
                width={1200}
                height={800}
              />
            )}
            {activeTab === "hired" && (
              <Image
                src="/hero-images/hero2.png"
                alt="Get Hired"
                width={1200}
                height={800}
              />
            )}
            {activeTab === "boards" && (
              <Image
                src="/hero-images/hero3.png"
                alt="Manage Boards"
                width={1200}
                height={800}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
