import Link from "next/link";
import { cn } from "@/lib/cn";
import { Github, BookOpen, Layers, Gauge, FileText, Sparkles, Database, Users, Star } from "lucide-react";

function GlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#050814]" />

      <div className="absolute -top-40 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22),rgba(99,102,241,0)_60%)] blur-2xl" />
      <div className="absolute top-[18%] left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.14),rgba(168,85,247,0)_62%)] blur-2xl" />
      <div className="absolute bottom-[-220px] left-1/2 h-[640px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.10),rgba(56,189,248,0)_65%)] blur-3xl" />

      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.72)_72%)]" />
    </div>
  );
}

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6", className)}>
      {children}
    </div>
  );
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen text-white">
      <GlowBackground />

      <header className="relative z-10 pt-6">
        <Shell>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/20">
                <FileText className="h-5 w-5 text-indigo-200" />
              </div>
              <span className="text-sm font-semibold tracking-wide">DocuMindAIApp</span>
            </div>

            <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
              <Link className="hover:text-white" href="https://github.com/yldrmetless/DocuMindAIApp"
              >GitHub</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                href="https://github.com/yldrmetless/DocuMindAIApp"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/90 shadow-sm hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              >
                <Star className="h-4 w-4" />
                <span>Star on GitHub</span>
              </Link>
            </div>
          </div>
        </Shell>
      </header>

      <section className="relative z-10 pt-16">
        <Shell>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>DEV EDITION: OPEN SOURCE RAG ENGINE</span>
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Talk to Your{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-indigo-400 to-sky-300 bg-clip-text text-transparent">
                Documents
              </span>
              <br />
              Instantly.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
              A developer-first document analysis tool using Django, Next.js, and pgvector. High-performance RAG
              implementation for your complex PDF datasets.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="https://github.com/yldrmetless/DocuMindAIApp"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-500 px-6 text-sm font-medium text-white shadow-[0_12px_30px_-12px_rgba(99,102,241,0.65)] hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/50"
              >
                View Source Code <span className="ml-2">&lt;&gt;</span>
              </Link>
            </div>
          </div>
        </Shell>
      </section>

      <section className="relative z-10 mt-14">
        <Shell>
          <GlassCard className="p-5 md:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-1 text-xs text-white/70">
                      <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-200">PDF</span>
                      <span>Architecture_Spec_v2.pdf</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <Gauge className="h-4 w-4" />
                    <BookOpen className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="h-3 w-[82%] rounded bg-white/5" />
                  <div className="h-3 w-[74%] rounded bg-white/5" />
                  <div className="h-3 w-[66%] rounded bg-white/5" />
                  <div className="h-3 w-[78%] rounded bg-white/5" />
                  <div className="h-3 w-[60%] rounded bg-white/5" />
                  <div className="mt-7 h-32 rounded-xl border border-white/10 bg-white/[0.02]" />
                </div>

                <div className="mt-4 text-[10px] tracking-widest text-white/35">
                  DATA EXTRACTION PIPELINE: PDF → TEXT → CHUNKS → EMBEDDINGS → PGVECTOR
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/20">
                    <Layers className="h-5 w-5 text-indigo-200" />
                  </div>
                  <div className="flex-1">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80">
                      Explain the database schema for the vector storage.
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-indigo-500/10 p-4 text-sm leading-relaxed text-white/75">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/30 ring-1 ring-indigo-300/30">
                    <Sparkles className="h-4 w-4 text-indigo-100" />
                  </div>
                  <p className="mt-3">
                    The project uses pgvector with a custom Django model. Chunks are stored with an embedding column
                    indexed using HNSW for sub-10ms retrieval.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-white/45">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> STATUS: READY
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
                    CHUNKS: 1,248
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
                    INDEXED LATENCY: 24ms
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
                    MODEL: GPT-4
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
                    DB: PGVECTOR
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </Shell>
      </section>

      <section className="relative z-10 mt-14 pb-24">
        <Shell>
          <div className="grid gap-5 md:grid-cols-3">
            <GlassCard className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/20">
                <Users className="h-5 w-5 text-indigo-200" />
              </div>
              <h3 className="mt-5 text-base font-semibold">Built for Developers</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Extensible Python-based backend with a type-safe Next.js frontend. Fully containerized for rapid
                deployment and local testing.
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/20">
                <Database className="h-5 w-5 text-indigo-200" />
              </div>
              <h3 className="mt-5 text-base font-semibold">Vector Search</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Native PostgreSQL integration via pgvector. No proprietary vector databases required—keep your stack
                simple and reliable.
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/20">
                <Github className="h-5 w-5 text-indigo-200" />
              </div>
              <h3 className="mt-5 text-base font-semibold">Open Source</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Released under MIT License. Contribute to the core engine or fork it to build your own custom document
                intelligence platform.
              </p>
            </GlassCard>
          </div>

          <div className="mt-16 border-t border-white/10 pt-10">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/20">
                    <FileText className="h-5 w-5 text-indigo-200" />
                  </div>
                  <span className="text-sm font-semibold tracking-wide">DocuMindAIApp</span>
                </div>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
                  Exploring the intersection of Django, Next.js, and Vector Databases. Open-source RAG engine built for
                  high-performance retrieval.
                </p>
                <div className="mt-6 flex items-center gap-3 text-white/45">
                  <Link className="rounded-lg border border-white/10 bg-white/[0.03] p-2 hover:bg-white/[0.06]" href="https://github.com/yldrmetless/DocuMindAIApp">
                    <Github className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-7">
                <div className="grid gap-8 sm:grid-cols-3">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-white/50">PROJECT</div>
                    <ul className="mt-4 space-y-2 text-sm text-white/60">
                      <li><Link className="hover:text-white" href="https://github.com/yldrmetless/DocuMindAIApp"
                      >Source Code</Link></li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-white/50">TECH STACK</div>
                    <ul className="mt-4 space-y-2 text-sm text-white/60">
                      <li>Django / Python</li>
                      <li>Next.js / TypeScript</li>
                      <li>pgvector</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-white/50">DEVELOPER</div>
                    <ul className="mt-4 space-y-2 text-sm text-white/60">
                      <li><Link className="hover:text-white" href="#">Personal Portfolio</Link></li>
                      <li><Link className="hover:text-white" href="#">Tech Blog</Link></li>
                      <li><Link className="hover:text-white" href="#">MIT License</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-white/45">
                Build with precision © {new Date().getFullYear()}
              </div>              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> LIVE DEMO STATUS: OPERATIONAL
                </span>
                <Link
                  href="https://github.com/yldrmetless/DocuMindAIApp"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/80 hover:bg-white/[0.06]"
                >
                  <Star className="h-4 w-4" /> Star on GitHub
                </Link>
              </div>
            </div>
          </div>
        </Shell>
      </section>
    </main>
  );
}
