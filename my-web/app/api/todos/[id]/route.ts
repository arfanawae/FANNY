import { deleteTodo, updateTodo, type Todo } from "@/lib/todos";

type Context = RouteContext<"/api/todos/[id]">;

const notFound = () =>
  Response.json({ error: "ไม่พบรายการนี้" }, { status: 404 });

// PATCH /api/todos/[id]  ส่ง { title } หรือ { done } หรือทั้งคู่
export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  // รับเฉพาะ title กับ done → แก้ id ผ่าน API ไม่ได้
  const changes: Partial<Omit<Todo, "id">> = {};

  if (body?.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title || title.length > 100) {
      return Response.json(
        { error: "title ต้องมี 1–100 ตัวอักษร" },
        { status: 400 }
      );
    }
    changes.title = title;
  }

  if (body?.done !== undefined) {
    if (typeof body.done !== "boolean") {
      return Response.json(
        { error: "done ต้องเป็น true หรือ false" },
        { status: 400 }
      );
    }
    changes.done = body.done;
  }

  if (Object.keys(changes).length === 0) {
    return Response.json(
      { error: "ต้องส่ง title หรือ done" },
      { status: 400 }
    );
  }

  const todo = updateTodo(id, changes);
  return todo ? Response.json(todo) : notFound();
}

// DELETE /api/todos/[id]
export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  return deleteTodo(id) ? new Response(null, { status: 204 }) : notFound();
}
