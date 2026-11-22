"use client";

import { useRef, useState } from "react";
import type { Todo } from "@/lib/todos";

type Props = {
  todo: Todo;
  // คืนค่า true เมื่อบันทึกหรือลบสำเร็จ
  onUpdate: (changes: Partial<Omit<Todo, "id">>) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
};

const BUTTON = "rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-50";
const SECONDARY = `${BUTTON} text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800`;

export default function TodoItem({ todo, onUpdate, onDelete }: Props) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [draft, setDraft] = useState("");
  // ค่าที่แสดงทันทีระหว่างรอ API (null = ใช้ค่าจริง)
  const [pendingDone, setPendingDone] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const running = useRef(false);

  const done = pendingDone ?? todo.done;

  // กันการกดซ้ำระหว่างรอ API
  async function run(action: () => Promise<boolean>) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    if (await action()) setMode("view");
    running.current = false;
    setBusy(false);
  }

  function toggle() {
    void run(async () => {
      setPendingDone(!todo.done);
      const ok = await onUpdate({ done: !todo.done });
      setPendingDone(null);
      return ok;
    });
  }

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = draft.trim();
    if (title === todo.title) setMode("view");
    else void run(() => onUpdate({ title }));
  }

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-700">
      {mode === "edit" ? (
        <form onSubmit={save} className="flex flex-wrap justify-end gap-2">
          <input
            autoFocus
            value={draft}
            maxLength={100}
            readOnly={busy}
            aria-label="แก้ไขชื่องาน"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && !busy) setMode("view");
            }}
            className="min-w-0 grow basis-full rounded-lg border sm:basis-0 border-sky-400 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400/40"
          />
          <button
            disabled={busy || !draft.trim()}
            className={`${BUTTON} bg-sky-600 text-white hover:bg-sky-700`}
          >
            บันทึก
          </button>
          <button type="button" disabled={busy} onClick={() => setMode("view")} className={SECONDARY}>
            ยกเลิก
          </button>
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-end gap-1">
          {/* ครอบด้วย label → กดที่ข้อความก็ติ๊กได้ */}
          <label className="flex min-w-0 flex-1 basis-56 cursor-pointer items-center gap-3 p-2">
            <input type="checkbox" checked={done} onChange={toggle} className="peer sr-only" />
            <span
              aria-hidden="true"
              className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-sky-400/50 ${
                done
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-slate-300 text-transparent dark:border-slate-600"
              }`}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3}>
                <path d="m5 12 5 5 9-10" />
              </svg>
            </span>
            <span className={`min-w-0 wrap-anywhere ${done ? "text-slate-400 line-through" : ""}`}>
              {todo.title}
            </span>
          </label>

          {mode === "delete" ? (
            <div className="flex items-center gap-1">
              <span className="px-2 text-sm text-red-600 dark:text-red-400">ลบงานนี้?</span>
              <button
                type="button"
                autoFocus
                disabled={busy}
                onClick={() => run(onDelete)}
                className={`${BUTTON} bg-red-600 text-white hover:bg-red-700`}
              >
                ยืนยัน
              </button>
              <button type="button" disabled={busy} onClick={() => setMode("view")} className={SECONDARY}>
                ยกเลิก
              </button>
            </div>
          ) : (
            <div className="flex gap-1">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setDraft(todo.title);
                  setMode("edit");
                }}
                className={`${BUTTON} text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950`}
              >
                แก้ไข
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setMode("delete")}
                className={`${BUTTON} text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950`}
              >
                ลบ
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
