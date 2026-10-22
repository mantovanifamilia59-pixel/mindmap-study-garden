import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, FileText, Sparkles } from "lucide-react";
import { BackButton, IconTile, Segmented } from "@/components/AppShell";
import { getAula, getSubject, aulaNotes, tones, plural } from "@/lib/study-data";

export const Route = createFileRoute("/anotacoes/$materia/$aula/")({
  loader: ({ params }) => {
    const aula = getAula(params.materia, params.aula);
    if (!aula || !getSubject(params.materia)) throw notFound();
    return { materia: params.materia, aula: aula.slug, title: `Aula ${aula.num} — ${aula.title}` };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Aula"} — StudyFlow` },
      { name: "description", content: "Anotações e resumo desta aula." },
      { property: "og:title", content: `${loaderData?.title ?? "Aula"} — StudyFlow` },
      { property: "og:description", content: "Anotações e resumo da aula." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AulaPage,
});

function AulaPage() {
  const { materia, aula, title } = Route.useLoaderData();
  const a = getAula(materia, aula)!;
  const s = getSubject(materia)!;
  const [view, setView] = useState<"anotacoes" | "resumo">("anotacoes");
  const [q, setQ] = useState("");
  const all = aulaNotes(materia, aula);
  const list = all.filter((n) => n.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="mb-5"><BackButton /></div>
      <header className="mb-6">
        <h1 className="title-page">{title}</h1>
        <p className="text-meta mt-1.5">{a.date} · {plural(all.length, "anotação", "anotações")}</p>
      </header>

      <Segmented value={view} onChange={setView} options={[["anotacoes", "Anotações"], ["resumo", "Resumo"]] as const} />

      {view === "anotacoes" ? (
        <>
          <div className="mb-4 flex gap-2">
            <label className="card flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar anotações..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </label>
            <button aria-label="Filtrar" className="card flex w-12 items-center justify-center rounded-xl text-muted-foreground"><SlidersHorizontal className="h-4 w-4" /></button>
          </div>
          <div className="space-y-2.5">
            {list.map((n) => (
              <Link key={n.slug} to="/anotacoes/$materia/$aula/$nota" params={{ materia, aula, nota: n.slug }} className="card flex gap-3.5 p-4 transition hover:border-primary/40">
                <IconTile icon={FileText} className={tones[s.tone].tile} />
                <div className="min-w-0 flex-1">
                  <p className="title-item">{n.title}</p>
                  <p className="text-meta mt-0.5">{n.date} · {n.time}</p>
                  <p className="mt-2 line-clamp-1 text-[13px] text-muted-foreground">{n.preview}</p>
                </div>
              </Link>
            ))}
            {!list.length && <p className="card text-meta p-6 text-center">Nenhuma anotação nesta aula ainda.</p>}
          </div>
        </>
      ) : (
        <section className="card p-5">
          <p className="mb-3 flex items-center gap-2 title-item"><Sparkles className="h-4 w-4 text-violet" /> Resumo da aula</p>
          {all.length ? (
            <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
              {all.map((n) => <li key={n.slug}><span className="font-medium text-foreground">{n.title}:</span> {n.preview}</li>)}
            </ul>
          ) : (
            <p className="text-meta">Adicione anotações para gerar o resumo desta aula.</p>
          )}
        </section>
      )}
    </>
  );
}
