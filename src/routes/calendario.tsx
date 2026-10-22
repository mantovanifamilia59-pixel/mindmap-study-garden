import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário — StudyFlow" },
      { name: "description", content: "Aulas, provas, trabalhos e compromissos no seu calendário acadêmico." },
      { property: "og:title", content: "Calendário — StudyFlow" },
      { property: "og:description", content: "Seu calendário acadêmico interativo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Calendar,
});

type Kind = "Aula" | "Prova" | "Trabalho" | "Pessoal";
const dot: Record<Kind, string> = { Aula: "bg-electric", Prova: "bg-amber", Trabalho: "bg-violet", Pessoal: "bg-lime" };
const events: { day: number; kind: Kind; title: string; time: string; subject: string }[] = [
  { day: 20, kind: "Pessoal", title: "Grupo de estudos", time: "17:30", subject: "Revisão de SQL" },
  { day: 20, kind: "Aula", title: "Estrutura de dados", time: "19:10", subject: "Aula 03/24 · sala C105" },
  { day: 20, kind: "Aula", title: "Banco de dados", time: "21:00", subject: "Aula 04 · laboratório C12" },
  { day: 23, kind: "Prova", title: "Prova de banco de dados", time: "19:10", subject: "SQL e modelagem" },
  { day: 27, kind: "Trabalho", title: "Entrega de projeto", time: "23:59", subject: "Engenharia de software" },
  { day: 28, kind: "Prova", title: "Prova de Cálculo", time: "09:00", subject: "Matemática" },
];

const weekday = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function Calendar() {
  const [sel, setSel] = useState(20);
  const offset = 4; // Out/2026 começa na quinta
  const dayEvents = events.filter((e) => e.day === sel);
  const wd = weekday[(offset + sel - 1) % 7] ?? "";
  const label = sel === 20 ? "Hoje, 20 de outubro" : `${wd.charAt(0).toUpperCase()}${wd.slice(1)}, ${sel} de outubro`;

  return (
    <>
      <PageHeader title="Calendário" eyebrow="Acompanhe suas aulas e prazos." />

      <section className="card mb-7 p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="title-section">Outubro 2026</p>
          <div className="flex gap-1 text-muted-foreground">
            <button aria-label="Mês anterior" className="rounded-full p-1.5 transition hover:bg-elevated hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <button aria-label="Próximo mês" className="rounded-full p-1.5 transition hover:bg-elevated hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i} className="text-label py-1.5">{d}</span>)}
          {Array.from({ length: offset }).map((_, i) => <span key={"e" + i} />)}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
            const evs = events.filter((e) => e.day === d);
            return (
              <button key={d} onClick={() => setSel(d)} className={cn("flex aspect-square flex-col items-center justify-center rounded-full text-[13px] tabular-nums transition", sel === d ? "bg-primary font-semibold text-primary-foreground" : "hover:bg-elevated", d === 20 && sel !== d && "text-violet font-semibold")}>
                {d}
                <span className="mt-0.5 flex h-1 gap-0.5">{evs.slice(0, 3).map((e, i) => <span key={i} className={cn("h-1 w-1 rounded-full", sel === d ? "bg-primary-foreground" : dot[e.kind])} />)}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-border px-1 pt-3">
          {(Object.keys(dot) as Kind[]).map((k) => (
            <span key={k} className="text-meta flex items-center gap-1.5"><span className={cn("h-1.5 w-1.5 rounded-full", dot[k])} />{k}</span>
          ))}
        </div>
      </section>

      <h2 className="title-section mb-3">{label}</h2>
      <div className="mb-8 space-y-2.5">
        {dayEvents.map((e) => <EventRow key={e.title} {...e} />)}
        {!dayEvents.length && <p className="card text-meta p-6 text-center">Nada agendado para este dia.</p>}
      </div>

      <h2 className="title-section mb-3">Provas</h2>
      <div className="space-y-2.5">
        {events.filter((e) => e.kind === "Prova" && e.day >= 20).map((e) => (
          <div key={e.title} className="card flex items-center gap-3.5 p-3.5">
            <span className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-amber/15 py-1.5 text-amber">
              <span className="text-base font-bold leading-none tabular-nums">{e.day}</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">out</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="title-item">{e.title}</p>
              <p className="text-meta mt-0.5">{e.subject} · {e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EventRow({ time, title, subject, kind }: (typeof events)[number]) {
  return (
    <div className="card flex items-center gap-3.5 p-3.5">
      <span className="w-12 shrink-0 text-center text-sm font-semibold tabular-nums">{time}</span>
      <span className={cn("h-9 w-0.5 rounded-full", dot[kind])} />
      <div className="min-w-0 flex-1">
        <p className="title-item">{title}</p>
        <p className="text-meta mt-0.5">{subject}</p>
      </div>
    </div>
  );
}
