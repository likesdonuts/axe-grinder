"use client";

import { useState } from "react";

interface LinkEntry {
  label: string;
  url: string;
}

export default function UploadAxe() {
  const [slug, setSlug] = useState("");
  const [bullets, setBullets] = useState<string[]>([""]);
  const [links, setLinks] = useState<LinkEntry[]>([{ label: "", url: "" }]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateBullet(index: number, value: string) {
    setBullets((prev) => prev.map((b, i) => (i === index ? value : b)));
  }

  function addBullet() {
    setBullets((prev) => [...prev, ""]);
  }

  function removeBullet(index: number) {
    setBullets((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLink(index: number, field: keyof LinkEntry, value: string) {
    setLinks((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  }

  function addLink() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug.trim()) {
      setStatus("error");
      setMessage("Slug (headline) is required.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/axes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim(),
          bullets: bullets.filter((b) => b.trim() !== ""),
          links: links.filter((l) => l.url.trim() !== ""),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save axe");
      }

      setStatus("success");
      setMessage("Axe saved!");
      setSlug("");
      setBullets([""]);
      setLinks([{ label: "", url: "" }]);

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Upload an Axe</h2>
        <p className="text-white/50 text-sm">
          Add a headline, supporting bullets, and backup links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            Slug <span className="text-violet-400">*</span>
          </label>
          <p className="text-xs text-white/40 mb-2">The core headline or talking point.</p>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. Our product ships 3x faster than competitors"
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
          />
        </div>

        {/* Bullets */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            Supporting Bullets
          </label>
          <p className="text-xs text-white/40 mb-3">Key points that back up the slug.</p>
          <div className="space-y-2">
            {bullets.map((bullet, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-white/20 text-xs w-5 text-right shrink-0">{i + 1}</span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBullet(i, e.target.value)}
                  placeholder={`Bullet ${i + 1}`}
                  className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                />
                {bullets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBullet(i)}
                    className="text-white/30 hover:text-red-400 transition text-lg leading-none px-1"
                    aria-label="Remove bullet"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addBullet}
            className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition flex items-center gap-1"
          >
            <span className="text-lg leading-none">+</span> Add bullet
          </button>
        </div>

        {/* Links */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            Backup Links
          </label>
          <p className="text-xs text-white/40 mb-3">Links to data, articles, or evidence.</p>
          <div className="space-y-3">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-white/20 text-xs w-5 text-right mt-2.5 shrink-0">{i + 1}</span>
                <div className="flex-1 grid grid-cols-5 gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(i, "label", e.target.value)}
                    placeholder="Label"
                    className="col-span-2 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(i, "url", e.target.value)}
                    placeholder="https://..."
                    className="col-span-3 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                  />
                </div>
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="text-white/30 hover:text-red-400 transition text-lg leading-none px-1 mt-2"
                    aria-label="Remove link"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLink}
            className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition flex items-center gap-1"
          >
            <span className="text-lg leading-none">+</span> Add link
          </button>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition"
          >
            {status === "loading" ? "Saving…" : "Save Axe"}
          </button>

          {message && (
            <span
              className={`text-sm font-medium ${
                status === "success" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
