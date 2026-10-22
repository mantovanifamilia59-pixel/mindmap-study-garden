import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, Network, Plus, ChevronDown } from "lucide-react";
import { PageHeader, IconTile, PrimaryButton } from "@/components/AppShell";
import { tones, type Tone } from "@/lib/study-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mapas")({
  head: () => ({
    meta: [
      { title: "Mapas mentais — StudyFlow" },
      { name: "description", content: "Explore seus mapas mentais por matéria ou aula." },
      { property: "og:title", content: "Mapas mentais — StudyFlow" },
      { property: "og:description", content: "Mapas mentais visuais para estudar melhor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Maps,
});

type MindMap = { id: string; subject: string; topic: string; aula: string; tone: Tone; root: string; branches: { name: string; children: string[] }[] };
const maps: MindMap[] = [
  { id: "prog", subject: "Programação", topic: "Lógica de programação", aula: "Aula 01", tone: "violet", root: "Lógica", branches: [{ name: "Fundamentos", children: ["Variáveis", "Operadores"] }, { name: "Controle", children: ["Condicionais", "Laços"] }] },
  { id: "bd", subject: "Banco de dados", topic: "Modelagem e DER", aula: "Aula 02", tone: "electric", root: "Modelagem", branches: [{ name: "Entidades", children: ["Atributos", "Chaves"] }, { name: "Relações", children: ["1:N", "N:N"] }] },
  { id: "es", subject: "Engenharia de software", topic: "Requisitos e análise", aula: "Aula 01", tone: "lime", root: "Requisitos", branches: [{ name: "Tipos", children: ["Funcionais", "Não funcionais"] }, { name: "Levantamento", children: ["Entrevistas", "Protótipos"] }] },
  { id: "so", subject: "Sistemas operacionais", topic: "Processos e threads", aula: "Aula 01", tone: "cyan", root: "Processos", branches: [{ name: "Estados", children: ["Pronto", "Executando"] }, { name: "Threads", children: ["Concorrência", "Sincronização"] }] },
];

function Maps() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("prog");
  const list = maps.filter((m) => `${m.subject} ${m.topic}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Mapas mentais" eyebrow="Explore seus mapas por matéria ou aula." />

      <div className="mb-5 flex gap-2">
        <label className="card flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar mapa..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </label>
        <button aria-label="Filtrar" className="card flex w-12 items-center justify-center rounded-xl text-muted-foreground"><SlidersHorizontal className="h-4 w-4" /></button>
      </div>

      <div className="mb-6 space-y-2.5">
        {list.map((m) => {
          const isOpen = open === m.id;
          return (
            <div key={m.id} className={cn("card overflow-hidden transition", isOpen && "border-primary/40")}>
              <button onClick={() => setOpen(isOpen ? null : m.id)} className="flex w-full items-center gap-3.5 p-3.5 text-left">
                <IconTile icon={Network} className={tones[m.tone].tile} />
                <div className="min-w-0 flex-1">
                  <p className="title-item">{m.subject}</p>
                  <p className="text-meta mt-0.5">{m.topic} · {m.aula}</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", isOpen && "rotate-180")} />
              </button>
              {isOpen && <Tree m={m} />}
            </div>
          );
        })}
        {!list.length && <p className="card text-meta p-6 text-center">Nenhum mapa encontrado.</p>}
      </div>

      <PrimaryButton><Plus className="h-4 w-4" /> Novo mapa</PrimaryButton>
    </>
  );
}

function Tree({ m }: { m: MindMap }) {
  return (
    <div className="border-t border-border bg-background/40 px-4 pb-5 pt-5">
      <div className="flex flex-col items-center">
        <span className={cn("rounded-xl px-4 py-2 text-[13px] font-semibold", tones[m.tone].tile)}>{m.root}</span>
        <span className="h-4 w-px bg-border" />
        <div className="relative grid w-full grid-cols-2 gap-3">
          <span className="absolute left-1/4 right-1/4 top-0 h-px bg-border" />
          {m.branches.map((b) => (
            <div key={b.name} className="flex flex-col items-center">
              <span className="h-3 w-px bg-border" />
              <span className="rounded-lg border border-border bg-elevated px-3 py-1.5 text-xs font-medium">{b.name}</span>
              <span className="h-3 w-px bg-border" />
              <div className="w-full space-y-1.5">
                {b.children.map((c) => (
                  <p key={c} className="rounded-lg border border-border bg-surface px-2 py-1.5 text-center text-[11px] text-muted-foreground">{c}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
