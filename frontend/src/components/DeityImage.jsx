import React, { useState } from "react";
import DeityIcon from "@/components/DeityIcon";

/**
 * Shows the deity image with a dim overlay for text legibility.
 * Falls back to DeityIcon (temple niche with Om + name) if image fails.
 */
export default function DeityImage({ deity, lang, className = "", position = "center top" }) {
  const [failed, setFailed] = useState(false);

  if (failed || !deity.image) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <DeityIcon deity={deity} lang={lang} />
      </div>
    );
  }
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ backgroundColor: `${deity.color}22` }}>
      <img
        src={deity.image}
        alt={deity.name?.en || deity.id}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: position }}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 55%, ${deity.color}22 75%, rgba(0,0,0,0.8) 100%)`,
        }}
      />
    </div>
  );
}
