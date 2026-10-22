import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, ClipboardList, BookOpen, MessageSquare } from "lucide-react";
import { PageHeader, Segmented } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notificacoes")({
  head: () => ({
    meta: [
      { title: "Notificações — StudyFlow" },
      { name: "description", content: "Lembretes de provas, tarefas, aulas e comentários." },
      { property: "og:title", content: "Notificações — StudyFlow" },
      { property: "og:description", content: "Seus lembretes acadêmicos em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Notifications,
});

type Notif = { id: number; icon: typeof CalendarClock; tile: string; title: string; body: string; time: string; unread: boolean };
const initial: Notif[] = [
  { id: 1, icon: CalendarClock, tile: "bg-amber/15 text-amber", title: "Sua prova está chegando", body: "Prova de banco de dados em 3 dias.", time: "18:24", unread: true },
  { id: 2, icon: ClipboardList, tile: "bg-electric/15 text-electric", title: "Uma tarefa para concluir hoje", body: "Resolver exercícios de árvores.", time: "14:02", unread: true },
  { id: 3, icon: BookOpen, tile: "bg-amber/15 text-amber", title: "Sua próxima aula está na agenda", body: "Estrutura de dados, às 19:10.", time: "09:15", unread: false },
  { id: 4, icon: MessageSquare, tile: "bg-violet/15 text-violet", title: "Novo comentário", body: "Lucas comentou na sua anotação.", time: "Ontem", unread: false },
];

function Notifications() {
  const [tab, setTab] = useState<"todas" | "nao-lidas">("todas");
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => n.unread).length;
  const list = items.filter((n) => tab === "todas" || n.unread);

  return (
    <>
      <PageHeader title="Notificações" eyebrow={unread ? `Você tem ${unread} ${unread === 1 ? "lembrete não lido" : "lembretes não lidos"}.` : "Tudo em dia por aqui."} />

      <Segmented value={tab} onChange={setTab} options={[["todas", `Todas (${items.length})`], ["nao-lidas", `Não lidas (${unread})`]] as const} />

      {unread > 0 && (
        <button onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))} className="mb-3 ml-auto block text-xs font-medium text-violet">Marcar todas como lidas</button>
      )}

      <div className="space-y-2.5">
        {list.map((n) => (
          <button key={n.id} onClick={() => setItems(items.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))} className={cn("card flex w-full items-start gap-3.5 p-3.5 text-left transition", n.unread && "border-primary/30")}>
            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", n.tile)}><n.icon className="h-[18px] w-[18px]" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="title-item">{n.title}</p>
                <span className="text-meta shrink-0 tabular-nums">{n.time}</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p className="text-meta">{n.body}</p>
                {n.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </div>
            </div>
          </button>
        ))}
        {!list.length && <p className="card text-meta p-6 text-center">Nenhuma notificação não lida.</p>}
      </div>
    </>
  );
}
