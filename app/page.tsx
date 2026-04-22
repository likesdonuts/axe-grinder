"use client";

import { useState } from "react";
import UploadAxe from "../components/UploadAxe";
import RandomAxes from "../components/RandomAxes";
import ManageAxes from "../components/ManageAxes";

type Tab = "upload" | "random" | "manage";

export default function Home() {
  const [tab, setTab] = useState<Tab>("upload");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪓</span>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Axe Grinder
            </h1>
          </div>
          <p className="text-sm text-white/40 hidden sm:block">
            Build, store, and randomly retrieve your axes
          </p>
        </div>
      </header>

      <nav className="border-b border-white/10 bg-white/3">
        <div className="max-w-4xl mx-auto px-6 flex gap-1">
          {(
            [
              { id: "upload", label: "Upload Axe" },
              { id: "random", label: "Random Draw" },
              { id: "manage", label: "All Axes" },
            ] as { id: Tab; label: string }[]
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === id
                  ? "border-violet-400 text-violet-300"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        {tab === "upload" && <UploadAxe />}
        {tab === "random" && <RandomAxes />}
        {tab === "manage" && <ManageAxes />}
      </main>
    </div>
  );
}
