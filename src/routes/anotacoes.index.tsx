import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, Star, ChevronRight, Plus } from "lucide-react";
import { PageHeader, IconTile, PrimaryButton } from "@/components/AppShell";
import { subjects, subjectNotes, subjectAulas, tones, plural } from "@/lib/study-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/anotacoes/")({
  head: () => ({
    meta: [
      { title: "Minhas matérias — StudyFlow" },
      { name: "description", content: "Organize suas anotações de aula por disciplina." },
      { property: "og:title", content: "Minhas matérias — StudyFlow" },
      { property: "og:description", content: "Suas anotações organizadas por disciplina." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Subjects,
});

const filters = ["Todas", "Favoritas", "Recentes", "A-Z"] as const;

function Subjects() {
  const [f, setF] = useState<(typeof filters)[number]>("Todas");
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  let list = subjects.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  if (f === "Favoritas") list = list.filter((s) => s.favorite);
  if (f === "Recentes") list = [...list].sort((a, b) => b.updated - a.updated);
  if (f === "A-Z") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return (
    <>
      <PageHeader title="Minhas matérias" eyebrow="Organize seus estudos por disciplina." />

      <label className="card mb-4 flex items-center gap-3 rounded-xl px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar matéria..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
      </label>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((x) => (
          <button key={x} onClick={() => setF(x)} className={cn("shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-medium transition", f === x ? "border-transparent bg-primary text-primary-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground")}>{x}</button>
        ))}
      </div>

      <div className="mb-6 space-y-2.5">
        {list.map((s) => (
          <Link key={s.slug} to="/anotacoes/$materia" params={{ materia: s.slug }} className="card flex items-center gap-3.5 p-3.5 transition hover:border-primary/40">
            <IconTile icon={s.icon} className={tones[s.tone].tile} />
            <div className="min-w-0 flex-1">
              <p className="title-item truncate">{s.name}</p>
              <p className="text-meta mt-0.5">{plural(subjectNotes(s.slug).length, "anotação", "anotações")} · {plural(subjectAulas(s.slug).length, "aula", "aulas")}</p>
            </div>
            {s.favorite ? <Star className="h-4 w-4 fill-primary text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </Link>
        ))}
        {!list.length && <p className="text-meta py-6 text-center">Nenhuma matéria encontrada.</p>}
      </div>

      <PrimaryButton onClick={() => navigate({ to: "/anotacoes/nova-materia" })}><Plus className="h-4 w-4" /> Nova matéria</PrimaryButton>
    </>
  );
}
