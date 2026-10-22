import { Link, useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Home, CalendarDays, NotebookPen, Network, Bell, Plus, X, CheckSquare, ArrowLeft, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Início", icon: Home },
  { to: "/anotacoes", label: "Anotações", icon: NotebookPen },
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/mapas", label: "Mapas mentais", icon: Network },
  { to: "/notificacoes", label: "Notificações", icon: Bell },
] as const;

/** Screens that take the whole page: forms and the note reader. */
const isFullscreen = (p: string) =>
  p === "/anotacoes/nova" || p === "/anotacoes/nova-materia" || p.split("/").filter(Boolean).length >= 4;

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const full = isFullscreen(pathname);
  const showFab = !full && (pathname === "/" || (pathname.startsWith("/anotacoes/") && pathname.split("/").filter(Boolean).length === 3));

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const quick = [
    { label: "Nova anotação", icon: NotebookPen, tone: "text-violet", run: () => navigate({ to: "/anotacoes/nova" }) },
    { label: "Nova matéria", icon: BookOpen, tone: "text-electric", run: () => navigate({ to: "/anotacoes/nova-materia" }) },
    { label: "Nova tarefa", icon: CheckSquare, tone: "text-lime", run: () => flash("Tarefa criada ✓") },
    { label: "Novo evento", icon: CalendarDays, tone: "text-amber", run: () => navigate({ to: "/calendario" }) },
  ];

  return (
    <div className={cn("mx-auto min-h-screen max-w-md px-5 pt-8", full ? "pb-10" : "pb-32")}>
      {children}

      {toast && (
        <div className="card fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm">{toast}</div>
      )}

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-background/80" onClick={() => setOpen(false)}>
          <div className="card mb-40 w-[min(92vw,26rem)] rounded-3xl p-4" onClick={(e) => e.stopPropagation()}>
            <p className="mb-3 px-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">Criar rapidamente</p>
            <div className="grid grid-cols-2 gap-3">
              {quick.map((q) => (
                <button
                  key={q.label}
                  onClick={() => { setOpen(false); q.run(); }}
                  className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-elevated p-4 text-left transition hover:border-primary/50"
                >
                  <q.icon className={cn("h-5 w-5", q.tone)} />
                  <span className="text-sm font-medium">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showFab && (
        <button
          aria-label="Criar novo"
          onClick={() => setOpen((o) => !o)}
          className="bg-gradient-primary shadow-glow fixed bottom-24 right-[max(1.25rem,calc(50vw-13rem))] z-50 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground transition active:scale-95"
        >
          {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </button>
      )}

      {!full && (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface">
          <div className="mx-auto flex max-w-md items-center justify-between px-2 py-2">
            {tabs.map((t) => (
              <Tab key={t.to} {...t} badge={t.to === "/notificacoes" ? 2 : 0} active={t.to === "/" ? pathname === "/" : pathname.startsWith(t.to)} />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

function Tab({ to, label, icon: Icon, active, badge }: { to: (typeof tabs)[number]["to"]; label: string; icon: typeof Home; active: boolean; badge: number }) {
  return (
    <Link to={to} className={cn("flex min-w-12 flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 text-[10px] font-medium transition", active ? "text-violet" : "text-muted-foreground hover:text-foreground")}>
      <span className="relative">
        <Icon className="h-5 w-5" />
        {badge > 0 && (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">{badge}</span>
        )}
      </span>
      {label}
      <span className={cn("h-0.5 w-6 rounded-full", active ? "bg-primary" : "bg-transparent")} />
    </Link>
  );
}

export function PageHeader({ eyebrow, title, right, back }: { eyebrow?: string; title: string; right?: ReactNode; back?: boolean }) {
  return (
    <header className="mb-6">
      {(back || right) && (
        <div className="mb-4 flex items-center justify-between">
          {back ? <BackButton /> : <span />}
          {right}
        </div>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {eyebrow && <p className="mt-1 text-sm text-muted-foreground">{eyebrow}</p>}
    </header>
  );
}

export function BackButton() {
  const router = useRouter();
  return (
    <button aria-label="Voltar" onClick={() => router.history.back()} className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-elevated">
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}

export function IconTile({ icon: Icon, className, size = "md" }: { icon: typeof Home; className?: string; size?: "md" | "lg" }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-xl", size === "lg" ? "h-14 w-14 rounded-2xl" : "h-11 w-11", className)}>
      <Icon className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} />
    </span>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: readonly (readonly [T, string])[] }) {
  return (
    <div className="card mb-5 flex rounded-full p-1">
      {options.map(([key, label]) => (
        <button key={key} onClick={() => onChange(key)} className={cn("flex-1 rounded-full py-2 text-sm font-medium transition", value === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function PrimaryButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={cn("bg-gradient-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-primary-foreground transition active:scale-[0.99]", className)}>
      {children}
    </button>
  );
}
