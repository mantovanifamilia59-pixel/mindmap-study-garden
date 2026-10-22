import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, ChevronRight, ChevronDown, NotebookText, Plus, Network } from "lucide-react";
import { BackButton, IconTile, PrimaryButton, Segmented } from "@/components/AppShell";
import { getSubject, subjectAulas, subjectNotes, aulaNotes, tones, plural } from "@/lib/study-data";

export const Route = createFileRoute("/anotacoes/$materia/")({
  loader: ({ params }) => {
    const subject = getSubject(params.materia);
    if (!subject) throw notFound();
    return { slug: subject.slug, name: subject.name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Matéria"} — StudyFlow` },
      { name: "description", content: `Aulas, anotações e mapa mental de ${loaderData?.name ?? "sua matéria"}.` },
      { property: "og:title", content: `${loaderData?.name ?? "Matéria"} — StudyFlow` },
      { property: "og:description", content: "Aulas e anotações organizadas por matéria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubjectPage,
});

type View = "aulas" | "anotacoes" | "mapa";

function SubjectPage() {
  const { slug } = Route.useLoaderData();
  const s = getSubject(slug)!;
  const [view, setView] = useState<View>("aulas");
  const navigate = useNavigate();
  const aulas = subjectAulas(slug);
  const notes = subjectNotes(slug);

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <BackButton />
        <button aria-label="Editar matéria" className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-elevated hover:text-foreground"><Pencil className="h-4 w-4" /></button>
      </div>

      <header className="mb-6 flex items-center gap-4">
        <IconTile icon={s.icon} size="lg" className={tones[s.tone].tile} />
        <div>
          <h1 className="title-page">{s.name}</h1>
          <p className="text-meta mt-1">{plural(notes.length, "anotação", "anotações")} · {plural(aulas.length, "aula", "aulas")}</p>
        </div>
      </header>

      <Segmented value={view} onChange={setView} options={[["aulas", "Aulas"], ["anotacoes", "Anotações"], ["mapa", "Mapa mental"]] as const} />

      {view === "aulas" && (
        <>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="title-section">Suas aulas</h2>
            <span className="text-meta flex items-center gap-1">Ordenar <ChevronDown className="h-3.5 w-3.5" /></span>
          </div>
          <div className="mb-6 space-y-2.5">
            {aulas.map((a) => (
              <Link key={a.slug} to="/anotacoes/$materia/$aula" params={{ materia: slug, aula: a.slug }} className="card flex items-center gap-3.5 p-3.5 transition hover:border-primary/40">
                <IconTile icon={NotebookText} className="bg-elevated text-violet" />
                <div className="min-w-0 flex-1">
                  <p className="title-item truncate">Aula {a.num} — {a.title}</p>
                  <p className="text-meta mt-0.5">{a.date} · {plural(aulaNotes(slug, a.slug).length, "anotação", "anotações")}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            {!aulas.length && <Empty text="Nenhuma aula cadastrada ainda." />}
          </div>
          <PrimaryButton><Plus className="h-4 w-4" /> Nova aula</PrimaryButton>
        </>
      )}

      {view === "anotacoes" && (
        <div className="space-y-2.5">
          {notes.map((n) => (
            <Link key={n.slug} to="/anotacoes/$materia/$aula/$nota" params={{ materia: slug, aula: n.aula, nota: n.slug }} className="card block p-4 transition hover:border-primary/40">
              <p className="title-item">{n.title}</p>
              <p className="text-meta mt-1">{n.date} · {n.time}</p>
              <p className="mt-2 line-clamp-1 text-[13px] text-muted-foreground">{n.preview}</p>
            </Link>
          ))}
          {!notes.length && <Empty text="Nenhuma anotação nesta matéria." />}
          <PrimaryButton className="mt-4" onClick={() => navigate({ to: "/anotacoes/nova" })}><Plus className="h-4 w-4" /> Nova anotação</PrimaryButton>
        </div>
      )}

      {view === "mapa" && (
        <Link to="/mapas" className="card flex items-center gap-3.5 p-4 transition hover:border-primary/40">
          <IconTile icon={Network} className={tones[s.tone].tile} />
          <div className="flex-1">
            <p className="title-item">Mapa mental de {s.name}</p>
            <p className="text-meta mt-0.5">Abrir em Mapas mentais</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      )}
    </>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="card text-meta p-6 text-center">{text}</p>;
}
