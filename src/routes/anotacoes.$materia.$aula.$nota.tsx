import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MoreHorizontal, BookOpen, CalendarDays, ListChecks, CircleCheck } from "lucide-react";
import { BackButton, PrimaryButton } from "@/components/AppShell";
import { getNote, getSubject, tones } from "@/lib/study-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/anotacoes/$materia/$aula/$nota")({
  loader: ({ params }) => {
    const note = getNote(params.materia, params.aula, params.nota);
    if (!note) throw notFound();
    return { materia: params.materia, aula: params.aula, nota: note.slug, title: note.title, preview: note.preview };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Anotação"} — StudyFlow` },
      { name: "description", content: loaderData?.preview ?? "Anotação de aula." },
      { property: "og:title", content: `${loaderData?.title ?? "Anotação"} — StudyFlow` },
      { property: "og:description", content: loaderData?.preview ?? "Anotação de aula." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotePage,
});

function NotePage() {
  const { materia, aula, nota } = Route.useLoaderData();
  const n = getNote(materia, aula, nota)!;
  const s = getSubject(materia)!;
  const [done, setDone] = useState(false);

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <BackButton />
        <button aria-label="Mais opções" className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-elevated hover:text-foreground"><MoreHorizontal className="h-5 w-5" /></button>
      </div>

      <header className="mb-7">
        <h1 className="title-page">{n.title}</h1>
        <div className="mt-3 space-y-1.5">
          <p className={cn("flex items-center gap-2 text-[13px] font-medium", tones[s.tone].text)}><BookOpen className="h-4 w-4" /> {s.name}</p>
          <p className="text-meta flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {n.date} · {n.time}</p>
        </div>
      </header>

      <article className="space-y-7">
        <section>
          <h2 className="title-section mb-2">Conteúdo</h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">{n.content}</p>
        </section>

        <section className="card p-4">
          <p className="title-item mb-3 flex items-center gap-2"><ListChecks className="h-4 w-4 text-violet" /> Principais conceitos</p>
          <ul className="space-y-2 pl-1">
            {n.concepts.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-sm text-muted-foreground"><span className="h-1 w-1 rounded-full bg-violet" />{c}</li>
            ))}
          </ul>
        </section>

        {n.code && (
          <section>
            <h2 className="title-section mb-2">Exemplo prático</h2>
            <pre className="card overflow-x-auto p-4 font-mono text-[12.5px] leading-6">
              {n.code.map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-3 select-none text-right text-muted-foreground/60">{i + 1}</span>
                  <code className="text-foreground">{line}</code>
                </div>
              ))}
            </pre>
          </section>
        )}

        {done ? (
          <button onClick={() => setDone(false)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lime/30 bg-lime/10 py-3.5 text-sm font-semibold text-lime">
            <CircleCheck className="h-4 w-4" /> Estudado
          </button>
        ) : (
          <PrimaryButton onClick={() => setDone(true)}><CircleCheck className="h-4 w-4" /> Marcar como estudado</PrimaryButton>
        )}
      </article>
    </>
  );
}
