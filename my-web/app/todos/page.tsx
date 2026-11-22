"use client";

import { useEffect, useState } from "react";
import TodoItem from "@/components/TodoItem";
import type { Todo } from "@/lib/todos";

const JSON_HEADERS = { "Content-Type": "application/json" };

// เรียก API และโยน error เมื่อไม่สำเร็จ
async function callApi(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? `เกิดข้อผิดพลาด (${res.status})`);
  return data;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // โหลดรายการครั้งแรกตอนเปิดหน้า
  useEffect(() => {
    callApi("/api/todos")
      .then((data: Todo[]) => {
        setTodos(data);
        setStatus("ready");
      })
      .catch(() => setStatus("failed"));
  }, []);

  // ทำงานกับ API แล้วแสดง error ถ้าพลาด
  async function attempt(action: () => Promise<void>) {
    setError("");
    try {
      await action();
      return true;
    } catch (err) {
      // TypeError = ต่อเซิร์ฟเวอร์ไม่ได้
      setError(
        err instanceof Error && !(err instanceof TypeError)
          ? err.message
          : "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง"
      );
      return false;
    }
  }

  // เพิ่มงานใหม่ผ่าน API (POST /api/todos)
  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdding(true);
    await attempt(async () => {
      const created: Todo = await callApi("/api/todos", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ title }),
      });
      setTodos((prev) => [...prev, created]);
      setTitle("");
    });
    setAdding(false);
  }

  // ติ๊ก หรือแก้ชื่องาน (PATCH /api/todos/[id])
  function update(id: string, changes: Partial<Omit<Todo, "id">>) {
    return attempt(async () => {
      const updated: Todo = await callApi(`/api/todos/${id}`, {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify(changes),
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    });
  }

  // ลบรายการ (DELETE /api/todos/[id])
  function remove(id: string) {
    return attempt(async () => {
      await callApi(`/api/todos/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    });
  }

  const ready = status === "ready";
  const total = todos.length;
  const completed = todos.filter((t) => t.done).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  // layout มี <main> อยู่แล้ว จึงใช้ <section>
  return (
    <section className="mx-auto w-full max-w-2xl py-6 sm:py-10">
      <header className="rounded-3xl bg-linear-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-lg shadow-sky-500/20 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">งานของฉัน</h1>
            <p className="mt-2 text-sky-50">
              {!ready
                ? "รายการสิ่งที่ต้องทำ"
                : total > 0 && completed === total
                  ? "เยี่ยมมาก เสร็จครบทุกงานแล้ว 🎉"
                  : `เหลืออีก ${total - completed} งาน`}
            </p>
          </div>
          {ready && <p className="text-4xl font-bold">{percent}%</p>}
        </div>

        <div
          role="progressbar"
          aria-label="ความคืบหน้า"
          aria-valuenow={percent}
          className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/25"
        >
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {ready && <p className="mt-2 text-sm text-sky-50">เสร็จแล้ว {completed} จาก {total} งาน</p>}
      </header>

      <form onSubmit={handleAdd} className="mt-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          readOnly={adding}
          aria-label="ชื่องานใหม่"
          placeholder="วันนี้ต้องทำอะไรบ้าง..."
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 dark:border-slate-800 dark:bg-slate-900"
        />
        <button
          type="submit"
          disabled={!ready || adding || !title.trim()}
          className="shrink-0 rounded-2xl bg-sky-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
        >
          + เพิ่ม
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {status === "loading" && <p className="py-12 text-center text-slate-500">กำลังโหลด...</p>}

      {status === "failed" && (
        <p role="alert" className="py-12 text-center text-red-600 dark:text-red-400">
          โหลดรายการไม่สำเร็จ กรุณารีเฟรชหน้า
        </p>
      )}

      {ready && total === 0 && (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center text-slate-500 dark:border-slate-800">
          <p className="text-4xl">📝</p>
          <p className="mt-3">ยังไม่มีงาน เพิ่มงานแรกได้เลย</p>
        </div>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={(changes) => update(todo.id, changes)}
            onDelete={() => remove(todo.id)}
          />
        ))}
      </ul>
    </section>
  );
}
