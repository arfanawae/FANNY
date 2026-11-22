// GET /api/hello
export async function GET() {
  return Response.json({
    message: "สวัสดีคุณ Arfan",
    time: new Date().toISOString(),
    shout: "fan เก",
  });
}
