import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_BACKEND_URL;
  try {
    if (base) {
      const r = await fetch(`${base.replace(/\/$/, "")}/agents`, {
        cache: "no-store",
      });
      if (!r.ok) throw new Error("backend error");
      const jsonData = await r.json()
      return NextResponse.json(jsonData.data.agents);
    }
  } catch(e) {
    console.log(e)
    return [];
  }
  // return NextResponse.json([
  //   { id: 1, name: "Fyn the Fox", status: "Active", calls: 7, uptime: 99.2 },
  //   { id: 2, name: "Luna", status: "Idle", calls: 5, uptime: 96.8 },
  //   { id: 3, name: "Aiden", status: "Error", calls: 2, uptime: 92.5 },
  // ]);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const base = process.env.REAL_BACKEND_BASE;
  if (base) {
    const r = await fetch(`${base.replace(/\/$/, "")}/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(await r.json(), { status: r.status });
  }
  // mock create OK
  return NextResponse.json({ ok: true, id: Date.now(), ...body });
}
