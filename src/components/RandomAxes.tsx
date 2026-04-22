"use client";

import { useState } from "react";

interface AxeRow {
  id: number;
  slug: string;
  created_at: string;
  bullets: string[];
  links: { url: string; label: string }[];
}

export default function RandomAxes() {
  const [count, setCount] = useState(3);
  const [axes, setAxes] = useState<AxeRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function draw() {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`/api/axes/random?count=${count}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to draw axes");
      }
      const data = await res.json();
      setAxes(data.axes);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Random Draw</h2>
        <p className="text-white/50 text-sm">
          Pull a random selection of axes from your collection.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5">
          <label className="text-sm text-white/60 whitespace-nowrap">
            Number of axes
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))
            }
            className="w-16 bg-transparent text-white text-center text-sm font-semibold focus:outline-none"
          />
        </div>

        <button
          onClick={draw}
          disabled={status === "loading"}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition flex items-center gap-2"
        >
          {status === "loading" ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Drawing…
            </>
          ) : (
            <>
              <span>🎲</span> Draw Axes
            </>
          )}
        </button>

        {axes.length > 0 && (
          <span className="text-white/40 text-sm">
            {axes.length} axe{axes.length !== 1 ? "s" : ""} drawn
          </span>
        )}
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Empty state */}
      {status === "idle" && axes.length === 0 && (
        <div className="text-center py-20 text-white/25">
          <div className="text-5xl mb-4">🪓</div>
          <p className="text-sm">Hit &quot;Draw Axes&quot; to get started.</p>
        </div>
      )}

      {/* Results */}
      {axes.length > 0 && (
        <div className="space-y-4">
          {axes.map((axe, idx) => (
            <AxeCard key={axe.id} axe={axe} index={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function AxeCard({ axe, index }: { axe: AxeRow; index: number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-violet-500/30 transition group">
      <div className="flex items-start gap-4">
        <span className="text-violet-500/60 font-mono text-sm mt-0.5 shrink-0 w-6 text-right">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          {/* Slug */}
          <h3 className="text-white font-semibold text-base leading-snug mb-3">
            {axe.slug}
          </h3>

          {/* Bullets */}
          {axe.bullets.length > 0 && (
            <ul className="space-y-1.5 mb-4">
              {axe.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/65">
                  <span className="text-violet-400 mt-0.5 shrink-0">▸</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Links */}
          {axe.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {axe.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white/8 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 rounded-full px-3 py-1 text-xs text-white/60 hover:text-violet-300 transition"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  {link.label || link.url}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
