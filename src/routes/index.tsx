import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Bell, BookOpen, NotebookPen, ArrowRight } from "lucide-react";
import { IconTile } from "@/components/AppShell";
import { subjects, subjectNotes, subjectAulas, tones, notes, plural } from "@/lib/study-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — StudyFlow" },
      { name: "description", content: "Seu progresso geral, suas matérias e anotações em um só lugar." },
      { property: "og:title", content: "Início — StudyFlow" },
      { property: "og:description", content: "Seu conhecimento acadêmico em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const progress = 67;
  const r = 30;
  const c = 2 * Math.PI * r;

  return (
    <>
      <header className="mb-7">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-elevated text-sm font-semibold text-violet ring-1 ring-border">MC</span>
          <div className="flex gap-1">
            <Link to="/anotacoes" aria-label="Buscar" className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-elevated"><Search className="h-5 w-5" /></Link>
            <Link to="/notificacoes" aria-label="Notificações" className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-elevated">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Link>
          </div>
        </div>
        <h1 className="title-page">Olá, Marina.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Seu conhecimento, em um só lugar.</p>
      </header>

      <section className="card mb-8 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="title-section">Seu progresso geral</p>
            <p className="text-meta mt-1">Continue firme! Você está indo bem.</p>
          </div>
          <div className="relative h-[72px] w-[72px] shrink-0">
            <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
              <circle cx="36" cy="36" r={r} fill="none" strokeWidth="6" className="stroke-elevated" />
              <circle cx="36" cy="36" r={r} fill="none" strokeWidth="6" strokeLinecap="round" className="stroke-primary" strokeDasharray={c} strokeDashoffset={c * (1 - progress / 100)} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-base font-bold tabular-nums">{progress}%</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat icon={BookOpen} value={subjects.length} label="matérias" />
          <Stat icon={NotebookPen} value={notes.length} label="anotações" />
        </div>
      </section>

      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="title-section">Minhas matérias</h2>
        <Link to="/anotacoes" className="flex items-center gap-1 text-xs font-medium text-violet">Ver todas <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
      <section className="space-y-2.5">
        {subjects.slice(0, 4).map((s) => (
          <Link key={s.slug} to="/anotacoes/$materia" params={{ materia: s.slug }} className="card flex items-center gap-3.5 p-3.5 transition hover:border-primary/40">
            <IconTile icon={s.icon} className={tones[s.tone].tile} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="title-item truncate">{s.name}</p>
                <span className="text-meta tabular-nums">{s.progress}%</span>
              </div>
              <p className="text-meta mt-0.5">{plural(subjectNotes(s.slug).length, "anotação", "anotações")} · {plural(subjectAulas(s.slug).length, "aula", "aulas")}</p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-elevated">
                <div className={cn("h-full rounded-full", tones[s.tone].bar)} style={{ width: `${s.progress}%` }} />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof Bell; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-elevated px-3.5 py-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-lg font-bold leading-none tabular-nums">{value}</p>
        <p className="text-meta mt-1">{label}</p>
      </div>
    </div>
  );
}
