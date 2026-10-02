import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, X, ChevronLeft, ChevronRight, Loader2, BookOpen } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PAGE_SIZE = { ashtottara: 108, sahasranama: 84 };

/**
 * NamesModal — a searchable, paginated viewer for a deity's Ashtottara (108) or Sahasranama (1008).
 * Fetches from /api/deities/{id}/names?kind=ashtottara|sahasranama&q=&page=&page_size=
 *
 * Props:
 *   deityId, deityName, isOpen, onClose
 */
export default function NamesModal({ deityId, deityName, isOpen, onClose }) {
  const [kind, setKind] = useState("ashtottara");
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    axios.get(`${API}/deities/${deityId}/names`, {
      params: { kind, q, page, page_size: PAGE_SIZE[kind] },
    }).then((r) => setData(r.data)).catch((e) => setData({ names: [], total: 0, error: e.message }))
      .finally(() => setLoading(false));
  }, [deityId, kind, page, q, isOpen]);

  useEffect(() => { setPage(1); }, [kind, q]);

  if (!isOpen) return null;

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE[kind])) : 1;
  const availableS = data?.available?.sahasranama || 0;

  return (
    <div
      data-testid="names-modal"
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl bg-background gold-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-[hsl(var(--gold)/0.3)] shrink-0">
          <BookOpen className="w-5 h-5 text-saffron" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))] truncate">{deityName} — Divine Names</h3>
            <div className="text-[10px] text-muted-foreground">
              Ashtottara ({data?.available?.ashtottara || 0}) • Sahasranama ({availableS})
            </div>
          </div>
          <button onClick={onClose} data-testid="names-modal-close" className="p-1.5 rounded-full hover:bg-[hsl(var(--gold)/0.15)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs + search */}
        <div className="px-4 sm:px-6 py-3 flex flex-wrap gap-2 items-center border-b border-[hsl(var(--gold)/0.15)]">
          <div className="inline-flex rounded-full gold-border p-0.5">
            <button
              onClick={() => setKind("ashtottara")}
              data-testid="names-tab-ashtottara"
              className={`px-3 py-1 text-xs rounded-full transition ${kind === "ashtottara" ? "bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white" : "text-foreground/70 hover:text-foreground"}`}
            >
              108 Ashtottara
            </button>
            <button
              onClick={() => setKind("sahasranama")}
              disabled={availableS === 0}
              data-testid="names-tab-sahasranama"
              className={`px-3 py-1 text-xs rounded-full transition ${kind === "sahasranama" ? "bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white" : "text-foreground/70 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"}`}
              title={availableS === 0 ? "Sahasranama for this deity is being prepared" : "1008 names"}
            >
              1008 Sahasranama {availableS === 0 ? "(coming soon)" : ""}
            </button>
          </div>
          <div className="relative flex-1 min-w-[180px] max-w-sm ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              data-testid="names-search"
              placeholder="Search meaning, IAST, Sanskrit…"
              className="w-full rounded-full pl-8 pr-3 py-1.5 text-xs gold-border bg-card focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
            />
          </div>
        </div>

        {/* Names list */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {loading ? (
            <div className="text-center py-10"><Loader2 className="inline w-5 h-5 animate-spin text-saffron" /></div>
          ) : data?.names?.length ? (
            <div className="space-y-2">
              {data.names.map((n) => (
                <div
                  key={n.n}
                  data-testid={`name-item-${n.n}`}
                  className="grid grid-cols-[3rem_1fr] sm:grid-cols-[3rem_1fr_1fr] gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-[hsl(var(--gold)/0.05)] transition"
                >
                  <div className="text-xs text-muted-foreground tabular-nums font-medium">॥ {n.n} ॥</div>
                  <div>
                    <div className="font-devanagari text-lg leading-tight text-kumkum dark:text-[hsl(var(--gold))]">{n.sa}</div>
                    <div className="text-[11px] italic text-foreground/70 mt-0.5">{n.iast}</div>
                    <div className="font-telugu text-sm text-foreground/80 mt-0.5">{n.te}</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 text-xs text-foreground/75 leading-relaxed sm:pl-2 sm:border-l sm:border-[hsl(var(--gold)/0.2)]">
                    {n.meaning}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-sm text-muted-foreground">
              {data?.available?.[kind] === 0 ? (
                <>The {kind} for this deity is being prepared. Please check back soon 🙏</>
              ) : (
                <>No names match your search.</>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.names?.length > 0 && (
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 border-t border-[hsl(var(--gold)/0.15)] shrink-0 text-xs">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              data-testid="names-page-prev"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 gold-border hover:bg-[hsl(var(--gold)/0.1)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <div className="text-muted-foreground">
              Page <b>{page}</b> of <b>{totalPages}</b> • Showing {data.names.length} of {data.total}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              data-testid="names-page-next"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 gold-border hover:bg-[hsl(var(--gold)/0.1)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
