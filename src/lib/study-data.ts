import { useSyncExternalStore } from "react";
import {
  CodeXml,
  Database,
  Settings,
  Command,
  Cpu,
  BookOpenText,
  BookOpen,
  FileText,
  NotebookPen,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import initialDb from "@/data/db.json";

export type Tone = "violet" | "electric" | "lime" | "amber" | "cyan" | "magenta";

export const tones: Record<Tone, { tile: string; text: string; bar: string; dot: string }> = {
  violet: { tile: "bg-violet/15 text-violet", text: "text-violet", bar: "bg-violet", dot: "bg-violet" },
  electric: { tile: "bg-electric/15 text-electric", text: "text-electric", bar: "bg-electric", dot: "bg-electric" },
  lime: { tile: "bg-lime/15 text-lime", text: "text-lime", bar: "bg-lime", dot: "bg-lime" },
  amber: { tile: "bg-amber/15 text-amber", text: "text-amber", bar: "bg-amber", dot: "bg-amber" },
  cyan: { tile: "bg-cyan/15 text-cyan", text: "text-cyan", bar: "bg-cyan", dot: "bg-cyan" },
  magenta: { tile: "bg-magenta/15 text-magenta", text: "text-magenta", bar: "bg-magenta", dot: "bg-magenta" },
};

export const ICON_MAP: Record<string, LucideIcon> = {
  CodeXml,
  Database,
  Settings,
  Command,
  Cpu,
  BookOpenText,
  BookOpen,
  FileText,
  NotebookPen,
  GraduationCap,
  Sparkles,
};

export type RawSubject = {
  slug: string;
  name: string;
  icon: string;
  tone: Tone;
  progress: number;
  favorite: boolean;
  updated: number;
};

export type Subject = {
  slug: string;
  name: string;
  icon: LucideIcon;
  iconName?: string;
  tone: Tone;
  progress: number;
  favorite: boolean;
  updated: number;
};

export type Aula = {
  slug: string;
  subject: string;
  num: string;
  title: string;
  date: string;
};

export type Note = {
  slug: string;
  subject: string;
  aula: string;
  title: string;
  date: string;
  time: string;
  preview: string;
  content: string;
  concepts: string[];
  code?: string[];
};

export type DatabaseSchema = {
  subjects: RawSubject[];
  aulas: Aula[];
  notes: Note[];
};

const STORAGE_KEY = "studyflow_db_v1";

function resolveIcon(iconName?: string): LucideIcon {
  if (!iconName) return BookOpenText;
  return ICON_MAP[iconName] ?? BookOpenText;
}

function parseRawSubject(s: RawSubject): Subject {
  return {
    ...s,
    icon: resolveIcon(s.icon),
    iconName: s.icon,
  };
}

let memoryDb: DatabaseSchema = {
  subjects: [...initialDb.subjects] as RawSubject[],
  aulas: [...initialDb.aulas] as Aula[],
  notes: [...initialDb.notes] as Note[],
};

const listeners = new Set<() => void>();

function getInitialStorage(): DatabaseSchema {
  if (typeof window === "undefined") {
    return memoryDb;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDb));
      return memoryDb;
    }
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (parsed && Array.isArray(parsed.subjects) && Array.isArray(parsed.aulas) && Array.isArray(parsed.notes)) {
      memoryDb = parsed;
      return parsed;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDb));
    return memoryDb;
  } catch (e) {
    console.warn("Aviso ao ler banco de dados local JSON:", e);
    return memoryDb;
  }
}

// Inicializa no cliente
if (typeof window !== "undefined") {
  getInitialStorage();
}

function saveDb(data: DatabaseSchema) {
  memoryDb = data;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Erro ao salvar no banco local JSON:", e);
    }
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getDatabaseSnapshot(): DatabaseSchema {
  return memoryDb;
}

export function useStudyStore(): DatabaseSchema {
  return useSyncExternalStore(subscribe, getDatabaseSnapshot, () => memoryDb);
}

// Getters reativos
export function getSubjects(): Subject[] {
  return memoryDb.subjects.map(parseRawSubject);
}

