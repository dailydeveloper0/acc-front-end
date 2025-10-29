import { NextResponse } from 'next/server'
  // const base = process.env.NEXT_BACKEND_URL;
  const base = 'http://localhost:3003/api/v1'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(()=>({}))
  
  if (base) {
    const r = await fetch(`${base.replace(/\/$/, '')}/agents/${params.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
     if (!r.ok) throw new Error("backend error");
      const jsonData = await r.json()
      return NextResponse.json(jsonData.data.agent.status);
    // return NextResponse.json(await r.json(), { status: r.status })
  }
  return NextResponse.json({ ok: true, id: params.id, ...body })
}
