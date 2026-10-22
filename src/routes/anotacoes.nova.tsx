import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bold, Italic, Underline, Strikethrough, List, Image, CalendarDays, Clock, Save, BookOpen, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, PrimaryButton } from "@/components/AppShell";
import { getSubjects, subjectAulas, addNote, addAula } from "@/lib/study-data";

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function NewNote() {
  const navigate = useNavigate();
  const subjectsList = getSubjects();

  const [selectedSubject, setSelectedSubject] = useState(subjectsList[0]?.slug ?? "programacao");
  const availableAulas = subjectAulas(selectedSubject);
  const [selectedAula, setSelectedAula] = useState(availableAulas[0]?.slug ?? "aula-01");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(() =>
    new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
  );
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  );

  const handleSubjectChange = (newSubjectSlug: string) => {
    setSelectedSubject(newSubjectSlug);
    const aulas = subjectAulas(newSubjectSlug);
    setSelectedAula(aulas[0]?.slug ?? "aula-01");
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Por favor, preencha o título da anotação.");
      return;
    }

    if (!body.trim()) {
      toast.error("Por favor, digite o conteúdo da anotação.");
      return;
    }

    // Se a matéria não tiver aula cadastrada, cria uma aula 01 automaticamente
    let aulaSlug = selectedAula;
    if (!aulaSlug || availableAulas.length === 0) {
      aulaSlug = "aula-01";
      addAula({
        slug: "aula-01",
        subject: selectedSubject,
        num: "01",
        title: "Introdução",
        date: date,
      });
    }

    const slug = slugify(title) || `nota-${Date.now()}`;
    const preview = body.length > 80 ? body.slice(0, 80) + "..." : body;

    // Extrai linhas ou palavras como conceitos simples
    const concepts = body
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 3 && l.length < 35)
      .slice(0, 4);

    if (concepts.length === 0) {
      concepts.push(title.trim());
    }

    addNote({
      slug,
      subject: selectedSubject,
      aula: aulaSlug,
      title: title.trim(),
      date,
      time,
      preview,
      content: body.trim(),
      concepts,
    });

    toast.success("Anotação salva com sucesso!");
    navigate({
      to: "/anotacoes/$materia/$aula/$nota",
      params: { materia: selectedSubject, aula: aulaSlug, nota: slug },
    });
  };

  return (
    <>
      <PageHeader back title="Nova anotação" eyebrow="Crie uma nova anotação para sua aula." />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="materia" className="title-item mb-2 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-violet" /> Matéria
            </label>
            <select
              id="materia"
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="field w-full cursor-pointer bg-surface text-foreground"
            >
              {subjectsList.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="aula" className="title-item mb-2 flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-electric" /> Aula
            </label>
            <select
              id="aula"
              value={selectedAula}
              onChange={(e) => setSelectedAula(e.target.value)}
              className="field w-full cursor-pointer bg-surface text-foreground"
            >
              {availableAulas.length > 0 ? (
                availableAulas.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    Aula {a.num} — {a.title}
                  </option>
                ))
              ) : (
                <option value="aula-01">Aula 01 — Introdução (Nova)</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="titulo" className="title-item mb-2 block">
            Título da anotação
          </label>
          <input
            id="titulo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Conceitos de variáveis"
            className="field w-full"
          />
        </div>

        <div>
          <label htmlFor="conteudo" className="title-item mb-2 block">
            Conteúdo
          </label>
          <div className="card overflow-hidden rounded-xl">
            <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
              {[Bold, Italic, Underline, Strikethrough, List, Image].map((I, i) => (
                <button
                  key={i}
                  type="button"
                  className="rounded-lg p-2 text-muted-foreground transition hover:bg-elevated hover:text-foreground"
                >
                  <I className="h-4 w-4" />
                </button>
              ))}
            </div>
            <textarea
              id="conteudo"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={7}
              placeholder="Digite sua anotação aqui..."
              className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="data" className="title-item mb-2 block">
              Data da anotação
            </label>
            <div className="field flex items-center gap-2.5">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <input
                id="data"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="hora" className="title-item mb-2 block">
              Horário <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <div className="field flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <input
                id="hora"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <PrimaryButton onClick={handleSave}>
          <Save className="h-4 w-4" /> Salvar anotação
        </PrimaryButton>
      </div>
    </>
  );
}
