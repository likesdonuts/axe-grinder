"use client";

import { useEffect, useState, useCallback } from "react";

interface AxeRow {
  id: number;
  slug: string;
  created_at: string;
  bullets: string[];
  links: { url: string; label: string }[];
}

export default function ManageAxes() {
  const [axes, setAxes] = useState<AxeRow[]>([]);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  // Setting loading state happens outside the effect (from event handlers or initial useState),
  // so we satisfy the react-hooks/set-state-in-effect rule.
  const fetchAxes = useCallback(() => {
    setStatus("loading");
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/axes")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load axes");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setAxes(data.axes);
          setStatus("idle");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/axes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setAxes((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // silently ignore — could surface a toast in a fuller implementation
    } finally {
      setDeleting(null);
    }
  }

  function toggleExpand(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20 text-white/30">
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (axes.length === 0) {
    return (
      <div className="text-center py-20 text-white/25">
        <div className="text-5xl mb-4">🗂️</div>
        <p className="text-sm">No axes yet. Upload your first one!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">All Axes</h2>
          <p className="text-white/50 text-sm">
            {axes.length} axe{axes.length !== 1 ? "s" : ""} in your collection
          </p>
        </div>
        <button
          onClick={fetchAxes}
          className="text-white/40 hover:text-white transition text-sm flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {axes.map((axe) => {
          const isOpen = expanded.has(axe.id);
          const hasDetails = axe.bullets.length > 0 || axe.links.length > 0;

          return (
            <div
              key={axe.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              {/* Row header */}
              <div className="flex items-center gap-3 px-5 py-4">
                <button
                  onClick={() => hasDetails && toggleExpand(axe.id)}
                  className={`flex-1 text-left flex items-center gap-3 min-w-0 ${hasDetails ? "cursor-pointer" : ""}`}
                >
                  {hasDetails && (
                    <svg
                      className={`w-4 h-4 text-white/30 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  {!hasDetails && <span className="w-4 shrink-0" />}
                  <span className="text-white font-medium text-sm truncate">{axe.slug}</span>
                </button>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-white/25 text-xs hidden sm:block">
                    {new Date(axe.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(axe.id)}
                    disabled={deleting === axe.id}
                    className="text-white/20 hover:text-red-400 transition text-sm disabled:opacity-50"
                    aria-label="Delete axe"
                  >
                    {deleting === axe.id ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && hasDetails && (
                <div className="border-t border-white/10 px-5 py-4 bg-white/3">
                  {axe.bullets.length > 0 && (
                    <ul className="space-y-1.5 mb-4">
                      {axe.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2 text-sm text-white/60">
                          <span className="text-violet-400 mt-0.5 shrink-0">▸</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {axe.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {axe.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-white/8 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 rounded-full px-3 py-1 text-xs text-white/50 hover:text-violet-300 transition"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {link.label || link.url}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
