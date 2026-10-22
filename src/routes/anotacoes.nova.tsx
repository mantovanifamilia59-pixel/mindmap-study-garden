import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bold, Italic, Underline, Strikethrough, List, Image, CalendarDays, Clock, Save } from "lucide-react";
import { PageHeader, PrimaryButton } from "@/components/AppShell";

export const Route = createFileRoute("/anotacoes/nova")({
  head: () => ({
    meta: [
      { title: "Nova anotação — StudyFlow" },
      { name: "description", content: "Crie uma nova anotação para sua aula." },
      { property: "og:title", content: "Nova anotação — StudyFlow" },
      { property: "og:description", content: "Crie uma nova anotação para sua aula." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewNote,
});

function NewNote() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <>
      <PageHeader back title="Nova anotação" eyebrow="Crie uma nova anotação para esta aula." />

      <div className="space-y-6">
        <div>
          <label htmlFor="titulo" className="title-item mb-2 block">Título da anotação</label>
          <input id="titulo" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Conceitos de variáveis" className="field" />
        </div>

        <div>
          <label htmlFor="conteudo" className="title-item mb-2 block">Conteúdo</label>
          <div className="card overflow-hidden rounded-xl">
            <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
              {[Bold, Italic, Underline, Strikethrough, List, Image].map((I, i) => (
                <button key={i} type="button" className="rounded-lg p-2 text-muted-foreground transition hover:bg-elevated hover:text-foreground"><I className="h-4 w-4" /></button>
              ))}
            </div>
            <textarea id="conteudo" value={body} onChange={(e) => setBody(e.target.value)} rows={7} placeholder="Digite sua anotação aqui..." className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="data" className="title-item mb-2 block">Data da anotação</label>
            <div className="field flex items-center gap-2.5"><CalendarDays className="h-4 w-4 text-muted-foreground" /><input id="data" defaultValue="20/10/2026" className="w-full bg-transparent outline-none" /></div>
          </div>
          <div>
            <label htmlFor="hora" className="title-item mb-2 block">Horário <span className="font-normal text-muted-foreground">(opcional)</span></label>
            <div className="field flex items-center gap-2.5"><Clock className="h-4 w-4 text-muted-foreground" /><input id="hora" defaultValue="10:24" className="w-full bg-transparent outline-none" /></div>
          </div>
        </div>

        <PrimaryButton onClick={() => navigate({ to: "/anotacoes" })}><Save className="h-4 w-4" /> Salvar anotação</PrimaryButton>
      </div>
    </>
  );
}
