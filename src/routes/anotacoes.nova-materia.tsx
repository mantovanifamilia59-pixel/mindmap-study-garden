import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CodeXml, Database, Settings, Command, BookOpenText, Save } from "lucide-react";
import { PageHeader, PrimaryButton } from "@/components/AppShell";
import { tones, type Tone } from "@/lib/study-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/anotacoes/nova-materia")({
  head: () => ({
    meta: [
      { title: "Nova matéria — StudyFlow" },
      { name: "description", content: "Adicione uma nova disciplina ao seu estudo." },
      { property: "og:title", content: "Nova matéria — StudyFlow" },
      { property: "og:description", content: "Adicione uma nova disciplina ao seu estudo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewSubject,
});

const icons = [CodeXml, Database, Settings, Command, BookOpenText];
const colors: Tone[] = ["electric", "violet", "cyan", "lime", "amber", "magenta"];

function NewSubject() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(0);
  const [color, setColor] = useState<Tone>("violet");

  return (
    <>
      <PageHeader back title="Nova matéria" eyebrow="Adicione uma nova disciplina ao seu estudo." />

      <div className="space-y-7">
        <div>
          <label htmlFor="nome" className="title-item mb-2 block">Nome da matéria</label>
          <input id="nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Programação" className="field" />
        </div>

        <div>
          <p className="title-item mb-2">Ícone</p>
          <div className="grid grid-cols-5 gap-2.5">
            {icons.map((I, i) => (
              <button key={i} aria-label={`Ícone ${i + 1}`} onClick={() => setIcon(i)} className={cn("flex aspect-square items-center justify-center rounded-xl border transition", icon === i ? cn("border-primary", tones[color].tile) : "border-border bg-surface text-muted-foreground hover:text-foreground")}>
                <I className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="title-item mb-2">Cor da matéria</p>
          <div className="flex gap-3">
            {colors.map((c) => (
              <button key={c} aria-label={`Cor ${c}`} onClick={() => setColor(c)} className={cn("h-9 w-9 rounded-full ring-offset-2 ring-offset-background transition", tones[c].dot, color === c && "ring-2 ring-foreground")} />
            ))}
          </div>
        </div>

        <PrimaryButton onClick={() => navigate({ to: "/anotacoes" })}><Save className="h-4 w-4" /> Salvar matéria</PrimaryButton>
      </div>
    </>
  );
}