export function getSubject(slug: string): Subject | undefined {
  const found = memoryDb.subjects.find((s) => s.slug === slug);
  return found ? parseRawSubject(found) : undefined;
}

export function subjectAulas(subjectSlug: string): Aula[] {
  return memoryDb.aulas.filter((a) => a.subject === subjectSlug);
}

export function subjectNotes(subjectSlug: string): Note[] {
  return memoryDb.notes.filter((n) => n.subject === subjectSlug);
}

export function getAula(subjectSlug: string, aulaSlug: string): Aula | undefined {
  return memoryDb.aulas.find((a) => a.subject === subjectSlug && a.slug === aulaSlug);
}

export function aulaNotes(subjectSlug: string, aulaSlug: string): Note[] {
  return memoryDb.notes.filter((n) => n.subject === subjectSlug && n.aula === aulaSlug);
}

export function getNote(subjectSlug: string, aulaSlug: string, noteSlug: string): Note | undefined {
  return memoryDb.notes.find((n) => n.subject === subjectSlug && n.aula === aulaSlug && n.slug === noteSlug);
}

// CRUD - Banco de Dados Local em JSON
export function addSubject(subject: Omit<RawSubject, "progress" | "favorite" | "updated"> & Partial<Pick<RawSubject, "progress" | "favorite" | "updated">>): Subject {
  const newSubject: RawSubject = {
    slug: subject.slug,
    name: subject.name,
    icon: subject.icon || "BookOpenText",
    tone: subject.tone || "violet",
    progress: subject.progress ?? 0,
    favorite: subject.favorite ?? false,
    updated: subject.updated ?? Date.now(),
  };

  const updatedSubjects = [newSubject, ...memoryDb.subjects.filter((s) => s.slug !== newSubject.slug)];
  saveDb({
    ...memoryDb,
    subjects: updatedSubjects,
  });
  return parseRawSubject(newSubject);
}

export function addAula(aula: Aula): Aula {
  const updatedAulas = [...memoryDb.aulas.filter((a) => !(a.subject === aula.subject && a.slug === aula.slug)), aula];
  saveDb({
    ...memoryDb,
    aulas: updatedAulas,
  });
  return aula;
}

export function addNote(note: Note): Note {
  const updatedNotes = [note, ...memoryDb.notes.filter((n) => !(n.subject === note.subject && n.aula === note.aula && n.slug === note.slug))];
  saveDb({
    ...memoryDb,
    notes: updatedNotes,
  });
  return note;
}

export function deleteNote(subjectSlug: string, aulaSlug: string, noteSlug: string) {
  const updatedNotes = memoryDb.notes.filter((n) => !(n.subject === subjectSlug && n.aula === aulaSlug && n.slug === noteSlug));
  saveDb({
    ...memoryDb,
    notes: updatedNotes,
  });
}

export function toggleFavoriteSubject(slug: string) {
  const updatedSubjects = memoryDb.subjects.map((s) => (s.slug === slug ? { ...s, favorite: !s.favorite } : s));
  saveDb({
    ...memoryDb,
    subjects: updatedSubjects,
  });
}

export function resetDatabase() {
  saveDb({
    subjects: [...initialDb.subjects] as RawSubject[],
    aulas: [...initialDb.aulas] as Aula[],
    notes: [...initialDb.notes] as Note[],
  });
}

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// Proxies para compatibilidade transparente com código legado que acessa subjects/aulas/notes diretamente como array
export const subjects: Subject[] = new Proxy([] as Subject[], {
  get(_target, prop, receiver) {
    const list = getSubjects();
    const val = Reflect.get(list, prop, receiver);
    return typeof val === "function" ? val.bind(list) : val;
  },
});

export const aulas: Aula[] = new Proxy([] as Aula[], {
  get(_target, prop, receiver) {
    const list = memoryDb.aulas;
    const val = Reflect.get(list, prop, receiver);
    return typeof val === "function" ? val.bind(list) : val;
  },
});

export const notes: Note[] = new Proxy([] as Note[], {
  get(_target, prop, receiver) {
    const list = memoryDb.notes;
    const val = Reflect.get(list, prop, receiver);
    return typeof val === "function" ? val.bind(list) : val;
  },
});
