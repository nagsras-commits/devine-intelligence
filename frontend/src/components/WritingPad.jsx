import React, { useEffect, useRef, useState } from "react";
import { Eraser, Check, Undo2, Palette } from "lucide-react";

/**
 * WritingPad — a canvas the user writes on with finger / stylus / mouse.
 * When the user submits a drawing that has enough ink coverage, onSubmit() fires (count +1)
 * and the canvas auto-clears for the next name.
 *
 * Props:
 *   onSubmit(): called when a valid drawing is submitted
 *   accent: color for stroke (matches deity/name accent)
 *   displayHint: the sacred name to display faintly as a guide (e.g. "राम")
 *   minInkPct: minimum fraction of canvas pixels that must be inked (default 0.006)
 */
export default function WritingPad({ onSubmit, accent = "#7F1D1D", displayHint = "राम", minInkPct = 0.006 }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const strokesRef = useRef([]); // stack of ImageData for undo
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [strokeColor, setStrokeColor] = useState(accent);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);

  useEffect(() => setStrokeColor(accent), [accent]);

  // Setup canvas — resize to parent, keep hi-DPI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setSize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const cssW = rect.width;
      const cssH = 220;
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      strokesRef.current = [];
    };
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = e.touches?.[0] || e.changedTouches?.[0] || e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    lastRef.current = getPos(e);
    // Save state for undo before starting the stroke
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      strokesRef.current.push(snap);
      if (strokesRef.current.length > 50) strokesRef.current.shift();
    } catch { /* ignore */ }
    if (error) setError("");
  };

  const draw = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastRef.current = pos;
  };

  const endDraw = () => { drawingRef.current = false; };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokesRef.current = [];
    setError("");
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prev = strokesRef.current.pop();
    if (prev) ctx.putImageData(prev, 0, 0);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Compute how much of the canvas has ink
  const inkFraction = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    let inked = 0;
    try {
      const data = ctx.getImageData(0, 0, width, height).data;
      // Sample every 8th pixel for speed
      for (let i = 3; i < data.length; i += 32) {
        if (data[i] > 20) inked++;
      }
      return inked / (width * height / 8);
    } catch {
      return 1; // if cross-origin issue, allow
    }
  };

  const submit = () => {
    const pct = inkFraction();
    if (pct < minInkPct) {
      setError(`Please write the name — canvas seems too empty.`);
      return;
    }
    setFlash(true);
    setTimeout(() => setFlash(false), 220);
    onSubmit?.();
    // auto-clear for next name
    setTimeout(clear, 180);
  };

  const COLORS = [accent, "#0B1021", "#7F1D1D", "#1E3A8A", "#065F46", "#B45309"];

  return (
    <div className="sacred-card grain" data-testid="writing-pad">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Write with finger / stylus</div>
        <div className="text-[10px] text-muted-foreground">Any writing you do with bhāvanā counts.</div>
      </div>

      <div className={`relative rounded-xl overflow-hidden gold-border transition-transform ${flash ? "scale-[0.99]" : ""}`}
           style={{ background: "linear-gradient(to bottom, hsl(43 74% 96%), hsl(40 55% 92%))" }}>
        {/* Guide overlay — faint sacred name */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-devanagari select-none"
          style={{ color: `${accent}22`, fontSize: "8rem", lineHeight: 1, letterSpacing: "0.15em" }}
        >
          {displayHint}
        </div>
        {/* Ruled lines for tracing */}
        <svg className="pointer-events-none absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="20" x2="100" y2="20" stroke={`${accent}22`} strokeDasharray="0.6 0.6" strokeWidth="0.15" />
          <line x1="0" y1="50" x2="100" y2="50" stroke={`${accent}44`} strokeDasharray="0.6 0.6" strokeWidth="0.15" />
          <line x1="0" y1="80" x2="100" y2="80" stroke={`${accent}22`} strokeDasharray="0.6 0.6" strokeWidth="0.15" />
        </svg>
        <canvas
          ref={canvasRef}
          data-testid="writing-pad-canvas"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          className="block w-full touch-none relative"
          style={{ cursor: "crosshair" }}
        />
      </div>

      {error && <div data-testid="writing-pad-error" className="mt-2 text-xs text-red-600">{error}</div>}

      {/* Toolbar */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-muted-foreground" />
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setStrokeColor(c)}
              data-testid={`pad-color-${c}`}
              aria-label={`Pen color ${c}`}
              className={`w-6 h-6 rounded-full border-2 transition ${strokeColor === c ? "border-white ring-2 ring-[hsl(var(--gold))] scale-110" : "border-white/60 hover:scale-105"}`}
              style={{ background: c }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Stroke</span>
          <input
            type="range"
            min="1"
            max="14"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
            data-testid="pad-stroke-width"
            className="w-24 accent-[hsl(var(--gold))]"
          />
          <span className="text-[10px] text-muted-foreground w-5">{strokeWidth}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={undo} data-testid="pad-undo" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)]">
            <Undo2 className="w-3.5 h-3.5" /> Undo
          </button>
          <button onClick={clear} data-testid="pad-clear" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)]">
            <Eraser className="w-3.5 h-3.5" /> Clear
          </button>
          <button
            onClick={submit}
            data-testid="pad-submit"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow"
          >
            <Check className="w-3.5 h-3.5" /> Count +1
          </button>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-muted-foreground text-center italic">
        Draw the name over the faint guide. Tap <b>Count +1</b> to add to your total, then continue.
      </div>
    </div>
  );
}
